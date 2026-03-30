"""Service layer for user-related business logic."""

import re
from typing import Any, Dict

from fastapi import HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from psycopg2.errors import ForeignKeyViolation, UniqueViolation
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import contains_eager, selectinload
from sqlmodel import Session, and_, case, exists, func, insert, or_, select, update

from app.config.database import get_thread_session
from app.config.logger import get_logger
from app.constants.user import FILTER_MAP, REQUIRED_COLUMNS
from app.models.cost_center import CostCenter
from app.models.department import Department
from app.models.grade import Grade
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.project_member import ProjectMember
from app.models.role import Role
from app.models.user import User
from app.schemas.role import UserRole
from app.schemas.shared import SortDirection
from app.schemas.user import (
    PaginatedUserResponse,
    SimpleUser,
    UpdateUserRequest,
    UserActions,
    UserCreateWithOrg,
    UserListFilters,
    UserListQuery,
    UserProfileResponse,
    UserRead,
    UserSortColumn,
    UserStatus,
    UserUploadResponse,
)
from app.services.cost_center import cost_center_exists
from app.services.department import department_exists
from app.services.grade import grade_exists
from app.services.rabbitmq.user.event import user_event_producer
from app.services.role import role_exists
from app.utils.file import generate_sample_excel, read_upload_file, required_cell
from app.utils.phone_number import normalize_phone_number

logger = get_logger(__name__)


def user_exists(user_id: int, organization_id: int, session: Session) -> bool:
    """Check whether a user exists in an organization."""
    stmt = select(
        exists()
        .select_from(User)
        .where(
            User.id == user_id,
            User.organization_id == organization_id,
        )
    )

    return session.scalar(stmt)


def validate_manager(
    session: Session,
    user_id: int,
    organization_id: int,
) -> bool:
    """Validate that a user is a valid manager for an organization."""
    stmt = (
        select(User.id)
        .join(User.role)
        .where(
            User.id == user_id,
            User.organization_id == organization_id,
            Role.name.in_([UserRole.ADMIN, UserRole.MANAGER]),
        )
    )

    return session.scalar(stmt) is not None


async def create_user_service(
    session: Session, user_data: UserCreateWithOrg
) -> UserRead:
    """Create a new user in the database and publish a creation event."""
    conditions = [User.email == user_data.email]

    if user_data.mobile_number:
        conditions.append(
            and_(
                User.mobile_number == user_data.mobile_number,
                User.organization_id == user_data.organization_id,
            )
        )

    if user_data.code:
        conditions.append(
            and_(
                User.code == user_data.code,
                User.organization_id == user_data.organization_id,
            )
        )

    existing_user = session.exec(select(User).where(or_(*conditions))).first()

    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email '{user_data.email}' already exists.",
            )

        if user_data.code and existing_user.code == user_data.code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this employee ID already exists",
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this mobile number already exists.",
        )

    new_user = User(**user_data.model_dump())
    session.add(new_user)

    try:
        session.flush()
        await user_event_producer.publish_event(
            payload={
                "email": new_user.email,
                "meta_data": {
                    "expense": True,
                },
            },
            action=UserActions.CREATE,
        )
        session.commit()
    except IntegrityError as ie:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error: {str(ie)}",
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
                if "rabbitmq" in str(e).lower()
                else status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=f"Error: {str(e)}",
        )

    return new_user


def update_user_fields(
    user_email: str, fields_to_update: Dict[str, Any]
) -> User | None:
    """Update fields of a user by ID."""
    if not fields_to_update:
        return None

    fields_to_update.pop("email", None)

    with get_thread_session() as session:
        user = session.exec(select(User).where(User.email == user_email)).first()
        if not user:
            logger.warning(f"User with email {user_email} not found")
            return None

        user.sqlmodel_update(fields_to_update)

        try:
            session.add(user)
            session.commit()
        except Exception as e:
            session.rollback()
            logger.warning(f"Error updating user {user_email}: {str(e)}")
            return None

        return user


