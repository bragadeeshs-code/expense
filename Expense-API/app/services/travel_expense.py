"""Service for Travel expenses."""

import os
import re
from datetime import date
from decimal import Decimal
from typing import List

from fastapi import HTTPException, UploadFile, status
from fastapi.concurrency import run_in_threadpool
from sqlmodel import Session, String, case, cast, func, or_, select

from app.config.database import get_thread_session
from app.config.logger import get_logger
from app.constants.expenses import ALLOWED_MIME_TYPES
from app.constants.travel_expense import (
    ALLOWED_EXTENSIONS,
    CARBON_EMISSION,
    TRAVEL_EXPENSE_MAX_FILE_SIZE,
)
from app.models.grade import Grade
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.project_member import ProjectMember
from app.models.travel_expense import TravelExpense
from app.models.travel_expense_notes import TravelExpenseNotes
from app.models.user import User
from app.schemas.notification import NotificationType
from app.schemas.travel_expense import (
    AddTravelExpenseNotesResponse,
    AddTravelExpenseRequest,
    AddTravelExpenseResponse,
    DashboardMetricsResponse,
    MileageRateResponse,
    TeamDashboardMetricsResponse,
    TravelExpenseApproveResponse,
    TravelExpenseDetailResponse,
    TravelExpenseList,
    TravelExpenseListResponse,
    TravelExpenseNotesListResponse,
    TravelExpenseNotesRequest,
    TravelExpenseRejectResponse,
    TravelExpenseStatus,
    UpdateTravelExpenseRejectRequest,
    UpdateTravelExpenseResponse,
    Vehicles,
)
from app.services.minio import (
    get_file_notes_presigned_download_url,
    upload_mileage_calculator_notes_files,
)
from app.services.notification import create_notification
from app.utils.file import guess_file_metadata, normalize_filename

logger = get_logger(__name__)


def add_travel_expense(
    data: AddTravelExpenseRequest, user_id: int, session: Session
) -> AddTravelExpenseResponse:
    """Add a new travel expense."""
    try:
        # Check if user is member of that project
        query = select(ProjectMember).where(
            ProjectMember.user_id == user_id,
            ProjectMember.project_id == data.project_id,
        )

        project_member = session.exec(query).first()

        if not project_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are not a member of this project.",
            )

        query = (
            select(Grade.car_mileage_rate, Grade.bike_mileage_rate)
            .join(User, User.grade_id == Grade.id)
            .where(User.id == user_id)
        )
        result = session.exec(query).first()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mileage rate not found for user.",
            )

        car_rate, bike_rate = result
        rate_map = {Vehicles.CAR: car_rate, Vehicles.BIKE: bike_rate}
        travel_expense_amount = data.distance * rate_map.get(data.vehicle, 0)
        emission_factor = data.distance * CARBON_EMISSION.get(
            data.vehicle, Decimal("0.00")
        )

        travel_expense = TravelExpense(
            from_date=data.from_date,
            to_date=data.to_date,
            from_location=data.from_location.model_dump(),
            to_location=data.to_location.model_dump(),
            vehicle=data.vehicle,
            vehicle_type=data.vehicle_type,
            distance=data.distance,
            customer_name=data.customer_name,
            amount=travel_expense_amount,
            project_id=data.project_id,
            created_by_id=user_id,
            duration_seconds=data.duration_seconds,
            carbon_emission=emission_factor,
        )
        session.add(travel_expense)
        session.commit()
        return AddTravelExpenseResponse

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add travel expense: {str(e)}",
        )


