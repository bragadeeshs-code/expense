"""Report service layer for building user and team expense summaries."""

from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import desc
from sqlmodel import Session, case, func, select

from app.models.expense import Expense
from app.models.user import User
from app.models.user_expense import UserExpense
from app.models.user_expense_approval import UserExpenseApproval
from app.schemas.report import (
    CategoryBreakdown,
    MyExpenseTotals,
    MyReportsSummary,
    PendingEmployeeBreakdown,
    TeamApprovalSummary,
    TeamApprovalTrendPoint,
    TeamReportsSummary,
    TopSpender,
    UserExpenseTrendPoint,
    WeeklyExpense,
)
from app.schemas.user_expense import ExpenseStatus
from app.schemas.user_expense_approval import ApprovalStatus
from app.utils.datetime import get_month_range


def get_my_reports_summary(
    current_user_id: int,
    db_session: Session,
    month: str | None,
) -> MyReportsSummary:
    """Return the current user's monthly report summary."""
    start_of_month, start_of_next_month = get_month_range(month)

    totals = get_user_monthly_totals(
        current_user_id,
        db_session,
        start_of_month,
        start_of_next_month,
    )
    claims_summary = get_user_claims_summary(
        current_user_id=current_user_id,
        db_session=db_session,
        start_of_month=start_of_month,
        start_of_next_month=start_of_next_month,
    )
    pending_summary = get_user_pending_summary(
        current_user_id=current_user_id,
        db_session=db_session,
        start_of_month=start_of_month,
        start_of_next_month=start_of_next_month,
    )
    rejected_summary = get_user_rejected_summary(
        current_user_id=current_user_id,
        db_session=db_session,
        start_of_month=start_of_month,
        start_of_next_month=start_of_next_month,
    )

    return MyReportsSummary(
        total_claim_count=claims_summary.total_claim_count,
        total_claim_amount=claims_summary.total_claim_amount,
        pending_count=pending_summary.pending_count,
        pending_amount=pending_summary.pending_amount,
        rejected_count=rejected_summary.rejected_count,
        rejected_amount=rejected_summary.rejected_amount,
        approved_count=totals.approved_count,
        approved_reimbursement_total=totals.approved_reimbursement_total,
        approved_bill_total=totals.approved_bill_total,
        approved_variance_total=totals.approved_variance_total,
        expense_trend=get_user_daily_expense_trend(
            current_user_id=current_user_id,
            db_session=db_session,
            start_of_month=start_of_month,
            start_of_next_month=start_of_next_month,
        ),
        weekly_expenses=get_user_weekly_expenses(
            current_user_id, db_session, start_of_month, start_of_next_month
        ),
        category_breakdown=get_user_category_breakdown(
            current_user_id, db_session, start_of_month, start_of_next_month
        ),
    )


def get_team_reports_summary(
    current_user_id: int,
    db_session: Session,
    month: str | None,
) -> TeamReportsSummary:
    """Return the team report summary for the current user as an approver."""
    start_of_month, start_of_next_month = get_month_range(month)

    totals = get_team_totals(
        current_user_id, db_session, start_of_month, start_of_next_month
    )
    pending_employee_breakdown = get_team_pending_employee_breakdown(
        current_user_id=current_user_id,
        db_session=db_session,
        start_of_month=start_of_month,
        start_of_next_month=start_of_next_month,
    )
    top_spenders = get_team_top_spenders(
        current_user_id=current_user_id,
        db_session=db_session,
        start_of_month=start_of_month,
        start_of_next_month=start_of_next_month,
    )
    return TeamReportsSummary(
        total_spent=totals.total_spent,
        pending_approvals_count=totals.pending_approvals_count,
        pending_amount=totals.pending_amount,
        pending_employee_count=totals.pending_employee_count,
        average_queue_age_days=totals.average_queue_age_days,
        oldest_queue_age_days=totals.oldest_queue_age_days,
        rejection_rate=totals.rejection_rate,
        approval_activity_trend=get_team_daily_approval_trend(
            current_user_id=current_user_id,
            db_session=db_session,
            start_of_month=start_of_month,
            start_of_next_month=start_of_next_month,
        ),
        weekly_expenses=get_team_weekly_expenses(
            current_user_id, db_session, start_of_month, start_of_next_month
        ),
        category_breakdown=get_team_category_breakdown(
            current_user_id, db_session, start_of_month, start_of_next_month
        ),
        pending_employee_breakdown=pending_employee_breakdown,
        top_spenders=top_spenders,
    )