def get_users(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
    filters: UserListFilters,
    sort_by: UserSortColumn,
    sort_dir: SortDirection,
) -> PaginatedUserResponse:
    """Get paginated users under the current user's organization."""
    query = (
        select(User)
        .where(User.organization_id == current_user.organization_id)
        .join(Role, User.role_id == Role.id)
        .join(Grade, User.grade_id == Grade.id)
        .outerjoin(CostCenter, User.cost_center_id == CostCenter.id)
        .outerjoin(Department, User.department_id == Department.id)
        .options(
            contains_eager(User.role),
            contains_eager(User.grade),
            selectinload(User.reporting_manager),
            contains_eager(User.cost_center),
            contains_eager(User.department),
        )
    )

    filter_list = []

    if filters.search and (search := filters.search.strip()):
        pattern = f"%{search.lower()}%"
        full_name = func.lower(func.concat(User.first_name, " ", User.last_name))
        filter_list.append(
            or_(
                func.lower(User.email).like(pattern),
                full_name.like(pattern),
                func.lower(User.mobile_number).like(pattern),
                func.lower(Grade.name).like(pattern),
                func.lower(User.code).like(pattern),
                func.lower(Role.name).like(pattern),
                func.lower(Department.name).like(pattern),
            )
        )

    for field, builder in FILTER_MAP.items():
        value = getattr(filters, field)
        if value is not None:
            filter_list.append(builder(value))

    if filter_list:
        query = query.where(and_(*filter_list))

    total_users = (
        session.exec(select(func.count()).select_from(query.subquery())).first() or 0
    )

    if sort_by == UserSortColumn.GRADE:
        sort_column = Grade.name
    elif sort_by == UserSortColumn.ROLE:
        sort_column = Role.name
    else:
        sort_column = getattr(User, sort_by.value, User.updated_at)

    query = query.order_by(
        sort_column.asc() if sort_dir == SortDirection.ASC else sort_column.desc()
    )

    users = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedUserResponse(
        total=total_users,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total_users,
        data=users,
    )


def get_user_options(
    session: Session,
    search: str | None,
    limit: int,
    current_user: User,
    roles: list[UserRole] | None = None,
) -> list[SimpleUser]:
    """Retrieve user options with optional search filter."""
    conditions = [
        User.organization_id == current_user.organization_id,
    ]

    query = select(User.id, User.first_name, User.last_name)

    if roles:
        conditions.append(User.role.has(Role.name.in_(roles)))

    if search and (search := search.strip()):
        pattern = f"%{search.lower()}%"
        full_name = func.lower(func.concat(User.first_name, " ", User.last_name))
        conditions.append(full_name.like(pattern))

    query = query.where(*conditions)

    return session.exec(query.order_by(User.first_name).limit(limit)).all()


async def delete_user_service(session: Session, id: int, current_user: User) -> User:
    """Delete a user by ID under the current user's organization."""
    user_to_delete = session.exec(
        select(User).where(
            User.id == id, User.organization_id == current_user.organization_id
        )
    ).first()

    if not user_to_delete:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    try:
        session.delete(user_to_delete)
        session.commit()
        await user_event_producer.publish_event(
            payload={
                "email": user_to_delete.email,
                "app_metadata_to_remove": [
                    "expense",
                ],
            },
            action=UserActions.DELETE,
        )
        return user_to_delete

    except IntegrityError as e:
        session.rollback()
        msg = f"Failed to delete user: {str(e)}"

        if isinstance(e.orig, ForeignKeyViolation):
            constraint = e.orig.diag.constraint_name
            if constraint == "fk_projects_manager_id":
                msg = "User cannot be deleted because they manage one or more projects."
            elif constraint == "fx_asset_operator_user_id":
                msg = "User cannot be deleted because they are assigned to assets."
            elif constraint == "fk_project_approval_approver_id":
                msg = "User cannot be deleted because they are an approver for one or more projects."
            elif constraint == "fk_project_members_user_id":
                msg = "User cannot be deleted because they are a member of one or more projects."
            elif constraint == "fk_user_expense_approvals_approver_id":
                msg = "User cannot be deleted because they are an approver for one or more expenses."
            elif constraint == "fk_trips_created_by":
                msg = "User cannot be deleted because they have created one or more travel requests."
            elif constraint == "fk_advances_issued_by":
                msg = "User cannot be deleted because they have issued one or more advances."

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=msg,
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=msg,
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
                if "rabbitmq" in str(e).lower()
                else status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=f"Failed to delete user: {str(e)}",
        )