def _fetch_travel_expenses(
    session: Session,
    user_id: int,
    page: int,
    per_page: int,
    search: str | None,
    status: list[TravelExpenseStatus] | None,
    travel_expense_type: str | None,
    from_date: date | None,
    project_ids: list[int] | None,
) -> tuple[int, list]:
    """Fetch travel expenses with pagination and optional search."""
    query = select(TravelExpense)

    if travel_expense_type == "TEAM":
        query = query.join(
            ProjectApprovalMatrix,
            TravelExpense.project_id == ProjectApprovalMatrix.project_id,
        ).where(
            ProjectApprovalMatrix.approver_id == user_id,
            TravelExpense.created_by_id != user_id,
        )
    else:
        query = query.where(TravelExpense.created_by_id == user_id)

    if status:
        query = query.where(TravelExpense.status.in_(status))

    if from_date:
        query = query.where(TravelExpense.from_date >= from_date)

    if project_ids:
        query = query.where(TravelExpense.project_id.in_(project_ids))

    # Global Search
    if search:
        filters = []
        # ---- ID search logic ----
        if search.isdigit():
            filters.append(TravelExpense.id == int(search))

        # Case 2: TE format (e.g., "TE1")
        match = re.fullmatch(r"TE(\d+)", search, re.IGNORECASE)
        if match:
            filters.append(TravelExpense.id == int(match.group(1)))

        # ---- Normal text search ----
        safe_search = re.escape(search)
        pattern = rf"\m{safe_search}"

        filters.append(
            or_(
                TravelExpense.customer_name.op("~*")(pattern),
                cast(TravelExpense.vehicle, String).op("~*")(pattern),
                cast(TravelExpense.vehicle_type, String).op("~*")(pattern),
                cast(TravelExpense.status, String).op("~*")(pattern),
            )
        )

        query = query.where(or_(*filters))

    # Order by latest first
    query = query.order_by(TravelExpense.updated_at.desc())

    # Total count
    total = (
        session.exec(select(func.count()).select_from(query.subquery())).first() or 0
    )

    # Pagination
    rows = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return total, rows


def get_travel_expenses(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
    search: str | None = None,
    status: list[TravelExpenseStatus] | None = None,
    travel_expense_type: str | None = None,
    from_date: date | None = None,
    project_ids: list[int] | None = None,
) -> TravelExpenseListResponse:
    """Retrieve travel expenses with filters and pagination."""
    try:
        total, rows = _fetch_travel_expenses(
            session=session,
            user_id=current_user.id,
            page=page,
            per_page=per_page,
            search=search,
            status=status,
            travel_expense_type=travel_expense_type,
            from_date=from_date,
            project_ids=project_ids,
        )

        data = [TravelExpenseList.model_validate(obj) for obj in rows]

        return TravelExpenseListResponse(
            total=total,
            page=page,
            per_page=per_page,
            has_next_page=page * per_page < total,
            data=data,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve travel expenses: {str(e)}",
        )


async def edit_travel_expense(
    expense_id: int,
    project_id: int,
    current_user: User,
    session: Session,
) -> UpdateTravelExpenseResponse:
    """Update only project_id of travel expense."""
    try:
        travel_expense = session.get(TravelExpense, expense_id)

        # Not found
        if not travel_expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Travel expense not found.",
            )

        # Permission check (important)
        if travel_expense.created_by_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to update this travel expense.",
            )

        # Check if user is member of that project
        query = select(ProjectMember).where(
            ProjectMember.user_id == current_user.id,
            ProjectMember.project_id == project_id,
        )

        project_member = session.exec(query).first()

        if not project_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are not a member of this project.",
            )

        if travel_expense.status != TravelExpenseStatus.DRAFTED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This expense cannot be updated as it is currently in {travel_expense.status.value} status.",
            )

        query = select(ProjectApprovalMatrix.approver_id).where(
            ProjectApprovalMatrix.project_id == project_id,
            ProjectApprovalMatrix.approval_level == 1,
        )

        approver_id = session.exec(query).first()
        notification_text = f"The {current_user.first_name} {current_user.last_name} user has been added a new travel expense of amount {travel_expense.amount:,.2f} for the customer of {travel_expense.customer_name}."

        # Update Travel Expense
        if travel_expense.status == TravelExpenseStatus.DRAFTED:
            travel_expense.status = TravelExpenseStatus.PENDING

        travel_expense.project_id = project_id

        session.add(travel_expense)
        session.commit()

        with get_thread_session() as add_travel_expense_thread_session:
            try:
                if approver_id != current_user.id:
                    await create_notification(
                        add_travel_expense_thread_session,
                        approver_id,
                        notification_text,
                        NotificationType.INFO,
                        meta_data={
                            "travel_expense_id": travel_expense.id,
                            "sender": current_user.email,
                        },
                    )
                    add_travel_expense_thread_session.commit()
            except Exception as e:
                add_travel_expense_thread_session.rollback()
                logger.error(
                    f"Failed to create notification for new travel expense: {str(e)}"
                )

        return UpdateTravelExpenseResponse()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update travel expense: {str(e)}",
        )


