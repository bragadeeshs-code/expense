"""Department related services."""

from fastapi import HTTPException, status
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, exists, func, select

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreateRequest,
    DepartmentDeleteResponse,
    DepartmentResponse,
    DepartmentSortColumn,
    DepartmentUpdateRequest,
    PaginatedDepartmentResponse,
)
from app.schemas.shared import SortDirection


def create_department_service(
    payload: DepartmentCreateRequest,
    session: Session,
    org_id: int,
) -> DepartmentResponse:
    """Create a new department."""
    department = Department(
        name=payload.name,
        organization_id=org_id,
    )

    session.add(department)

    try:
        session.commit()
        return department

    except IntegrityError as e:
        session.rollback()

        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name

            if constraint == "uq_department_name_org":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Department with this name already exists.",
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create department: {str(e)}",
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create department: {str(e)}",
        )


def update_department_service(
    department_id: int,
    payload: DepartmentUpdateRequest,
    session: Session,
    org_id: int,
) -> DepartmentResponse:
    """Update a department."""
    department = session.exec(
        select(Department).where(
            Department.id == department_id,
            Department.organization_id == org_id,
        )
    ).first()

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found",
        )

    try:
        department.name = payload.name
        session.commit()

        return department

    except IntegrityError as e:
        session.rollback()

        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name

            if constraint == "uq_department_name_org":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Department with this name already exists.",
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update department: {str(e)}",
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update department: {str(e)}",
        )


def get_departments_service(
    session: Session,
    org_id: int,
    page: int,
    per_page: int,
    sort_by: DepartmentSortColumn,
    sort_dir: SortDirection,
    search: str | None = None,
) -> PaginatedDepartmentResponse:
    """Get paginated departments for an organization."""
    query = select(Department).where(Department.organization_id == org_id)

    if search and (search := search.strip()):
        query = query.where(Department.name.ilike(f"%{search}%"))

    total = session.exec(select(func.count()).select_from(query.subquery())).one()

    sort_column = getattr(Department, sort_by.value, Department.updated_at)

    query = query.order_by(
        sort_column.asc() if sort_dir == SortDirection.ASC else sort_column.desc()
    )

    results = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedDepartmentResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=(page * per_page) < total,
        data=results,
    )


def delete_department_service(
    department_id: int, session: Session, org_id: int
) -> DepartmentDeleteResponse:
    """Delete a department."""
    department = session.get(Department, department_id)

    if not department or department.organization_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        )

    try:
        session.delete(department)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete Department: {str(e)}",
        )

    return DepartmentDeleteResponse(id=department_id)


def department_exists(session: Session, department_id: int, org_id: int) -> bool:
    """Check if a department exists within an organization."""
    stmt = select(
        exists().where(
            Department.id == department_id,
            Department.organization_id == org_id,
        )
    )
    return session.exec(stmt).one()


def get_department_id_by_name(
    session: Session,
    name: str,
    org_id: int,
) -> int:
    """Return department id by name within organization."""
    stmt = select(Department.id).where(
        Department.name == name,
        Department.organization_id == org_id,
    )

    department_id = session.exec(stmt).one_or_none()

    if department_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Department with name '{name}' not found.",
        )

    return department_id
