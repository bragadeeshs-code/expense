"""Module for handling grade-related services."""

from datetime import datetime
from decimal import Decimal

from fastapi import HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from psycopg2.errors import UniqueViolation
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import load_only
from sqlmodel import Session, String, and_, exists, func, or_, select

from app.config.logger import get_logger
from app.constants.grade import REQUIRED_COLUMNS
from app.models.grade import Grade
from app.models.user import User
from app.schemas.grade import (
    AutoApprovalThresholdType,
    CreateGradeRequest,
    DeleteGradeResponse,
    FlightClassEnum,
    GradeOptionResponse,
    GradeResponse,
    GradeSortColumn,
    GradeUploadResponse,
    PaginatedGradesResponse,
    TrainClassEnum,
    UpdateGradeRequest,
)
from app.schemas.shared import SortDirection
from app.utils.enums import (
    is_valid_auto_approve_threshold_type,
    is_valid_flight_class,
    is_valid_train_class,
)
from app.utils.file import (
    generate_sample_excel,
    is_empty_cell,
    read_upload_file,
    required_cell,
)
from app.utils.types import is_number

logger = get_logger(__name__)


def grade_exists(session: Session, grade_id: int, organization_id: int) -> bool:
    """Check whether a grade exists."""
    stmt = select(
        exists().where(
            Grade.id == grade_id,
            Grade.organization_id == organization_id,
        )
    )
    return session.exec(stmt).one()


def get_grade(
    grade_id: int,
    organization_id: int,
    db_session: Session,
) -> Grade | None:
    """Retrieve a Grade for the specified ID."""
    return db_session.exec(
        select(Grade).where(
            Grade.id == grade_id,
            Grade.organization_id == organization_id,
        )
    ).one_or_none()


def create_grade(
    db_session: Session, data: CreateGradeRequest, organization_id: int
) -> GradeResponse:
    """Create a new Grade record for the specified organization."""
    try:
        grade = Grade(
            **data.model_dump(),
            organization_id=organization_id,
        )
        db_session.add(grade)
        db_session.commit()
        return grade
    except IntegrityError as e:
        db_session.rollback()
        msg = f"Failed to create grade: {str(e)}"
        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name
            if constraint == "uq_grades_name_org":
                msg = "Grade with this name already exists."
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg,
        )
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create grade: {e}",
        )


def update_grade(
    data: UpdateGradeRequest,
    grade_id: int,
    db_session: Session,
    organization_id: int,
) -> GradeResponse:
    """Create a new Grade record for the specified organization."""
    try:
        db_grade = get_grade(grade_id, organization_id, db_session)
        if not db_grade:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grade not found.",
            )

        existing = db_session.exec(
            select(Grade).where(
                Grade.name == data.name,
                Grade.organization_id == organization_id,
                Grade.id != grade_id,
            )
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Grade with name '{data.name}' already exists.",
            )

        db_grade.sqlmodel_update(data.model_dump(exclude_unset=True))

        db_session.commit()
        return db_grade
    except HTTPException:
        raise
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update grade: {str(e)}",
        )