def fetch_travel_expense_by_id(
    session: Session,
    expense_id: int,
    user_id: int,
) -> TravelExpenseDetailResponse:
    """Fetch travel expense by id with permission check."""
    travel_expense = session.get(TravelExpense, expense_id)

    if not travel_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel expense not found.",
        )

    # Permission check: user can access if they created it or if it's in their team
    if travel_expense.created_by_id != user_id:
        # Check if it's a team expense for the user's team
        query = select(ProjectApprovalMatrix).where(
            ProjectApprovalMatrix.project_id == travel_expense.project_id,
            ProjectApprovalMatrix.approver_id == user_id,
        )
        project_approval = session.exec(query).first()

        if not project_approval:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to access this travel expense.",
            )

    query = (
        select(TravelExpense, Project.name)
        .join(Project, Project.id == TravelExpense.project_id)
        .where(TravelExpense.id == expense_id)
    )
    result = session.exec(query).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    travel_expense, project_name = result

    return TravelExpenseDetailResponse(
        **travel_expense.model_dump(),
        project_name=project_name,
    )


def fetch_mileage_rate_by_user_id(
    session: Session, current_user: User
) -> MileageRateResponse:
    """Fetch mileage rate by user id."""
    query = (
        select(Grade.car_mileage_rate, Grade.bike_mileage_rate)
        .join(User, Grade.id == current_user.grade_id)
        .where(User.id == current_user.id)
    )

    result = session.exec(query).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mileage rate not found for user",
        )
    car_rate, bike_rate = result

    return MileageRateResponse(car_mileage_rate=car_rate, bike_mileage_rate=bike_rate)


async def add_travel_expense_notes(
    data: TravelExpenseNotesRequest,
    file: UploadFile,
    session: Session,
    current_user: User,
) -> AddTravelExpenseNotesResponse:
    """Add notes to a travel expense."""
    try:
        travel_expense = session.get(TravelExpense, data.expense_id)

        # Payload validation
        if not data.notes and not file:
            raise HTTPException(
                status_code=400, detail="Either notes or file must be provided."
            )

        # File validations
        if file:
            file_data = await file.read()

            # Check file
            if not file_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File is empty: {file.filename}",
                )

            # Check MIME type
            if file.content_type not in ALLOWED_MIME_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail=f"Unsupported file type: {file.content_type}",
                )

            # Check extension
            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail=f"Unsupported file extension: {ext}",
                )

            # Check file size
            if len(file_data) > TRAVEL_EXPENSE_MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                    detail=f"FIle size must not exceed 3MB: {file.filename}",
                )

        if not travel_expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Travel expense not found.",
            )

        # Permission check: user can add notes if they created it or if it's in their team
        if travel_expense.created_by_id != current_user.id:
            # Check if it's a team expense for the user's team
            query = select(ProjectApprovalMatrix).where(
                ProjectApprovalMatrix.project_id == travel_expense.project_id,
                ProjectApprovalMatrix.approver_id == current_user.id,
            )
            project_approval = session.exec(query).first()

            if not project_approval:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not allowed to add notes to this travel expense.",
                )

        query = select(ProjectApprovalMatrix.approver_id).where(
            ProjectApprovalMatrix.project_id == travel_expense.project_id,
            ProjectApprovalMatrix.approval_level == 1,
        )

        approver_id = session.exec(query).first()
        notification_text = f"The notes has been added to travel expense id TE{travel_expense.id} by {current_user.first_name} {current_user.last_name}."
        sender_id = (
            approver_id
            if current_user.id == travel_expense.created_by_id
            else travel_expense.created_by_id
        )

        await run_in_threadpool(
            notes_save_to_db_minio,
            data,
            current_user.id,
            file.filename if file else None,
            file_data if file else None,
            session,
        )
        session.commit()
        with get_thread_session() as add_travel_expense_notes_thread_session:
            try:
                await create_notification(
                    add_travel_expense_notes_thread_session,
                    sender_id,
                    notification_text,
                    NotificationType.INFO,
                    meta_data={
                        "travel_expense_id": travel_expense.id,
                        "sender": current_user.email,
                    },
                )
                add_travel_expense_notes_thread_session.commit()
            except Exception as e:
                add_travel_expense_notes_thread_session.rollback()
                logger.error(
                    f"Failed to create notification for new travel expense: {str(e)}"
                )

        return AddTravelExpenseNotesResponse()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add notes to travel expense: {str(e)}",
        )


