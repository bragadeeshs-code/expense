"""User Expense Router."""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_manager_permission
from app.models.user import User
from app.schemas.user_expense_approval import (
    ApproveUserExpenseRequest,
    UserExpenseApprovalResponse,
)
from app.services.user_expense import approve_user_expense

router = APIRouter(prefix="/user-expenses", tags=["User Expenses"])


@router.post(
    "/{user_expense_id}/status",
    response_model=UserExpenseApprovalResponse,
)
async def approve_expense(
    user_expense_id: int,
    payload: ApproveUserExpenseRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_manager_permission),
) -> UserExpenseApprovalResponse:
    """Approve or reject a user expense."""
    return await approve_user_expense(
        session=session,
        user_expense_id=user_expense_id,
        approver=current_user,
        approval_status=payload.status,
    )
