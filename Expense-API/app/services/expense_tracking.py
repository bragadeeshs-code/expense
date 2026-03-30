"""Expense tracking service layer."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy.dialects.postgresql import insert
from sqlmodel import Session, and_, case, exists, func, or_, select

from app.config.config import settings
from app.config.logger import get_logger
from app.models.expense import Expense
from app.models.expense_tracking import UserDailyExpense, UserMonthlyExpense
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.project_member import ProjectMember
from app.models.user import User
from app.models.user_expense import UserExpense
from app.schemas.project import ProjectSpendResponse
from app.schemas.user_expense import ExpenseStatus
from app.utils.datetime import get_month_start_end
from app.utils.email import send_budget_alert_email

logger = get_logger(__name__)


def update_user_totals(
    session: Session, user_id: int, amount: Decimal, bill_date: date
) -> None:
    """Update daily & monthly totals for the bill date."""
    first_day_of_month = date(bill_date.year, bill_date.month, 1)

    daily_stmt = (
        insert(UserDailyExpense)
        .values(user_id=user_id, day=bill_date, daily_spent=amount)
        .on_conflict_do_update(
            index_elements=[UserDailyExpense.user_id, UserDailyExpense.day],
            set_={"daily_spent": UserDailyExpense.daily_spent + amount},
        )
    )
    session.exec(daily_stmt)

    monthly_stmt = (
        insert(UserMonthlyExpense)
        .values(user_id=user_id, month=first_day_of_month, monthly_spent=amount)
        .on_conflict_do_update(
            index_elements=[UserMonthlyExpense.user_id, UserMonthlyExpense.month],
            set_={"monthly_spent": UserMonthlyExpense.monthly_spent + amount},
        )
    )
    session.exec(monthly_stmt)


def get_daily_spent(session: Session, user_id: int, bill_date: date) -> Decimal:
    """Return the total amount the user has on bill date."""
    stmt = select(UserDailyExpense.daily_spent).where(
        UserDailyExpense.user_id == user_id, UserDailyExpense.day == bill_date
    )
    result = session.exec(stmt).first()
    return Decimal(result or 0)


def get_monthly_spent(session: Session, user_id: int, bill_date: date) -> Decimal:
    """Return the total amount the user has spent in the bill date's month."""
    first_day_of_month = date(bill_date.year, bill_date.month, 1)

    stmt = select(UserMonthlyExpense.monthly_spent).where(
        UserMonthlyExpense.user_id == user_id,
        UserMonthlyExpense.month == first_day_of_month,
    )
    result = session.exec(stmt).first()
    return Decimal(result or 0)


def get_daily_spent_by_date_range(
    session: Session,
    user_id: int,
    start_date: datetime,
    end_date: datetime,
) -> dict[datetime, Decimal]:
    """Return a mapping of daily spent amounts for the user within the given date range."""
    stmt = (
        select(
            UserDailyExpense.day,
            func.coalesce(func.sum(UserDailyExpense.daily_spent), 0).label(
                "daily_spent"
            ),
        )
        .where(
            UserDailyExpense.user_id == user_id,
            UserDailyExpense.day.between(start_date.date(), end_date.date()),
        )
        .group_by(UserDailyExpense.day)
        .order_by(UserDailyExpense.day)
    )

    rows = session.exec(stmt).all()
    return {
        datetime(row.day.year, row.day.month, row.day.day): row.daily_spent
        for row in rows
    }


def get_team_daily_spent_by_date_range(
    session: Session,
    current_user_id: int,
    organization_id: int,
    start_date: datetime,
    end_date: datetime,
) -> dict[datetime, Decimal]:
    """Return a mapping of daily spent amounts for the team within the given date range."""
    project_scope = and_(
        Project.organization_id == organization_id,
        or_(
            Project.manager_id == current_user_id,
            exists(
                select(1).where(
                    ProjectApprovalMatrix.project_id == Project.id,
                    ProjectApprovalMatrix.approver_id == current_user_id,
                )
            ),
        ),
    )

    stmt = (
        select(
            UserDailyExpense.day,
            func.coalesce(func.sum(UserDailyExpense.daily_spent), 0).label(
                "daily_spent"
            ),
        )
        .where(
            exists(
                select(1)
                .select_from(ProjectMember)
                .join(Project, Project.id == ProjectMember.project_id)
                .where(
                    project_scope,
                    ProjectMember.user_id == UserDailyExpense.user_id,
                    ProjectMember.user_id != current_user_id,
                )
            ),
            UserDailyExpense.day.between(start_date.date(), end_date.date()),
        )
        .group_by(UserDailyExpense.day)
        .order_by(UserDailyExpense.day)
    )

    rows = session.exec(stmt).all()
    return {
        datetime(row.day.year, row.day.month, row.day.day): row.daily_spent
        for row in rows
    }