def get_unique_filename(
    current_file_name: str,
    expense_id: int,
    user_id: int,
    session: Session,
) -> str:
    """Generate a unique filename within the organization's expenses."""
    base, ext = os.path.splitext(normalize_filename(current_file_name))
    existing_file_names = session.exec(
        select(TravelExpenseNotes.file_name).where(
            TravelExpenseNotes.file_name.ilike(f"{base}%{ext}"),
            TravelExpenseNotes.expense_id == expense_id,
            TravelExpenseNotes.created_by_id == user_id,
        )
    ).all()
    file_name = f"{base}{ext}"
    index = 1
    while file_name in existing_file_names:
        file_name = f"{base} ({index}){ext}"
        index += 1
    return file_name


def notes_save_to_db_minio(
    data: TravelExpenseNotesRequest,
    user_id: int,
    current_file_name: str | None,
    uploaded_file: bytes | None,
    session: Session,
):
    """Save file metadata to the database and uploads the file to MinIO."""
    unique_file_name = None
    mime_type = None

    if uploaded_file:
        unique_file_name = get_unique_filename(
            current_file_name, data.expense_id, user_id, session
        )
        _, mime_type = guess_file_metadata(uploaded_file, current_file_name)

    try:
        travel_expense_notes = TravelExpenseNotes(
            notes=data.notes,
            file_name=unique_file_name,
            expense_id=data.expense_id,
            created_by_id=user_id,
        )
        session.add(travel_expense_notes)
        session.flush()

        if uploaded_file:
            upload_mileage_calculator_notes_files(
                data.expense_id,
                travel_expense_notes.file_name,
                uploaded_file,
                mime_type,
                travel_expense_notes.id,
            )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add notes to travel expense: {str(e)}",
        )


def fetch_travel_expense_notes_by_id(
    expense_id: int, session: Session
) -> List[TravelExpenseNotesListResponse]:
    """Fetch travel expense notes by expense id."""
    try:
        travel_expense = session.get(TravelExpense, expense_id)

        if not travel_expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Travel expense not found.",
            )

        query = (
            select(TravelExpenseNotes, User.first_name, User.last_name)
            .join(User, TravelExpenseNotes.created_by_id == User.id)
            .where(TravelExpenseNotes.expense_id == expense_id)
        ).order_by(TravelExpenseNotes.created_at.asc())

        results = session.exec(query).all()

        return [
            TravelExpenseNotesListResponse(
                notes=data.notes,
                file_name=data.file_name,
                file_url=(
                    get_file_notes_presigned_download_url(
                        data.expense_id, data.id, data.file_name
                    )
                    if data.file_name
                    else None
                ),
                created_by=first_name + " " + last_name,
                created_at=data.created_at,
                expense_id=data.expense_id,
                created_by_id=data.created_by_id,
            )
            for data, first_name, last_name in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch travel expense notes: {str(e)}",
        )


def travel_expense_reject(
    expense_id: int,
    data: UpdateTravelExpenseRejectRequest,
    session: Session,
    current_user: User,
) -> TravelExpenseRejectResponse:
    """Reject a travel expense."""
    try:
        travel_expense = session.get(TravelExpense, expense_id)

        if not travel_expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Travel expense not found.",
            )

        if travel_expense.status != TravelExpenseStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This expense cannot be rejected as it is currently in {travel_expense.status.value} status.",
            )

        # Permission check: user can add notes if they created it or if it's in their team
        if travel_expense.created_by_id != current_user.id:
            # Check if it's a team expense for the user's team
            query = select(ProjectApprovalMatrix).where(
                ProjectApprovalMatrix.project_id == travel_expense.project_id,
                ProjectApprovalMatrix.approver_id == current_user.id,
            )
            project_approval = session.exec(query).first()

            if not project_approval:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not allowed to reject this travel expense.",
                )

        travel_expense.status = TravelExpenseStatus.REJECTED
        travel_expense.reject_reason = data.reject_reason

        session.add(travel_expense)
        session.commit()

        return TravelExpenseRejectResponse()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject travel expense: {str(e)}",
        )