def _get_month_days(start_of_month: datetime, start_of_next_month: datetime) -> list[date]:
    """Return every day within the selected month window."""
    current_day = start_of_month.date()
    end_day = (start_of_next_month - timedelta(days=1)).date()
    month_days: list[date] = []

    while current_day <= end_day:
        month_days.append(current_day)
        current_day += timedelta(days=1)

    return month_days


def _to_utc_datetime(value: datetime) -> datetime:
    """Normalize datetimes to timezone-aware UTC for Python-side comparisons."""
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def get_user_monthly_totals(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> MyExpenseTotals:
    """Fetch monthly approved expense totals for the given user within the provided date range."""
    stmt = (
        select(
            func.count(UserExpense.id).label("approved_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label(
                "approved_reimbursement_total"
            ),
            func.coalesce(func.sum(Expense.total_amount), 0).label("approved_bill_total"),
            func.coalesce(
                func.sum(func.coalesce(Expense.total_amount, 0) - func.coalesce(UserExpense.amount, 0)),
                0,
            ).label("approved_variance_total"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
    )
    result = db_session.exec(stmt).one()

    return MyExpenseTotals(
        total_claim_count=0,
        total_claim_amount=Decimal("0"),
        pending_count=0,
        pending_amount=Decimal("0"),
        rejected_count=0,
        rejected_amount=Decimal("0"),
        approved_count=result.approved_count or 0,
        approved_reimbursement_total=result.approved_reimbursement_total or Decimal("0"),
        approved_bill_total=result.approved_bill_total or Decimal("0"),
        approved_variance_total=result.approved_variance_total or Decimal("0"),
    )


def get_user_claims_summary(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
):
    """Fetch submitted claim count and amount for the given user within the month."""
    submitted_statuses = [
        ExpenseStatus.APPROVED,
        ExpenseStatus.PENDING,
        ExpenseStatus.REJECTED,
    ]
    stmt = (
        select(
            func.count(UserExpense.id).label("total_claim_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label("total_claim_amount"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.submitted_at.is_not(None),
            UserExpense.status.in_(submitted_statuses),
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
    )
    return db_session.exec(stmt).one()


def get_user_pending_summary(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
):
    """Fetch pending claim count and amount for the given user within the month."""
    stmt = (
        select(
            func.count(UserExpense.id).label("pending_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label("pending_amount"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status == ExpenseStatus.PENDING,
            UserExpense.submitted_at.is_not(None),
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
    )
    return db_session.exec(stmt).one()


def get_user_rejected_summary(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
):
    """Fetch rejected claim count and amount for the given user within the month."""
    stmt = (
        select(
            func.count(UserExpense.id).label("rejected_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label("rejected_amount"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status == ExpenseStatus.REJECTED,
            UserExpense.submitted_at.is_not(None),
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
    )
    return db_session.exec(stmt).one()


def get_team_totals(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> TeamApprovalSummary:
    """Fetch monthly totals for the given approver within the provided date range."""
    queue_age_days = func.extract("epoch", func.now() - UserExpense.submitted_at) / 86400.0
    stmt = (
        select(
            func.count(
                case(
                    (UserExpenseApproval.status == ApprovalStatus.PENDING, 1),
                    else_=None,
                )
            ).label("pending_approvals_count"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.APPROVED,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("total_spent"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.PENDING,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("pending_amount"),
            func.count(
                func.distinct(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.PENDING,
                            UserExpense.user_id,
                        ),
                        else_=None,
                    )
                )
            ).label("pending_employee_count"),
            func.coalesce(
                func.avg(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.PENDING,
                            queue_age_days,
                        ),
                        else_=None,
                    )
                ),
                0,
            ).label("average_queue_age_days"),
            func.coalesce(
                func.max(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.PENDING,
                            queue_age_days,
                        ),
                        else_=None,
                    )
                ),
                0,
            ).label("oldest_queue_age_days"),
            func.count(
                case(
                    (UserExpenseApproval.status == ApprovalStatus.REJECTED, 1),
                    else_=None,
                )
            ).label("rejected_count"),
            func.count(
                case(
                    (
                        UserExpenseApproval.status.in_(
                            [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]
                        ),
                        1,
                    ),
                    else_=None,
                )
            ).label("decided_count"),
        )
        .select_from(UserExpenseApproval)
        .join(UserExpense, UserExpense.id == UserExpenseApproval.user_expense_id)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
    )
    result = db_session.exec(stmt).one()
    rejection_rate = (
        (result.rejected_count / result.decided_count) * 100
        if result.decided_count
        else 0
    )

    return TeamApprovalSummary(
        total_spent=result.total_spent or Decimal("0"),
        pending_approvals_count=result.pending_approvals_count or 0,
        pending_amount=result.pending_amount or Decimal("0"),
        pending_employee_count=result.pending_employee_count or 0,
        average_queue_age_days=float(result.average_queue_age_days or 0),
        oldest_queue_age_days=float(result.oldest_queue_age_days or 0),
        rejection_rate=float(rejection_rate),
    )


def get_user_weekly_expenses(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> list[WeeklyExpense]:
    """Fetch weekly approved expense totals for the given user within the provided date range."""
    stmt = (
        select(
            func.date_trunc("week", Expense.bill_date).label("week_start"),
            func.sum(UserExpense.amount).label("total_amount"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by("week_start")
        .order_by("week_start")
    )
    return db_session.exec(stmt).all()


def get_user_daily_expense_trend(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
) -> list[UserExpenseTrendPoint]:
    """Fetch daily approved and pending expense activity by bill date for the given user."""
    stmt = (
        select(
            Expense.bill_date.label("day"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpense.status == ExpenseStatus.APPROVED,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("approved_amount"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpense.status == ExpenseStatus.PENDING,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("pending_amount"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status.in_([ExpenseStatus.APPROVED, ExpenseStatus.PENDING]),
            Expense.bill_date.is_not(None),
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by(Expense.bill_date)
        .order_by(Expense.bill_date)
    )

    rows = db_session.exec(stmt).all()
    amounts_by_day = {
        row.day: {
            "approved_amount": row.approved_amount or Decimal("0"),
            "pending_amount": row.pending_amount or Decimal("0"),
        }
        for row in rows
    }

    cumulative_amount = Decimal("0")
    trend: list[UserExpenseTrendPoint] = []

    for day in _get_month_days(start_of_month, start_of_next_month):
        approved_amount = amounts_by_day.get(day, {}).get(
            "approved_amount", Decimal("0")
        )
        pending_amount = amounts_by_day.get(day, {}).get(
            "pending_amount", Decimal("0")
        )
        cumulative_amount += approved_amount + pending_amount

        trend.append(
            UserExpenseTrendPoint(
                day=day,
                approved_amount=approved_amount,
                pending_amount=pending_amount,
                cumulative_amount=cumulative_amount,
            )
        )

    return trend


def get_team_weekly_expenses(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> list[WeeklyExpense]:
    """Fetch weekly approved expense totals for the given approver within the provided date range."""
    stmt = (
        select(
            func.date_trunc("week", Expense.bill_date).label("week_start"),
            func.sum(UserExpense.amount).label("total_amount"),
        )
        .select_from(UserExpenseApproval)
        .join(
            UserExpense,
            UserExpense.id == UserExpenseApproval.user_expense_id,
        )
        .join(
            Expense,
            Expense.id == UserExpense.expense_id,
        )
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.status == ApprovalStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by("week_start")
        .order_by("week_start")
    )
    return db_session.exec(stmt).all()


def get_team_daily_approval_trend(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
) -> list[TeamApprovalTrendPoint]:
    """Fetch daily approval activity and open pending queue snapshots for the current approver."""
    daily_activity_stmt = (
        select(
            func.date(UserExpenseApproval.updated_at).label("day"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.APPROVED,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("approved_amount"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpenseApproval.status == ApprovalStatus.REJECTED,
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("rejected_amount"),
        )
        .select_from(UserExpenseApproval)
        .join(UserExpense, UserExpense.id == UserExpenseApproval.user_expense_id)
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.status.in_(
                [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]
            ),
            UserExpenseApproval.updated_at >= start_of_month,
            UserExpenseApproval.updated_at < start_of_next_month,
        )
        .group_by("day")
        .order_by("day")
    )
    activity_rows = db_session.exec(daily_activity_stmt).all()
    activity_by_day = {
        row.day: {
            "approved_amount": row.approved_amount or Decimal("0"),
            "rejected_amount": row.rejected_amount or Decimal("0"),
        }
        for row in activity_rows
    }

    overlapping_pending_stmt = (
        select(
            UserExpenseApproval.created_at,
            UserExpenseApproval.updated_at,
            UserExpenseApproval.status,
        )
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.created_at < start_of_next_month,
            (
                (UserExpenseApproval.status == ApprovalStatus.PENDING)
                | (UserExpenseApproval.updated_at >= start_of_month)
            ),
        )
    )
    pending_rows = db_session.exec(overlapping_pending_stmt).all()

    month_start = _to_utc_datetime(start_of_month)
    month_end = _to_utc_datetime(start_of_next_month)
    daily_queue_deltas: dict[date, int] = defaultdict(int)
    open_pending_count = 0

    for row in pending_rows:
        created_at = _to_utc_datetime(row.created_at)
        updated_at = _to_utc_datetime(row.updated_at)

        if created_at < month_start:
            open_pending_count += 1
        else:
            daily_queue_deltas[created_at.date()] += 1

        if row.status != ApprovalStatus.PENDING and updated_at < month_end:
            daily_queue_deltas[updated_at.date()] -= 1

    trend: list[TeamApprovalTrendPoint] = []
    running_open_pending_count = open_pending_count

    for day in _get_month_days(start_of_month, start_of_next_month):
        running_open_pending_count += daily_queue_deltas.get(day, 0)
        trend.append(
            TeamApprovalTrendPoint(
                day=day,
                approved_amount=activity_by_day.get(day, {}).get(
                    "approved_amount", Decimal("0")
                ),
                rejected_amount=activity_by_day.get(day, {}).get(
                    "rejected_amount", Decimal("0")
                ),
                open_pending_count=running_open_pending_count,
            )
        )

    return trend


def get_user_category_breakdown(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> list[CategoryBreakdown]:
    """Fetch category-wise approved expense counts for the given user within the provided date range."""
    stmt = (
        select(
            Expense.category,
            func.count(UserExpense.id).label("count"),
        )
        .select_from(UserExpense)
        .join(
            Expense,
            Expense.id == UserExpense.expense_id,
        )
        .where(
            UserExpense.user_id == current_user_id,
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by(Expense.category)
    )

    return db_session.exec(stmt).all()


def get_team_category_breakdown(
    current_user_id: int, db_session: Session, start_of_month, start_of_next_month
) -> list[CategoryBreakdown]:
    """Fetch category-wise approved expense counts for the given approver within the provided date range."""
    stmt = (
        select(
            Expense.category,
            func.count(UserExpenseApproval.id).label("count"),
        )
        .select_from(UserExpenseApproval)
        .join(
            UserExpense,
            UserExpense.id == UserExpenseApproval.user_expense_id,
        )
        .join(
            Expense,
            Expense.id == UserExpense.expense_id,
        )
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.status == ApprovalStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by(Expense.category)
    )

    return db_session.exec(stmt).all()


def get_team_pending_employee_breakdown(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
    limit: int = 5,
) -> list[PendingEmployeeBreakdown]:
    """Fetch pending approvals grouped by employee for the current approver."""
    user_name = func.concat(User.first_name, " ", User.last_name)
    stmt = (
        select(
            User.id.label("user_id"),
            user_name.label("user_name"),
            func.count(UserExpenseApproval.id).label("pending_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label("pending_amount"),
        )
        .select_from(UserExpenseApproval)
        .join(UserExpense, UserExpense.id == UserExpenseApproval.user_expense_id)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .join(User, User.id == UserExpense.user_id)
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.status == ApprovalStatus.PENDING,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by(User.id, User.first_name, User.last_name)
        .order_by(desc("pending_amount"), desc("pending_count"), User.id)
        .limit(limit)
    )
    return db_session.exec(stmt).all()


def get_team_top_spenders(
    current_user_id: int,
    db_session: Session,
    start_of_month,
    start_of_next_month,
    limit: int = 5,
) -> list[TopSpender]:
    """Fetch top spenders for the current approver based on approved expenses."""
    user_name = func.concat(User.first_name, " ", User.last_name)
    stmt = (
        select(
            User.id.label("user_id"),
            user_name.label("user_name"),
            func.count(UserExpense.id).label("expense_count"),
            func.coalesce(func.sum(UserExpense.amount), 0).label("total_amount"),
        )
        .select_from(UserExpenseApproval)
        .join(UserExpense, UserExpense.id == UserExpenseApproval.user_expense_id)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .join(User, User.id == UserExpense.user_id)
        .where(
            UserExpenseApproval.approver_id == current_user_id,
            UserExpenseApproval.status == ApprovalStatus.APPROVED,
            Expense.bill_date >= start_of_month,
            Expense.bill_date < start_of_next_month,
        )
        .group_by(User.id, User.first_name, User.last_name)
        .order_by(desc("total_amount"), User.id)
        .limit(limit)
    )
    return db_session.exec(stmt).all()
