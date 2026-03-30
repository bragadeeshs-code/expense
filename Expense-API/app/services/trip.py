"""Trip service functions."""

from fastapi import HTTPException, status
from sqlalchemy.orm import contains_eager
from sqlmodel import Session, and_, func, or_, select

from app.constants.trip import FILTER_MAP, TRIP_SORT_MAP
from app.models.advance import Advance
from app.models.project import Project
from app.models.trip import Trip
from app.models.user import User
from app.schemas.shared import SortDirection
from app.schemas.trip import (
    DeleteTripResponse,
    PaginatedTeamTripResponse,
    PaginatedTripResponse,
    TripFilters,
    TripOptions,
    TripResponse,
    TripsSortParams,
    TripStatus,
    TripStatusUpdatePayload,
    UpsertTripRequest,
)
from app.services.project import check_project_exists


def create_trip_service(
    db_session: Session,
    trip: UpsertTripRequest,
    organization_id: int,
    user_id: int,
) -> TripResponse:
    """Create a trip for an organization."""
    db_project = check_project_exists(
        project_id=trip.project_id, session=db_session, org_id=organization_id
    )

    trip = Trip(
        project_id=db_project.id,
        destination=trip.destination,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        hotel_accommodation_needed=trip.hotel_accommodation_needed,
        mode_of_travel=trip.mode_of_travel,
        vehicle_needed=trip.vehicle_needed,
        advance_needed=trip.advance_needed,
        advance_amount=trip.advance_amount,
        created_by=user_id,
    )

    db_session.add(trip)

    try:
        db_session.commit()
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trip : {str(e)}",
        )

    return trip


def update_trip_service(
    db_session: Session,
    trip_id: int,
    user_id: int,
    organization_id: int,
    trip: UpsertTripRequest,
) -> TripResponse:
    """Update a trip for an organization."""
    db_trip = db_session.get(Trip, trip_id)

    if not db_trip or db_trip.created_by != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found."
        )

    if db_trip.status != TripStatus.SUBMITTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This trip has already been reviewed by your manager and cannot be modified.",
        )

    if trip.project_id != db_trip.project_id:
        check_project_exists(
            project_id=trip.project_id,
            session=db_session,
            org_id=organization_id,
        )

    db_trip.sqlmodel_update(trip.model_dump())

    try:
        db_session.commit()
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trip : {str(e)}",
        )

    return db_trip


def get_trips_service(
    db_session: Session,
    user_id: int,
    page: int,
    per_page: int,
    sorting: TripsSortParams,
    filters: TripFilters,
) -> PaginatedTripResponse:
    """Get a paginated list of trips with optional filters and sorting."""
    query = (
        select(Trip)
        .join(Project)
        .options(contains_eager(Trip.project).load_only(Project.id, Project.code))
        .where(Trip.created_by == user_id)
    )

    filters_list = []

    if filters.search and (search := filters.search.strip()):
        pattern = f"%{search}%"
        filters_list.append(
            or_(
                Trip.destination.ilike(pattern),
                Project.code.ilike(pattern),
            )
        )

    for field, builder in FILTER_MAP.items():
        value = getattr(filters, field)
        if value is not None:
            filters_list.append(builder(value))

    if filters_list:
        query = query.where(and_(*filters_list))

    total = db_session.exec(select(func.count()).select_from(query.subquery())).one()

    order_clauses = []

    for column, direction in sorting.pairs():
        sort_column = TRIP_SORT_MAP[column]
        order_clauses.append(
            sort_column.asc() if direction == SortDirection.ASC else sort_column.desc()
        )

    query = query.order_by(*order_clauses)

    results = db_session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedTripResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total,
        data=results,
    )


def get_team_trips(
    db_session: Session,
    user_id: int,
    page: int,
    per_page: int,
    sorting: TripsSortParams,
    filters: TripFilters,
) -> PaginatedTeamTripResponse:
    """Get a paginated list of trips for an organization with optional filters and sorting."""
    query = (
        select(Trip)
        .join(Project, Project.id == Trip.project_id)
        .join(User, Trip.created_by == User.id)
        .options(contains_eager(Trip.user), contains_eager(Trip.project))
        .where(
            User.reporting_manager_id == user_id,
        )
    )

    filters_list = []

    if filters.search and (search := filters.search.strip()):
        pattern = f"%{search}%"
        filters_list.append(
            or_(
                Trip.destination.ilike(pattern),
                Project.name.ilike(pattern),
                User.first_name.ilike(pattern),
                User.last_name.ilike(pattern),
            )
        )

    for field, builder in FILTER_MAP.items():
        value = getattr(filters, field)
        if value is not None:
            filters_list.append(builder(value))

    if filters_list:
        query = query.where(and_(*filters_list))

    total = db_session.exec(select(func.count()).select_from(query.subquery())).one()

    order_clauses = []

    for column, direction in sorting.pairs():
        sort_column = TRIP_SORT_MAP[column]
        order_clauses.append(
            sort_column.asc() if direction == SortDirection.ASC else sort_column.desc()
        )

    query = query.order_by(*order_clauses)

    results = db_session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedTeamTripResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total,
        data=results,
    )


def update_trip_status_service(
    payload: TripStatusUpdatePayload,
    trip_id: int,
    user_id: int,
    session: Session,
    organization_id: int,
) -> TripResponse:
    """Approve or reject a submitted trip request."""
    db_trip = session.exec(
        select(Trip).where(
            Trip.user.has(User.reporting_manager_id == user_id),
            Trip.id == trip_id,
        )
    ).one_or_none()

    if not db_trip:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Travel request not found."
        )

    if db_trip.status != TripStatus.SUBMITTED:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail=f"Travel request already {db_trip.status.value}.",
        )

    db_trip.status = TripStatus(payload.status)

    if (
        db_trip.status == TripStatus.APPROVED
        and db_trip.advance_needed
        and db_trip.advance_amount
    ):
        advance = Advance(
            trip_id=db_trip.id,
            organization_id=organization_id,
        )
        session.add(advance)
    try:
        session.commit()
        return db_trip
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to apply status: {e}"
        )


def get_options(
    search: str | None, limit: int, user_id: int, session: Session
) -> TripOptions:
    """Fetch trip options filtered by search."""
    base_conditions = [
        Trip.created_by == user_id,
        Trip.status == TripStatus.APPROVED,
    ]
    if search and (search := search.strip()):
        base_conditions.append(func.lower(Trip.destination).like(f"%{search.lower()}%"))

    db_trips_stmt = (
        select(Trip.id, Trip.destination)
        .where(*base_conditions)
        .order_by(Trip.destination)
        .limit(limit)
    )
    return session.exec(db_trips_stmt).all()


def get_project_id_by_trip_id(
    session: Session,
    trip_id: int,
    user_id: int,
) -> int:
    """Return project_id for a trip within the organization."""
    stmt = select(Trip.project_id).where(
        Trip.id == trip_id,
        Trip.created_by == user_id,
    )

    project_id = session.exec(stmt).one_or_none()

    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid trip ID.",
        )

    return project_id


def delete_trip_service(
    db_session: Session,
    trip_id: int,
    user_id: int,
) -> DeleteTripResponse:
    """Delete a trip for a user."""
    db_trip = db_session.get(Trip, trip_id)

    if not db_trip or db_trip.created_by != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    if db_trip.status != TripStatus.SUBMITTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only submitted trips can be deleted.",
        )

    try:
        db_session.delete(db_trip)
        db_session.commit()
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trip: {str(e)}",
        )

    return DeleteTripResponse(id=trip_id)
