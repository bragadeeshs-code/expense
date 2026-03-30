"""Dashboard Services."""

from decimal import Decimal

from sqlalchemy import String, cast
from sqlmodel import Session, and_, case, exists, func, or_, select

from app.config.logger import get_logger
from app.models.expense import Expense
from app.models.grade import Grade
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.project_member import ProjectMember
from app.models.user import User
from app.models.user_expense import UserExpense
from app.schemas.dashboard import (
    AdminDashboardSummary,
    CategorySummaryResponse,
    DashboardSummary,
    DateFilter,
    EmployeeDashboardResponse,
    FinancerDashboardResponse,
    ManagerDashboardResponse,
    TeamDashboardResponse,
)
from app.schemas.user import UserStatus
from app.schemas.user_expense import ExpenseStatus
from app.services.asset import get_asset_dashboard_summary
from app.services.connection import get_total_connections
from app.services.expense_tracking import (
    get_daily_spent_by_date_range,
    get_team_daily_spent_by_date_range,
)
from app.services.project import (
    get_project_count_for_manager,
    get_projects_overview_by_date_range,
    get_total_projects,
)
from app.services.user import get_invited_users_by_org, get_user_counts_by_org
from app.utils.datetime import get_date_range, get_month_start_end

logger = get_logger(__name__)


def user_dashboard_expense_summary(
    session: Session, current_user: User
) -> DashboardSummary:
    """Compute dashboard summary using efficient conditional SQL aggregation."""
    stmt = select(
        func.sum(
            case((UserExpense.status == ExpenseStatus.APPROVED, 1), else_=0)
        ).label("approved_count"),
        func.sum(case((UserExpense.status == ExpenseStatus.PENDING, 1), else_=0)).label(
            "pending_count"
        ),
        func.sum(
            case(
                (UserExpense.status == ExpenseStatus.APPROVED, UserExpense.amount),
                else_=0,
            )
        ).label("approved_sum"),
        func.sum(
            case(
                (UserExpense.status == ExpenseStatus.PENDING, UserExpense.amount),
                else_=0,
            )
        ).label("pending_sum"),
    ).where(UserExpense.user_id == current_user.id)

    row = session.exec(stmt).first()

    approved_count, pending_count, approved_sum, pending_sum = row

    return DashboardSummary(
        approved_count=approved_count or 0,
        approved_amount_sum=approved_sum or 0,
        pending_count=pending_count or 0,
        pending_amount_sum=pending_sum or 0,
    )


def user_category_spending_summary(
    session: Session, current_user: User, filter_key: DateFilter
) -> CategorySummaryResponse:
    """Get category-wise spending summary for the current user, optimized."""
    start_date, end_date = get_date_range(filter_key)

    category_col = func.coalesce(cast(Expense.category, String), "uncategorized")

    stmt = (
        select(
            category_col.label("category"),
            func.sum(UserExpense.amount).label("total"),
        )
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.user_id == current_user.id,
            UserExpense.status == ExpenseStatus.APPROVED,
        )
        .group_by(category_col)
    )

    if start_date and end_date:
        stmt = stmt.where(
            UserExpense.created_at >= start_date, UserExpense.created_at <= end_date
        )

    rows = session.exec(stmt).all()

    category_totals = {category: float(total or 0) for category, total in rows}

    total_spent = sum(category_totals.values())

    grade = session.get(Grade, current_user.grade_id)

    return CategorySummaryResponse(
        total_spent=total_spent,
        by_category=category_totals,
        daily_limit=grade.daily_limit if grade else None,
        monthly_limit=grade.monthly_limit if grade else None,
    )


def get_employee_dashboard(
    session: Session,
    organization_id: int,
) -> EmployeeDashboardResponse:
    """Get employee dashboard summary for the organization."""
    stmt = select(
        func.count(User.id).label("total_employees"),
        func.sum(
            case(
                (User.status == UserStatus.ACTIVE, 1),
                else_=0,
            )
        ).label("active_employees"),
        func.sum(
            case(
                (User.status == UserStatus.INVITED, 1),
                else_=0,
            )
        ).label("pending_setup_employees"),
    ).where(User.organization_id == organization_id)

    result = session.exec(stmt).one()

    return EmployeeDashboardResponse(
        total_employees=result.total_employees,
        active_employees=result.active_employees or 0,
        pending_setup_employees=result.pending_setup_employees or 0,
    )