def get_grades(
    session: Session,
    organization_id: int,
    page: int,
    per_page: int,
    sort_by: GradeSortColumn,
    sort_dir: SortDirection,
    ids: list[int] | None = None,
    search: str | None = None,
    name: str | None = None,
    daily_limit: Decimal | None = None,
    monthly_limit: Decimal | None = None,
    auto_approval_threshold: Decimal | None = None,
    created_at: datetime | None = None,
    updated_at: datetime | None = None,
) -> PaginatedGradesResponse:
    """Get all grades for the organization with pagination, search, filter and sorting."""
    try:
        query = select(Grade).where(Grade.organization_id == organization_id)

        filters = []

        if ids:
            filters.append(Grade.id.in_(ids))

        if name:
            filters.append(Grade.name.ilike(f"%{name.strip()}%"))

        if daily_limit is not None:
            filters.append(Grade.daily_limit == daily_limit)

        if monthly_limit is not None:
            filters.append(Grade.monthly_limit == monthly_limit)

        if auto_approval_threshold is not None:
            filters.append(Grade.auto_approval_threshold == auto_approval_threshold)

        if created_at:
            filters.append(func.date(Grade.created_at) == created_at.date())

        if updated_at:
            filters.append(func.date(Grade.updated_at) == updated_at.date())

        if search:
            pattern = f"%{search.lower()}%"
            filters.append(
                or_(
                    func.lower(Grade.name).like(pattern),
                    func.cast(Grade.daily_limit, String).like(pattern),
                    func.cast(Grade.monthly_limit, String).like(pattern),
                    func.cast(Grade.auto_approval_threshold, String).like(pattern),
                )
            )

        if filters:
            query = query.where(and_(*filters))

        sort_column = getattr(Grade, sort_by.value, Grade.created_at)
        query = query.order_by(
            sort_column.asc() if sort_dir == SortDirection.ASC else sort_column.desc()
        )

        total = (
            session.exec(select(func.count()).select_from(query.subquery())).first()
            or 0
        )

        results = (
            session.exec(query.offset((page - 1) * per_page).limit(per_page))
            .unique()
            .all()
        )

        data = [GradeResponse.model_validate(grade) for grade in results]

        return PaginatedGradesResponse(
            total=total,
            page=page,
            per_page=per_page,
            has_next_page=(page * per_page) < total,
            data=data,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {e}",
        )


def delete_grade(
    grade_id: int,
    organization_id: int,
    db_session: Session,
) -> DeleteGradeResponse:
    """Delete a Grade for the specified ID."""
    db_grade = get_grade(grade_id, organization_id, db_session)
    if not db_grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found.",
        )
    has_users = db_session.scalar(
        select(
            exists().where(User.grade_id == grade_id),
        ),
    )
    if has_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete grade with assigned users.",
        )
    try:
        db_session.delete(db_grade)
        db_session.commit()
        return db_grade
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete grade: {str(e)}",
        )