async def upload_and_read_user_file(
    file: UploadFile, session: Session, current_user: User
) -> UserUploadResponse:
    """Service to read and save user to db."""
    df = read_upload_file(file, REQUIRED_COLUMNS)

    users_to_create: list[dict] = []
    pending_manager_links: dict[str, str] = {}

    grades = session.exec(
        select(Grade.name, Grade.id).where(
            Grade.organization_id == current_user.organization_id
        )
    ).all()
    grade_map = dict(grades)

    roles = session.exec(select(Role.name, Role.id)).all()
    role_map = dict(roles)

    cost_centers = session.exec(
        select(CostCenter.code, CostCenter.id).where(
            CostCenter.organization_id == current_user.organization_id
        )
    ).all()
    cost_center_map = dict(cost_centers)

    departments = session.exec(
        select(Department.name, Department.id).where(
            Department.organization_id == current_user.organization_id
        )
    ).all()
    department_map = dict(departments)

    for idx, row in df.iterrows():
        row_no = idx + 1

        grade_name = required_cell(row, "grade", row_no)
        grade_id = grade_map.get(grade_name)

        if not grade_id:
            raise HTTPException(
                detail=f"Invalid grade for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        role_name = required_cell(row, "role", row_no)
        role_id = role_map.get(role_name)

        if not role_id:
            raise HTTPException(
                detail=f"Invalid role for row {row_no}",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )

        mobile_number = required_cell(
            row,
            "mobile number",
            row_no,
            raise_exc=False,
        )
        try:
            parsed_mobile_number = normalize_phone_number(mobile_number)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=f"{e}"
            )

        code = required_cell(row, "code", row_no)

        reporting_manager_code = required_cell(
            row, "reporting manager code", row_no, raise_exc=False
        )

        cost_center_code = required_cell(row, "cost center", row_no, raise_exc=False)
        department_name = required_cell(row, "department", row_no, raise_exc=False)

        cost_center_id = cost_center_map.get(cost_center_code)
        department_id = department_map.get(department_name)

        try:
            data = UserCreateWithOrg(
                first_name=row["first name"],
                last_name=row["last name"],
                email=row["email"],
                mobile_number=parsed_mobile_number,
                code=code,
                grade_id=grade_id,
                role_id=role_id,
                organization_id=current_user.organization_id,
                cost_center_id=cost_center_id,
                department_id=department_id,
            )

            users_to_create.append(data.model_dump())

            if reporting_manager_code:
                pending_manager_links[code] = reporting_manager_code

        except ValidationError as e:
            if e.errors():
                err = e.errors()[0]
                field = ".".join(map(str, err.get("loc", ["unknown"])))
                msg = err.get("msg", "Invalid value")
                raise HTTPException(
                    detail=f"Row {row_no}: '{field}' is invalid. {msg}",
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                )
            else:
                raise HTTPException(
                    detail="Validation error at row {row_no}",
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                )

    if not users_to_create:
        return UserUploadResponse(message="No users to upload")

    try:
        insert_stmt = insert(User).values(users_to_create).returning(User.id, User.code)

        inserted_users = session.exec(insert_stmt).all()

        user_code_to_id = {code: user_id for user_id, code in inserted_users}

        manager_codes = set(pending_manager_links.values())

        manager_code_to_id = {}

        if manager_codes:
            managers = session.exec(
                select(User.code, User.id).where(
                    User.code.in_(manager_codes),
                    User.organization_id == current_user.organization_id,
                )
            ).all()

            manager_code_to_id = dict(managers)

        updates: dict[int, int] = {}

        for user_code, manager_code in pending_manager_links.items():
            manager_id = manager_code_to_id.get(manager_code)

            if not manager_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid reporting manager code '{manager_code}'",
                )

            updates[user_code_to_id[user_code]] = manager_id

        if updates:
            stmt = (
                update(User)
                .where(
                    User.id.in_(updates.keys()),
                    User.organization_id == current_user.organization_id,
                )
                .values(
                    reporting_manager_id=case(
                        updates,
                        value=User.id,
                    )
                )
            )

            session.exec(stmt)

        for user in users_to_create:
            await user_event_producer.publish_event(
                payload={
                    "email": user["email"],
                    "meta_data": {"expense": True},
                },
                action=UserActions.CREATE,
            )

        session.commit()

    except HTTPException:
        session.rollback()
        raise
    except IntegrityError as e:
        session.rollback()

        msg = f"Failed to add user: {str(e)}"

        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name
            detail = e.orig.diag.message_detail

            duplicate_value = None

            if detail:
                match = re.search(r"\((.*?)\)=\((.*?)\)", detail)
                if match:
                    values = match.group(2).split(",")
                    duplicate_value = values[0].strip()

            if constraint == "uq_users_code_organization_id":
                msg = f"A user with the code '{duplicate_value}' already exists."

            elif constraint == "uq_users_mobile_number_organization_id":
                msg = f"Mobile number '{duplicate_value}' already exists."

            elif constraint == "users_email_key":
                msg = f"Email '{duplicate_value}' already exists."

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg,
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            detail=f"Failed to upload users: {e}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    total_users = len(users_to_create)

    return UserUploadResponse(
        message=f"Upload successful: {total_users} user{'s' if total_users > 1 else ''} added."
    )