def get_team_dashboard(
    session: Session,
    current_user: User,
) -> TeamDashboardResponse:
    """Dashboard for manager OR approver across all involved projects."""
    project_ids_select = (
        select(Project.id)
        .where(
            Project.manager_id == current_user.id,
            Project.organization_id == current_user.organization_id,
        )
        .union(
            select(ProjectApprovalMatrix.project_id).where(
                ProjectApprovalMatrix.approver_id == current_user.id
            )
        )
    )

    total_team_members = (
        session.exec(
            select(func.count(func.distinct(ProjectMember.user_id))).where(
                ProjectMember.project_id.in_(project_ids_select)
            )
        ).one()
        or 0
    )

    expense_stats = session.exec(
        select(
            func.count(case((UserExpense.status == ExpenseStatus.APPROVED, 1))).label(
                "approved_expense_count"
            ),
            func.count(case((UserExpense.status == ExpenseStatus.PENDING, 1))).label(
                "pending_expense_count"
            ),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpense.status == ExpenseStatus.APPROVED,
                            UserExpense.amount,
                        ),
                        else_=Decimal("0.00"),
                    )
                ),
                Decimal("0.00"),
            ).label("approved_total_amount"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            UserExpense.status == ExpenseStatus.PENDING,
                            UserExpense.amount,
                        ),
                        else_=Decimal("0.00"),
                    )
                ),
                Decimal("0.00"),
            ).label("pending_total_amount"),
        ).where(UserExpense.project_id.in_(project_ids_select))
    ).one()

    return TeamDashboardResponse(
        total_team_members=total_team_members,
        approved_expense_count=expense_stats.approved_expense_count or 0,
        pending_expense_count=expense_stats.pending_expense_count or 0,
        approved_total_amount=expense_stats.approved_total_amount or Decimal("0.00"),
        pending_total_amount=expense_stats.pending_total_amount or Decimal("0.00"),
    )


def get_admin_dashboard(
    current_user_org_id: int,
    session: Session,
) -> AdminDashboardSummary:
    """Build and return the admin dashboard summary for an organization."""
    total_users = get_user_counts_by_org(session, current_user_org_id)

    invited_users = get_invited_users_by_org(session, current_user_org_id)

    total_assets, assets_by_category = get_asset_dashboard_summary(
        session, current_user_org_id
    )

    total_projects = get_total_projects(session, current_user_org_id)

    total_connections = get_total_connections(session, current_user_org_id)

    return AdminDashboardSummary(
        total_employees=total_users,
        pending_invitations=invited_users,
        company_assets=assets_by_category,
        total_assets=total_assets,
        total_projects=total_projects,
        total_connections=total_connections,
    )


def get_manager_dashboard(
    session: Session,
    current_user: User,
    month: str | None,
) -> ManagerDashboardResponse:
    """Get manager dashboard summary."""
    start_date, end_date = get_month_start_end(month)

    active_projects = get_project_count_for_manager(
        session=session,
        current_user=current_user,
    )

    project_scope = and_(
        Project.organization_id == current_user.organization_id,
        or_(
            Project.manager_id == current_user.id,
            exists(
                select(1).where(
                    ProjectApprovalMatrix.project_id == Project.id,
                    ProjectApprovalMatrix.approver_id == current_user.id,
                )
            ),
        ),
    )

    combined_stmt = (
        select(
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
            ).label("total_approved_amount"),
            func.count(
                case(
                    (UserExpense.status == ExpenseStatus.PENDING, 1),
                )
            ).label("total_pending"),
        )
        .select_from(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .join(Project, Project.id == UserExpense.project_id)
        .where(
            project_scope,
            UserExpense.status.in_([ExpenseStatus.APPROVED, ExpenseStatus.PENDING]),
            Expense.bill_date.between(start_date.date(), end_date.date()),
        )
    )

    total_approved_amount, total_pending = session.exec(combined_stmt).one()

    manager_daily_spent = get_daily_spent_by_date_range(
        session=session,
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
    )

    team_members_daily_spent = get_team_daily_spent_by_date_range(
        session=session,
        current_user_id=current_user.id,
        organization_id=current_user.organization_id,
        start_date=start_date,
        end_date=end_date,
    )

    projects_table = get_projects_overview_by_date_range(
        session=session,
        current_user_id=current_user.id,
        organization_id=current_user.organization_id,
        start_date=start_date,
        end_date=end_date,
    )

    return ManagerDashboardResponse(
        active_projects=active_projects,
        total_approved_expenses_amount=total_approved_amount,
        total_pending_expenses=total_pending,
        manager_daily_spent=manager_daily_spent,
        team_members_daily_spent=team_members_daily_spent,
        projects_table=projects_table,
    )


def get_financer_dashboard(
    db_session: Session,
    org_id: int,
) -> FinancerDashboardResponse:
    """Get financer dashboard summary."""
    agg_stmt = select(
        func.coalesce(func.count(), 0).label("total_expenses"),
        func.coalesce(
            func.count().filter(UserExpense.status == ExpenseStatus.PENDING),
            0,
        ).label("pending_expenses"),
        func.coalesce(
            func.count().filter(UserExpense.status == ExpenseStatus.APPROVED),
            0,
        ).label("approved_expenses"),
        func.coalesce(
            func.sum(UserExpense.amount).filter(
                UserExpense.status == ExpenseStatus.APPROVED
            ),
            0,
        ).label("approved_expenses_total_amount"),
    ).where(
        UserExpense.expense.has(Expense.organization_id == org_id),
        UserExpense.status.in_(
            [
                ExpenseStatus.PENDING,
                ExpenseStatus.APPROVED,
                ExpenseStatus.REJECTED,
            ]
        ),
    )

    agg = db_session.exec(agg_stmt).one()

    return FinancerDashboardResponse(
        total_expenses=agg.total_expenses,
        pending_expenses=agg.pending_expenses,
        approved_expenses=agg.approved_expenses,
        approved_expenses_total_amount=Decimal(agg.approved_expenses_total_amount),
    )
