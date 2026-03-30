"""Cost center service functions."""

from fastapi import HTTPException, status
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, exists, func, select

from app.models.cost_center import CostCenter
from app.schemas.cost_center import (
    CostCenterCreateRequest,
    CostCenterDeleteResponse,
    CostCenterResponse,
    CostCenterSortColumn,
    CostCenterUpdateRequest,
    PaginatedCostCenterResponse,
)
from app.schemas.shared import SortDirection


def create_cost_center_service(
    payload: CostCenterCreateRequest,
    session: Session,
    org_id: int,
) -> CostCenterResponse:
    """Create a cost center."""
    cost_center = CostCenter(
        code=payload.code,
        organization_id=org_id,
    )

    session.add(cost_center)

    try:
        session.commit()
        return cost_center

    except IntegrityError as e:
        session.rollback()

        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name

            if constraint == "uq_cost_center_code_org":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Cost center with this code already exists.",
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create cost center: {str(e)}",
        )

    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create cost center",
        )


def update_cost_center_service(
    cost_center_id: int,
    payload: CostCenterUpdateRequest,
    session: Session,
    org_id: int,
) -> CostCenterResponse:
    """Update a cost center."""
    cost_center = session.exec(
        select(CostCenter).where(
            CostCenter.id == cost_center_id,
            CostCenter.organization_id == org_id,
        )
    ).first()

    if not cost_center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cost center not found",
        )

    try:
        cost_center.code = payload.code
        session.commit()

        return cost_center

    except IntegrityError as e:
        session.rollback()

        if isinstance(e.orig, UniqueViolation):
            constraint = e.orig.diag.constraint_name

            if constraint == "uq_cost_center_code_org":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Cost center with this code already exists.",
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update cost center: {str(e)}",
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update cost center: {str(e)}",
        )


def get_cost_centers_service(
    session: Session,
    org_id: int,
    page: int,
    per_page: int,
    sort_by: CostCenterSortColumn,
    sort_dir: SortDirection,
    search: str | None = None,
) -> PaginatedCostCenterResponse:
    """Get paginated cost centers for an organization."""
    query = select(CostCenter).where(CostCenter.organization_id == org_id)

    if search and (search := search.strip()):
        query = query.where(CostCenter.code.ilike(f"%{search}%"))

    total = session.exec(select(func.count()).select_from(query.subquery())).one()

    sort_column = getattr(CostCenter, sort_by.value, CostCenter.updated_at)

    query = query.order_by(
        sort_column.asc() if sort_dir == SortDirection.ASC else sort_column.desc()
    )

    results = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedCostCenterResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=(page * per_page) < total,
        data=results,
    )


def delete_cost_center_service(
    cost_center_id: int, session: Session, org_id: int
) -> CostCenterDeleteResponse:
    """Delete a cost center."""
    cost_center = session.get(CostCenter, cost_center_id)

    if not cost_center or cost_center.organization_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cost center not found"
        )

    try:
        session.delete(cost_center)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete cost center: {str(e)}",
        )

    return CostCenterDeleteResponse(id=cost_center_id)


def cost_center_exists(session: Session, cost_center_id: int, org_id: int) -> bool:
    """Check if a cost center exists within an organization."""
    stmt = select(
        exists().where(
            CostCenter.id == cost_center_id,
            CostCenter.organization_id == org_id,
        )
    )
    return session.exec(stmt).one()


def get_cost_center_id_by_code(
    session: Session,
    code: str,
    org_id: int,
) -> int:
    """Return cost center id by code within organization."""
    stmt = select(CostCenter.id).where(
        CostCenter.code == code,
        CostCenter.organization_id == org_id,
    )

    cost_center_id = session.exec(stmt).one_or_none()

    if cost_center_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cost center with code '{code}' not found.",
        )

    return cost_center_id