def get_project_current_and_total_spend(
    session: Session,
    project_id: int,
    org_id: int,
    bill_date: date,
    ignore_user_expense_id: int | None = None,
) -> ProjectSpendResponse:
    """Get spend for a specific month (from bill_date or current month), total spend, and project budgets."""
    project_stmt = (
        select(
            Project.monthly_budget,
            Project.total_budget,
            Project.name,
            User.email,
            User.first_name,
        )
        .join(User, User.id == Project.manager_id)
        .where(
            Project.id == project_id,
            Project.organization_id == org_id,
        )
    )

    project_row = session.exec(project_stmt).first()

    monthly_budget, total_budget, project_name, manager_email, manager_name = (
        project_row
    )

    month = bill_date.strftime("%Y-%m")

    start_date, end_date = get_month_start_end(month)

    stmt = (
        select(
            func.coalesce(func.sum(UserExpense.amount), 0).label("total_spent"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            Expense.bill_date.between(
                                start_date.date(), end_date.date()
                            ),
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("month_spent"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.project_id == project_id,
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.organization_id == org_id,
            Expense.bill_date.is_not(None),
        )
    )

    if ignore_user_expense_id is not None:
        stmt = stmt.where(UserExpense.id != ignore_user_expense_id)

    total_spent, month_spent = session.exec(stmt).one()

    return ProjectSpendResponse(
        month_spent=month_spent,
        total_spent=total_spent,
        monthly_budget=monthly_budget,
        total_budget=total_budget,
        project_name=project_name,
        manager_email=manager_email,
        manager_name=manager_name,
    )


def check_project_budget_threshold(
    session: Session,
    project_id: int,
    org_id: int,
    bill_date: date,
    new_expense_amount: Decimal,
    ignore_user_expense_id: int,
) -> None:
    """Check if project budget threshold is crossed after adding a new expense. Only sends email when threshold is crossed for the first time."""
    data = get_project_current_and_total_spend(
        session=session,
        project_id=project_id,
        org_id=org_id,
        bill_date=bill_date,
        ignore_user_expense_id=ignore_user_expense_id,
    )

    if not data:
        return

    threshold = settings.BUDGET_THRESHOLD_PERCENT

    current_month_percent = (
        (data.month_spent / data.monthly_budget) * 100
        if data.monthly_budget > 0
        else Decimal(0)
    )

    current_total_percent = (
        (data.total_spent / data.total_budget) * 100
        if data.total_budget > 0
        else Decimal(0)
    )

    new_month_spent = data.month_spent + new_expense_amount
    new_total_spent = data.total_spent + new_expense_amount

    new_month_percent = (
        (new_month_spent / data.monthly_budget) * 100
        if data.monthly_budget > 0
        else Decimal(0)
    )

    new_total_percent = (
        (new_total_spent / data.total_budget) * 100
        if data.total_budget > 0
        else Decimal(0)
    )

    crossed_threshold = (
        current_month_percent < threshold and new_month_percent >= threshold
    ) or (current_total_percent < threshold and new_total_percent >= threshold)

    if crossed_threshold:
        send_budget_alert_email(
            manager_email=data.manager_email,
            manager_name=data.manager_name,
            project_name=data.project_name,
            month_spent=new_month_spent,
            monthly_budget=data.monthly_budget,
            total_spent=new_total_spent,
            total_budget=data.total_budget,
            threshold=threshold,
            bill_date=bill_date,
        )
