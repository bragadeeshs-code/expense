"""Asset Services."""

from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, or_, select

from app.config.logger import get_logger
from app.models.asset import Asset
from app.schemas.asset import (
    AssetCreate,
    AssetDeleteResponse,
    AssetListQuery,
    AssetListResponse,
    AssetOverview,
    AssetResponse,
    AssetUpdate,
    SortOrder,
)
from app.services.user import user_exists

logger = get_logger(__name__)


def add_asset(
    payload: AssetCreate, organization_id: int, session: Session
) -> AssetResponse:
    """Create a new asset."""
    if not user_exists(payload.operator_user_id, organization_id, session):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Selected operator user not found",
        )
    asset = Asset(
        **payload.model_dump(),
        organization_id=organization_id,
    )
    session.add(asset)
    try:
        session.commit()
        return asset
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add asset: {str(e)}",
        )


def get_assets(
    params: AssetListQuery,
    session: Session,
    organization_id: int,
) -> AssetListResponse:
    """Get assets with pagination and filtering."""
    stmt = select(Asset).where(Asset.organization_id == organization_id)
    if params.category:
        stmt = stmt.where(Asset.category == params.category)
    if params.fuel_type:
        stmt = stmt.where(Asset.fuel_type == params.fuel_type)
    if params.vehicle_type:
        stmt = stmt.where(Asset.vehicle_type == params.vehicle_type)
    if params.generator_type:
        stmt = stmt.where(Asset.generator_type == params.generator_type)
    if params.search:
        search = f"%{params.search}%"
        stmt = stmt.where(
            or_(
                Asset.asset_code.ilike(search),
                Asset.make_model.ilike(search),
            )
        )
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = session.exec(count_stmt).one()
    sort_column = getattr(Asset, params.sort_by.value)
    order_fn = (
        sort_column.asc if params.sort_order == SortOrder.asc else sort_column.desc
    )
    stmt = stmt.order_by(order_fn())
    offset = (params.page - 1) * params.per_page
    stmt = (
        stmt.offset(offset)
        .limit(params.per_page)
        .options(
            selectinload(Asset.operator),
        )
    )
    assets = session.exec(stmt).all()
    return AssetListResponse(
        page=params.page,
        per_page=params.per_page,
        total=total,
        data=assets,
    )


def update_asset_service(
    asset_id: int,
    payload: AssetUpdate,
    organization_id: int,
    session: Session,
) -> AssetResponse:
    """Update an asset."""
    asset = session.get(Asset, asset_id)

    if not asset or asset.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    if not user_exists(payload.operator_user_id, organization_id, session):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Selected operator user not found",
        )

    asset.sqlmodel_update(payload.model_dump(exclude_unset=True))
    try:
        session.commit()
        return asset
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update asset: {str(e)}",
        )


def delete_asset_service(
    asset_id: int,
    organization_id: int,
    session: Session,
) -> AssetDeleteResponse:
    """Delete an asset."""
    asset = session.get(Asset, asset_id)

    if not asset or asset.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    session.delete(asset)

    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete asset: {str(e)}",
        )

    return AssetDeleteResponse(id=asset_id)


def get_asset_dashboard_summary(
    session: Session,
    org_id: int,
) -> tuple[int, list[AssetOverview]]:
    """Return total assets and category-wise asset counts for an organization."""
    by_category_stmt = (
        select(
            Asset.category,
            func.count(Asset.id).label("category_count"),
        )
        .where(Asset.organization_id == org_id)
        .group_by(Asset.category)
    )
    rows = session.exec(by_category_stmt).all()

    total_assets = (
        session.scalar(
            select(func.count(Asset.id)).where(Asset.organization_id == org_id)
        )
        or 0
    )

    return total_assets, rows