def travel_expense_approve(
    expense_id: int, session: Session, current_user: User
) -> TravelExpenseApproveResponse:
    """Approve a travel expense."""
    try:
        travel_expense = session.get(TravelExpense, expense_id)

        if not travel_expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Travel expense not found.",
            )

        if travel_expense.status != TravelExpenseStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This expense cannot be approved as it is currently in {travel_expense.status.value} status.",
            )

        # Permission check: user can approve if they are the approver for the project
        query = select(ProjectApprovalMatrix).where(
            ProjectApprovalMatrix.project_id == travel_expense.project_id,
            ProjectApprovalMatrix.approver_id == current_user.id,
        )
        project_approval = session.exec(query).first()

        if not project_approval:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to approve this travel expense.",
            )

        travel_expense.status = TravelExpenseStatus.APPROVED

        session.add(travel_expense)
        session.commit()

        return TravelExpenseApproveResponse()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve travel expense: {str(e)}",
        )


def fetch_travel_expense_dashboard_metrics(
    session: Session, current_user: User
) -> DashboardMetricsResponse:
    """Fetch travel expense dashboard metrics for the current user."""
    try:
        statement = select(
            func.coalesce(func.sum(TravelExpense.amount), 0),
            func.coalesce(func.sum(TravelExpense.distance), 0),
            func.coalesce(func.sum(TravelExpense.carbon_emission), 0),
        ).where(TravelExpense.created_by_id == current_user.id)

        result = session.exec(statement).one()

        if not result:
            return DashboardMetricsResponse(
                total_claim_amount=0, total_distance=0, total_carbon_emission=0
            )

        amount, distance, carbon_emission = result

        return DashboardMetricsResponse(
            total_claim_amount=amount,
            total_distance=distance,
            total_carbon_emission=carbon_emission,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard metrics: {str(e)}",
        )


def fetch_team_travel_expense_dashboard_metrics(
    session: Session, current_user: User
) -> TeamDashboardMetricsResponse:
    """Fetch travel expense dashboard metrics for the current user's team."""
    try:
        # Subquery to get project IDs where the user is an approver
        subquery = (
            select(ProjectApprovalMatrix.project_id)
            .where(ProjectApprovalMatrix.approver_id == current_user.id)
            .subquery()
        )

        # Main query to calculate total claim amount and distance, pending count, total of approved amount for the team
        statement = select(
            func.coalesce(func.sum(TravelExpense.amount), 0),
            func.coalesce(func.sum(TravelExpense.distance), 0),
            func.count(case((TravelExpense.status == TravelExpenseStatus.PENDING, 1))),
            func.coalesce(
                func.sum(
                    case(
                        (
                            TravelExpense.status == TravelExpenseStatus.APPROVED,
                            TravelExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ),
            func.coalesce(func.sum(TravelExpense.carbon_emission), 0),
        ).where(
            TravelExpense.project_id.in_(subquery),
            TravelExpense.created_by_id
            != current_user.id,  # Exclude current user's expenses
        )

        result = session.exec(statement).one()

        if not result:
            return DashboardMetricsResponse(
                total_claim_amount=0.0,
                total_distance=0.0,
                pending_count=0,
                total_approved_amount=0.0,
                total_carbon_emission=0.0,
            )

        amount, distance, pending_status_count, approved_amount, carbon_emission = (
            result
        )

        return TeamDashboardMetricsResponse(
            total_claim_amount=amount,
            total_distance=distance,
            total_approved_amount=approved_amount,
            total_carbon_emission=carbon_emission,
            pending_count=pending_status_count,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch team dashboard metrics: {str(e)}",
        )
