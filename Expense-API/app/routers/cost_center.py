"""Cost Center related API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_admin_permission
from app.models.user import User
from app.schemas.cost_center import (
    CostCenterCreateRequest,
    CostCenterDeleteResponse,
    CostCenterResponse,
    CostCenterSortColumn,
    CostCenterUpdateRequest,
    PaginatedCostCenterResponse,
)
from app.schemas.shared import SortDirection
from app.services.cost_center import (
    create_cost_center_service,
    delete_cost_center_service,
    get_cost_centers_service,
    update_cost_center_service,
)

router = APIRouter(prefix="/cost-centers", tags=["Cost Centers"])


@router.get("/", response_model=PaginatedCostCenterResponse)
def get_cost_centers(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    search: str | None = Query(None),
    sort_by: CostCenterSortColumn = Query(CostCenterSortColumn.UPDATED_AT),
    sort_dir: SortDirection = Query(SortDirection.DESC),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> PaginatedCostCenterResponse:
    """Get all cost centers for this organization."""
    return get_cost_centers_service(
        session=session,
        org_id=current_user.organization_id,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_dir=sort_dir,
        search=search,
    )


@router.post("/", response_model=CostCenterResponse)
def create_cost_center(
    payload: CostCenterCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> CostCenterResponse:
    """Endpoint to create a new cost center."""
    return create_cost_center_service(
        payload=payload, session=session, org_id=current_user.organization_id
    )


@router.put("/{cost_center_id}", response_model=CostCenterResponse)
def update_cost_center(
    cost_center_id: int,
    payload: CostCenterUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> CostCenterResponse:
    """Endpoint to update an existing cost center."""
    return update_cost_center_service(
        cost_center_id=cost_center_id,
        payload=payload,
        session=session,
        org_id=current_user.organization_id,
    )


@router.delete("/{cost_center_id}", response_model=CostCenterDeleteResponse)
def delete_cost_center(
    cost_center_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> CostCenterDeleteResponse:
    """Endpoint to delete and existing cost center."""
    return delete_cost_center_service(
        cost_center_id=cost_center_id,
        session=session,
        org_id=current_user.organization_id,
    )