def update_user_service(
    session: Session,
    user_id: int,
    organization_id: int,
    user_data: UpdateUserRequest,
) -> UserRead:
    """Update a user belonging to a specific organization."""
    user = session.exec(
        select(User).where(User.id == user_id, User.organization_id == organization_id)
    ).one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if user_data.mobile_number:
        existing_user = session.exec(
            select(
                exists().where(
                    User.organization_id == organization_id,
                    User.mobile_number == user_data.mobile_number,
                    User.id != user.id,
                )
            )
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number already in use by another user.",
            )
    user.mobile_number = user_data.mobile_number

    if user_data.code:
        existing_user = session.exec(
            select(
                exists().where(
                    User.organization_id == organization_id,
                    User.code == user_data.code,
                    User.id != user.id,
                )
            )
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An employee with this ID already exists.",
            )
        user.code = user_data.code

    if user_data.grade_id:
        grade = grade_exists(session, user_data.grade_id, organization_id)
        if not grade:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid grade. Grade does not exist.",
            )
        user.grade_id = user_data.grade_id

    if user_data.role_id:
        role = role_exists(session, user_data.role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Role does not exist.",
            )
        user.role_id = user_data.role_id

    if user_data.reporting_manager_id is not None:
        if user_data.reporting_manager_id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User cannot be their own reporting manager.",
            )
        if not validate_manager(
            session, user_data.reporting_manager_id, organization_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reporting manager. Manager does not exist or has insufficient role.",
            )
        user.reporting_manager_id = user_data.reporting_manager_id

    if user_data.cost_center_id is not None:
        if user_data.cost_center_id != user.cost_center_id:
            if not cost_center_exists(
                session, user_data.cost_center_id, organization_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid cost center.",
                )

            user.cost_center_id = user_data.cost_center_id

    if user_data.department_id is not None:
        if user_data.department_id != user.department_id:
            if not department_exists(session, user_data.department_id, organization_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid department.",
                )

            user.department_id = user_data.department_id

    if user_data.first_name:
        user.first_name = user_data.first_name

    if user_data.last_name:
        user.last_name = user_data.last_name

    try:
        session.commit()
        return user
    except HTTPException:
        session.rollback()
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}",
        )


def get_sample_template():
    """Return a sample user Excel template as a downloadable response."""
    buffer = generate_sample_excel(columns=list(REQUIRED_COLUMNS))
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="User sample template.xlsx"'
        },
    )


def get_team_members(
    params: UserListQuery,
    session: Session,
    user_id: int,
    organization_id: int,
) -> PaginatedUserResponse:
    """Get paginated users for the current user's project's members."""
    project_ids_subq = (
        select(Project.id)
        .where(Project.manager_id == user_id)
        .union(
            select(ProjectApprovalMatrix.project_id).where(
                ProjectApprovalMatrix.approver_id == user_id
            )
        )
        .subquery()
    )

    base_conditions = [
        ProjectMember.project_id.in_(project_ids_subq),
        User.organization_id == organization_id,
    ]

    if params.search:
        pattern = f"%{params.search.lower()}%"
        base_conditions.append(
            or_(
                func.lower(User.email).like(pattern),
                func.lower(User.first_name).like(pattern),
                func.lower(User.last_name).like(pattern),
                func.lower(User.mobile_number).like(pattern),
                func.lower(Grade.name).like(pattern),
                func.lower(Role.name).like(pattern),
                func.lower(User.code).like(pattern),
            )
        )

    total_users = session.exec(
        select(func.count(func.distinct(User.id)))
        .join(ProjectMember, ProjectMember.user_id == User.id)
        .where(*base_conditions)
    ).one()

    users = session.exec(
        select(User)
        .join(ProjectMember, ProjectMember.user_id == User.id)
        .where(*base_conditions)
        .distinct()
        .options(
            selectinload(User.grade),
            selectinload(User.role),
            selectinload(User.cost_center),
            selectinload(User.department),
        )
        .order_by(User.updated_at.desc())
        .offset((params.page - 1) * params.per_page)
        .limit(params.per_page)
    ).all()

    return PaginatedUserResponse(
        data=users,
        total=total_users,
        page=params.page,
        per_page=params.per_page,
        has_next_page=params.page * params.per_page < total_users,
    )


def get_user_profile(
    session: Session,
    current_user: User,
) -> UserProfileResponse:
    """Fetch the profile of the current user."""
    user = session.exec(
        select(User)
        .where(User.id == current_user.id)
        .options(
            selectinload(User.role),
            selectinload(User.grade),
            selectinload(User.cost_center),
            selectinload(User.department),
        )
    ).one()

    return UserProfileResponse(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.mobile_number,
        role=user.role.name,
        grade=user.grade.name,
        cost_center=user.cost_center.code if user.cost_center else None,
        department=user.department.name if user.department else None,
    )


def get_user_counts_by_org(session: Session, org_id: int) -> int:
    """Return total users count for an organization."""
    stmt = select(
        func.count().label("total_users"),
    ).where(User.organization_id == org_id)
    return session.scalar(stmt) or 0


def get_invited_users_by_org(session: Session, org_id: int) -> list[str]:
    """Return invited users name for an organization."""
    stmt = select(
        func.concat(User.first_name, " ", User.last_name).label("name")
    ).where(User.organization_id == org_id, User.status == UserStatus.INVITED)
    return session.scalars(stmt)