async def upload_and_read_grade_file(
    file: UploadFile, session: Session, current_user: User
) -> GradeUploadResponse:
    """Service to read and save grades in bulk, ignoring conflicts."""
    df = read_upload_file(file, REQUIRED_COLUMNS)

    records = []

    for idx, row in df.iterrows():
        row_no = idx + 1

        daily_limit = required_cell(row, "daily limit", row_no)
        if not is_number(daily_limit):
            raise HTTPException(
                detail=f"Invalid daily limit for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        monthly_limit = required_cell(row, "monthly limit", row_no)
        if not is_number(monthly_limit):
            raise HTTPException(
                detail=f"Invalid monthly limit for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        if daily_limit == monthly_limit:
            raise HTTPException(
                detail="Daily limit and Monthly limit can't be same",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        if Decimal(daily_limit) > Decimal(monthly_limit):
            raise HTTPException(
                detail="Daily limit can't be greater than monthly limit",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        auto_approve_threshold_raw = required_cell(
            row, "auto approval threshold", row_no
        )
        is_valid_auto_approve_threshold_type(auto_approve_threshold_raw)
        auto_approve_threshold_value = (
            daily_limit
            if auto_approve_threshold_raw == AutoApprovalThresholdType.DAILY
            else monthly_limit
        )

        flight_class_raw = required_cell(row, "flight class", row_no)
        flight_class = is_valid_flight_class(flight_class_raw)

        train_class_raw = required_cell(row, "train class", row_no)
        train_class = is_valid_train_class(train_class_raw)

        domestic_accommodation_limit = required_cell(
            row, "domestic accommodation limit", row_no
        )
        if not is_number(domestic_accommodation_limit):
            raise HTTPException(
                detail=f"Invalid domestic accommodation limit for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        international_accommodation_limit = required_cell(
            row, "international accommodation limit", row_no
        )
        if not is_number(international_accommodation_limit):
            raise HTTPException(
                detail=f"Invalid international accommodation limit for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        food_daily_limit = required_cell(row, "food daily limit", row_no)
        if not is_number(food_daily_limit):
            raise HTTPException(
                detail=f"Invalid food daily limit for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        car_mileage_raw = row.get("car mileage rate")

        if is_empty_cell(car_mileage_raw):
            car_mileage_rate = Decimal("0")
        else:
            if not is_number(car_mileage_raw):
                raise HTTPException(
                    detail=f"Invalid car mileage rate for row {row_no}",
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                )
            car_mileage_rate = Decimal(str(car_mileage_raw).strip())

        bike_mileage_raw = row.get("bike mileage rate")

        if is_empty_cell(bike_mileage_raw):
            bike_mileage_rate = Decimal("0")
        else:
            if not is_number(bike_mileage_raw):
                raise HTTPException(
                    detail=f"Invalid bike mileage rate for row {row_no}",
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                )
            bike_mileage_rate = Decimal(str(bike_mileage_raw).strip())

        records.append(
            {
                "name": required_cell(row, "name", row_no),
                "daily_limit": daily_limit,
                "monthly_limit": monthly_limit,
                "auto_approval_threshold": auto_approve_threshold_value,
                "flight_class": flight_class,
                "train_class": train_class,
                "domestic_accommodation_limit": domestic_accommodation_limit,
                "international_accommodation_limit": international_accommodation_limit,
                "food_daily_limit": food_daily_limit,
                "organization_id": current_user.organization_id,
                "car_mileage_rate": car_mileage_rate,
                "bike_mileage_rate": bike_mileage_rate,
            }
        )

    if not records:
        return GradeUploadResponse(message="No grades to upload")

    stmt = (
        insert(Grade)
        .values(records)
        .on_conflict_do_nothing(index_elements=["name", "organization_id"])
    )
    try:
        result = session.exec(stmt)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            detail=f"Failed to upload grades: {e}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    created_grades_count = result.rowcount
    return GradeUploadResponse(
        message=f"Upload successful: {created_grades_count} grade{'s' if created_grades_count != 1 else ''} added."
    )


def get_grade_by_name(
    name: str,
    organization_id: int,
    db_session: Session,
) -> Grade | None:
    """Retrieve a Grade by name for a specific organization."""
    return db_session.exec(
        select(Grade).where(
            func.lower(Grade.name) == name.lower(),
            Grade.organization_id == organization_id,
        )
    ).one_or_none()


def get_sample_template():
    """Return a sample grade Excel template as a downloadable response."""
    buffer = generate_sample_excel(columns=list(REQUIRED_COLUMNS))
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="Grade sample template.xlsx"'
        },
    )


def create_default_grade(session: Session, organization_id: int) -> Grade:
    """Create and persist the default grade for an organization."""
    new_grade = Grade(
        name="Default Grade",
        monthly_limit=50000,
        daily_limit=1000,
        auto_approval_threshold=50000,
        food_daily_limit=Decimal("500"),
        flight_class=FlightClassEnum.ECONOMY,
        train_class=TrainClassEnum.TIER_3,
        domestic_accommodation_limit=1000,
        international_accommodation_limit=5000,
        organization_id=organization_id,
        car_mileage_rate=1000,
        bike_mileage_rate=2000,
    )
    session.add(new_grade)
    session.flush()
    return new_grade


def get_grade_options_service(
    session: Session,
    organization_id: int,
    limit: int,
    search: str | None = None,
) -> list[GradeOptionResponse]:
    """Fetch grade options (id, name) using ORM with load_only."""
    stmt = (
        select(Grade)
        .where(Grade.organization_id == organization_id)
        .options(load_only(Grade.id, Grade.name))
    )

    if search and (search := search.strip()):
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(func.lower(Grade.name).like(pattern))

    stmt = stmt.order_by(Grade.name.asc()).limit(limit)

    return session.exec(stmt).all()
