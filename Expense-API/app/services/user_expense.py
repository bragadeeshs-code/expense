"""User Expense Service."""

from fastapi import HTTPException, status
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import joinedload
from sqlmodel import Session, func, select

from app.config.database import get_thread_session
from app.config.logger import get_logger
from app.models.expense import Expense
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.user import User
from app.models.user_expense import UserExpense
from app.models.user_expense_approval import UserExpenseApproval
from app.schemas.user_expense import ExpenseStatus
from app.schemas.user_expense_approval import ApprovalStatus
from app.services.connection import post_to_webhook_connections
from app.services.expense_tracking import (
    check_project_budget_threshold,
    update_user_totals,
)

logger = get_logger(__name__)


async def approve_user_expense(
    session: Session,
    user_expense_id: int,
    approver: User,
    approval_status: ApprovalStatus,
) -> UserExpenseApproval:
    """Approve or reject a user expense."""
    user_expense = session.exec(
        select(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.id == user_expense_id,
            Expense.organization_id == approver.organization_id,
        )
        .options(joinedload(UserExpense.expense).joinedload(Expense.extracted_expense))
    ).first()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User expense not found",
        )

    bill_date = user_expense.expense.bill_date

    if user_expense.status == ExpenseStatus.REJECTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This expense has already been rejected",
        )

    if user_expense.status != ExpenseStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending expenses can be approved or rejected",
        )

    project = user_expense.project

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User expense does not belong to a project",
        )

    approver_level = session.exec(
        select(ProjectApprovalMatrix.approval_level).where(
            ProjectApprovalMatrix.project_id == project.id,
            ProjectApprovalMatrix.approver_id == approver.id,
        )
    ).one_or_none()

    if not approver_level:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to approve/reject this project expense",
        )

    approval = session.exec(
        select(UserExpenseApproval).where(
            UserExpenseApproval.user_expense_id == user_expense_id,
            UserExpenseApproval.approver_id == approver.id,
            UserExpenseApproval.approval_level == approver_level,
            UserExpenseApproval.status == ApprovalStatus.PENDING,
        )
    ).one_or_none()

    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This expense is not yet at your approval level or has already been acted on",
        )

    approval.status = approval_status

    if approval_status == ApprovalStatus.APPROVED:
        user_expense.highest_approved_level = approver_level

        create_next_pending_user_expense_approval(
            session=session,
            user_expense=user_expense,
            project_id=project.id,
        )

    session.flush()

    resolve_user_expense_status(
        session=session,
        user_expense=user_expense,
        project=project,
    )

    if user_expense.status == ExpenseStatus.APPROVED:
        update_user_totals(
            session=session,
            amount=user_expense.amount,
            user_id=user_expense.user_id,
            bill_date=bill_date,
        )
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update the user expense approval: {str(e)}",
        )

    if user_expense.status == ExpenseStatus.APPROVED:
        expense = user_expense.expense
        await post_to_webhook_connections(
            data=user_expense.expense.extracted_expense.processed_data_updated,
            organization_id=approver.organization_id,
            category=expense.category,
            sub_category=expense.sub_category,
        )
        with get_thread_session() as db_session:
            check_project_budget_threshold(
                session=db_session,
                project_id=project.id,
                org_id=project.organization_id,
                bill_date=bill_date,
                new_expense_amount=user_expense.amount,
                ignore_user_expense_id=user_expense.id,
            )

    return approval


def create_next_pending_user_expense_approval(
    session: Session,
    user_expense: UserExpense,
    project_id: int,
) -> None:
    """Create the next pending UserExpenseApproval based on current approval progress."""
    current_level = user_expense.highest_approved_level or 0
    next_level = current_level + 1

    approver_id = session.exec(
        select(ProjectApprovalMatrix.approver_id).where(
            ProjectApprovalMatrix.project_id == project_id,
            ProjectApprovalMatrix.approval_level == next_level,
        )
    ).one_or_none()

    if not approver_id:
        return

    stmt = (
        insert(UserExpenseApproval)
        .values(
            user_expense_id=user_expense.id,
            approver_id=approver_id,
            approval_level=next_level,
            status=ApprovalStatus.PENDING,
        )
        .on_conflict_do_nothing(
            index_elements=["user_expense_id", "approver_id", "approval_level"]
        )
    )

    session.exec(stmt)


def resolve_user_expense_status(
    session: Session,
    user_expense: UserExpense,
    project: Project,
):
    """Resolve overall user_expense.status based on approver decisions."""
    approvals = session.exec(
        select(UserExpenseApproval.status).where(
            UserExpenseApproval.user_expense_id == user_expense.id
        )
    ).all()

    if not approvals:
        return

    if ApprovalStatus.REJECTED in approvals:
        user_expense.status = ExpenseStatus.REJECTED
        return

    if ApprovalStatus.PENDING in approvals or not user_expense.highest_approved_level:
        return

    max_level = session.exec(
        select(func.max(ProjectApprovalMatrix.approval_level)).where(
            ProjectApprovalMatrix.project_id == project.id
        )
    ).one()

    max_level = max_level or 0

    if user_expense.highest_approved_level == max_level:
        user_expense.status = ExpenseStatus.APPROVED
