"""Router for travel expense."""

from datetime import date
from typing import List

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import (
    require_manager_permission,
    require_user_permission,
)
from app.models.user import User
from app.schemas.travel_expense import (
    AddTravelExpenseNotesResponse,
    AddTravelExpenseRequest,
    AddTravelExpenseResponse,
    DashboardMetricsResponse,
    MileageRateResponse,
    TeamDashboardMetricsResponse,
    TravelExpenseApproveResponse,
    TravelExpenseDetailResponse,
    TravelExpenseListResponse,
    TravelExpenseNotesListResponse,
    TravelExpenseNotesRequest,
    TravelExpenseRejectResponse,
    TravelExpenseStatus,
    UpdateTravelExpenseRejectRequest,
    UpdateTravelExpenseRequest,
    UpdateTravelExpenseResponse,
)
from app.services.travel_expense import (
    add_travel_expense,
    add_travel_expense_notes,
    edit_travel_expense,
    fetch_mileage_rate_by_user_id,
    fetch_team_travel_expense_dashboard_metrics,
    fetch_travel_expense_by_id,
    fetch_travel_expense_dashboard_metrics,
    fetch_travel_expense_notes_by_id,
    get_travel_expenses,
    travel_expense_approve,
    travel_expense_reject,
)

router = APIRouter(prefix="/travel-expenses", tags=["Travel Expenses"])


@router.post("", response_model=AddTravelExpenseResponse)
def create_travel_expense(
    data: AddTravelExpenseRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Create a travel expense."""
    return add_travel_expense(data, current_user.id, session)


@router.get("", response_model=TravelExpenseListResponse)
def list_travel_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: str | None = Query(None),
    status: list[TravelExpenseStatus] | None = Query(None),
    from_date: date | None = Query(None),
    project_ids: list[int] | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
) -> TravelExpenseListResponse:
    """Get a list of travel expenses for the current user."""
    return get_travel_expenses(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        search=search,
        status=status,
        from_date=from_date,
        project_ids=project_ids,
    )


@router.get("/dashboard-metrics", response_model=DashboardMetricsResponse)
def get_travel_expense_dashboard_metrics(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Get travel expense dashboard metrics for the current user's."""
    return fetch_travel_expense_dashboard_metrics(session, current_user)


@router.get("/team/dashboard-metrics", response_model=TeamDashboardMetricsResponse)
def get_team_travel_expense_dashboard_metrics(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_manager_permission),
):
    """Get travel expense dashboard metrics for the team members."""
    return fetch_team_travel_expense_dashboard_metrics(session, current_user)


@router.get("/team", response_model=TravelExpenseListResponse)
def list_team_travel_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: str | None = Query(None),
    status: list[TravelExpenseStatus] | None = Query(None),
    from_date: date | None = Query(None),
    project_ids: list[int] | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_manager_permission),
) -> TravelExpenseListResponse:
    """Get a list of travel expenses for the current user's team."""
    return get_travel_expenses(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        search=search,
        status=status,
        from_date=from_date,
        project_ids=project_ids,
        travel_expense_type="TEAM",
    )


@router.post("/notes", response_model=AddTravelExpenseNotesResponse)
async def create_travel_expense_notes(
    data: TravelExpenseNotesRequest = Depends(TravelExpenseNotesRequest.as_form),
    file: UploadFile | None = File(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Add notes to a travel expense."""
    return await add_travel_expense_notes(data, file, session, current_user)


@router.get("/notes/{expense_id}", response_model=List[TravelExpenseNotesListResponse])
def get_travel_expense_notes_by_id(
    expense_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_user_permission),
):
    """Get travel expense notes by expense id."""
    return fetch_travel_expense_notes_by_id(expense_id, session)


@router.patch("/{expense_id}", response_model=UpdateTravelExpenseResponse)
async def update_travel_expense(
    expense_id: int,
    data: UpdateTravelExpenseRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Update project of a travel expense."""
    return await edit_travel_expense(
        expense_id,
        data.project_id,
        current_user,
        session,
    )


@router.patch("/reject/{expense_id}", response_model=TravelExpenseRejectResponse)
def reject_travel_expense(
    expense_id: int,
    data: UpdateTravelExpenseRejectRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_manager_permission),
):
    """Reject a travel expense."""
    return travel_expense_reject(expense_id, data, session, current_user)


@router.patch("/approve/{expense_id}", response_model=TravelExpenseApproveResponse)
def approve_travel_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_manager_permission),
):
    """Approve a travel expense."""
    return travel_expense_approve(expense_id, session, current_user)


@router.get("/mileage-rate", response_model=MileageRateResponse)
def get_mileage_rate_by_user_id(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Get mileage rate by user id."""
    return fetch_mileage_rate_by_user_id(
        session=session,
        current_user=current_user,
    )


@router.get("/{expense_id}", response_model=TravelExpenseDetailResponse)
def get_travel_expense_by_id(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
):
    """Get travel expense by id."""
    return fetch_travel_expense_by_id(
        expense_id=expense_id,
        user_id=current_user.id,
        session=session,
    )
