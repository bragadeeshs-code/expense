"""Trip router endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import (
    require_manager_permission,
    require_user_permission,
)
from app.dependencies.trip import get_trip_filters, get_trip_sorting
from app.models.user import User
from app.schemas.trip import (
    DeleteTripResponse,
    PaginatedTeamTripResponse,
    PaginatedTripResponse,
    TripFilters,
    TripOptions,
    TripResponse,
    TripsSortParams,
    TripStatusUpdatePayload,
    UpsertTripRequest,
)
from app.services.trip import (
    create_trip_service,
    delete_trip_service,
    get_options,
    get_team_trips,
    get_trips_service,
    update_trip_service,
    update_trip_status_service,
)

router = APIRouter(prefix="/trips", tags=["trips"])


@router.post(
    "/",
    summary="Create Trip",
    response_model=TripResponse,
)
def create_trip(
    trip: UpsertTripRequest,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> TripResponse:
    """Create a trip."""
    return create_trip_service(
        db_session=db_session,
        trip=trip,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
    )


@router.put(
    "/{trip_id}",
    summary="Update Trip",
    response_model=TripResponse,
)
def update_trip_route(
    trip_id: int,
    trip: UpsertTripRequest,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> TripResponse:
    """Update a trip."""
    return update_trip_service(
        db_session=db_session,
        trip_id=trip_id,
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        trip=trip,
    )


@router.get("/", summary="List Trips", response_model=PaginatedTripResponse)
def list_trips(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    db_session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
    filters: TripFilters = Depends(get_trip_filters),
    sorting: TripsSortParams = Depends(get_trip_sorting),
) -> PaginatedTripResponse:
    """List trips with pagination and optional filters."""
    return get_trips_service(
        db_session=db_session,
        user_id=current_user.id,
        page=page,
        per_page=per_page,
        sorting=sorting,
        filters=filters,
    )


@router.get("/team", response_model=PaginatedTeamTripResponse)
def list_pending_approvals(
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_manager_permission)],
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    filters: TripFilters = Depends(get_trip_filters),
    sorting: TripsSortParams = Depends(get_trip_sorting),
) -> PaginatedTeamTripResponse:
    """List trips with pagination and optional filters."""
    return get_team_trips(
        db_session=db_session,
        user_id=current_user.id,
        page=page,
        per_page=per_page,
        sorting=sorting,
        filters=filters,
    )


@router.get("/options", response_model=TripOptions)
def list_options(
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
    limit: Annotated[int, Query(ge=1, le=20)] = 5,
    search: Annotated[str | None, Query()] = None,
) -> TripOptions:
    """List trip options."""
    return get_options(
        search=search,
        limit=limit,
        user_id=current_user.id,
        session=db_session,
    )


@router.patch("/{trip_id}/status", response_model=TripResponse)
def update_trip_status(
    trip_id: int,
    payload: TripStatusUpdatePayload,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_manager_permission)],
) -> TripResponse:
    """Apply a status (approved or rejected) to a trip request."""
    return update_trip_status_service(
        payload=payload,
        trip_id=trip_id,
        session=db_session,
        user_id=current_user.id,
        organization_id=current_user.organization_id,
    )


@router.delete(
    "/{trip_id}",
    summary="Delete Trip",
    response_model=DeleteTripResponse,
)
def delete_trip(
    trip_id: int,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> DeleteTripResponse:
    """Delete a trip."""
    return delete_trip_service(
        db_session=db_session,
        trip_id=trip_id,
        user_id=current_user.id,
    )
