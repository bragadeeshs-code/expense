"""Dashboard Router."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.constants.types import MonthParam
from app.dependencies.permission import (
    require_admin_permission,
    require_financer_permission,
    require_manager_permission,
    require_user_permission,
)
from app.models.user import User
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
from app.services.dashboard import (
    get_admin_dashboard,
    get_employee_dashboard,
    get_financer_dashboard,
    get_manager_dashboard,
    get_team_dashboard,
    user_category_spending_summary,
    user_dashboard_expense_summary,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardSummary)
def dashboard_expense_summary(
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> DashboardSummary:
    """Get dashboard expense summary for the current user."""
    return user_dashboard_expense_summary(db_session, current_user)


@router.get("/category", response_model=CategorySummaryResponse)
def category_spending_summary(
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
    filter: DateFilter = DateFilter.ALL,
) -> CategorySummaryResponse:
    """Get category-wise spending summary for the current user."""
    return user_category_spending_summary(db_session, current_user, filter)


@router.get(
    "/employee",
    response_model=EmployeeDashboardResponse,
)
def employee_dashboard(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> EmployeeDashboardResponse:
    """Get employee dashboard summary for the organization."""
    return get_employee_dashboard(
        session=session,
        organization_id=current_user.organization_id,
    )


@router.get(
    "/team-expenses",
    response_model=TeamDashboardResponse,
)
def team_dashboard(
    current_user: Annotated[User, Depends(require_manager_permission)],
    session: Annotated[Session, Depends(get_session)],
) -> TeamDashboardResponse:
    """Get team dashboard summary."""
    return get_team_dashboard(
        session=session,
        current_user=current_user,
    )


@router.get("/admin", response_model=AdminDashboardSummary)
def admin_dashboard(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> AdminDashboardSummary:
    """Get admin dashboard summary."""
    return get_admin_dashboard(
        current_user_org_id=current_user.organization_id,
        session=session,
    )


@router.get("/manager", response_model=ManagerDashboardResponse)
def manager_dashboard(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_manager_permission)],
    month: MonthParam | None = None,
) -> ManagerDashboardResponse:
    """Get manager dashboard summary."""
    return get_manager_dashboard(
        session=session,
        current_user=current_user,
        month=month,
    )


@router.get("/financer", response_model=FinancerDashboardResponse)
def financer_dashboard(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_financer_permission)],
) -> FinancerDashboardResponse:
    """Get financer dashboard summary."""
    return get_financer_dashboard(
        db_session=session,
        org_id=current_user.organization_id,
    )
