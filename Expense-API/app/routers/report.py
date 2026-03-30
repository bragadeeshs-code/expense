"""Report API routes for user and team expense summaries."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.constants.types import MonthParam
from app.dependencies.permission import (
    require_manager_permission,
    require_user_permission,
)
from app.models.user import User
from app.schemas.report import MyReportsSummary, TeamReportsSummary
from app.services.report import get_my_reports_summary, get_team_reports_summary

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/me", response_model=MyReportsSummary)
def my_reports_summary(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
    month: MonthParam | None = None,
) -> MyReportsSummary:
    """Return the current user's monthly expense summary including totals, daily trend, and category breakdown."""
    return get_my_reports_summary(
        current_user_id=current_user.id,
        db_session=session,
        month=month,
    )


@router.get("/team", response_model=TeamReportsSummary)
def team_reports_summary(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_manager_permission)],
    month: MonthParam | None = None,
) -> TeamReportsSummary:
    """Return the current approver's team report summary including spend totals, approval activity trend, and category breakdown."""
    return get_team_reports_summary(
        current_user_id=current_user.id,
        db_session=session,
        month=month,
    )
