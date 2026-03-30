"""Asset-related API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import (
    require_admin_permission,
)
from app.models.user import User
from app.schemas.asset import (
    AssetCreate,
    AssetDeleteResponse,
    AssetListQuery,
    AssetListResponse,
    AssetResponse,
    AssetUpdate,
)
from app.services.asset import (
    add_asset,
    delete_asset_service,
    get_assets,
    update_asset_service,
)

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post(
    "",
    response_model=AssetResponse,
    response_model_exclude_none=True,
)
def create_asset(
    payload: AssetCreate,
    current_user: Annotated[User, Depends(require_admin_permission)],
    session: Annotated[Session, Depends(get_session)],
) -> AssetResponse:
    """Create a new asset."""
    return add_asset(
        payload,
        current_user.organization_id,
        session,
    )


@router.get(
    "",
    response_model=AssetListResponse,
    response_model_exclude_none=True,
)
def list_asset(
    params: Annotated[AssetListQuery, Depends()],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> AssetListResponse:
    """List all assets with pagination and filtering."""
    return get_assets(
        params,
        session,
        current_user.organization_id,
    )


@router.put(
    "/{asset_id}",
    response_model=AssetResponse,
    response_model_exclude_none=True,
)
def update_asset(
    asset_id: int,
    payload: AssetUpdate,
    current_user: Annotated[User, Depends(require_admin_permission)],
    session: Annotated[Session, Depends(get_session)],
) -> AssetResponse:
    """Update an existing asset."""
    return update_asset_service(
        asset_id=asset_id,
        payload=payload,
        organization_id=current_user.organization_id,
        session=session,
    )


@router.delete("/{asset_id}", response_model=AssetDeleteResponse)
def delete_asset(
    asset_id: int,
    current_user: Annotated[User, Depends(require_admin_permission)],
    session: Annotated[Session, Depends(get_session)],
) -> AssetDeleteResponse:
    """Delete an asset."""
    return delete_asset_service(
        asset_id=asset_id,
        organization_id=current_user.organization_id,
        session=session,
    )
