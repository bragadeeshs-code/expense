"""Department related API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_admin_permission
from app.models.user import User
from app.schemas.department import (
    DepartmentCreateRequest,
    DepartmentDeleteResponse,
    DepartmentResponse,
    DepartmentSortColumn,
    DepartmentUpdateRequest,
    PaginatedDepartmentResponse,
)
from app.schemas.shared import SortDirection
from app.services.department import (
    create_department_service,
    delete_department_service,
    get_departments_service,
    update_department_service,
)

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("/", response_model=PaginatedDepartmentResponse)
def get_departments(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    search: str | None = Query(None),
    sort_by: DepartmentSortColumn = Query(DepartmentSortColumn.UPDATED_AT),
    sort_dir: SortDirection = Query(SortDirection.DESC),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> PaginatedDepartmentResponse:
    """Get all departments for this organization."""
    return get_departments_service(
        session=session,
        org_id=current_user.organization_id,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_dir=sort_dir,
        search=search,
    )


@router.post("/", response_model=DepartmentResponse)
def create_department(
    payload: DepartmentCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> DepartmentResponse:
    """Endpoint to create a new department."""
    return create_department_service(
        payload=payload, session=session, org_id=current_user.organization_id
    )


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    payload: DepartmentUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> DepartmentResponse:
    """Endpoint to update an existing department."""
    return update_department_service(
        department_id=department_id,
        payload=payload,
        session=session,
        org_id=current_user.organization_id,
    )


@router.delete("/{department_id}", response_model=DepartmentDeleteResponse)
def delete_department(
    department_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> DepartmentDeleteResponse:
    """Endpoint to delete and existing department."""
    return delete_department_service(
        department_id=department_id,
        session=session,
        org_id=current_user.organization_id,
    )
