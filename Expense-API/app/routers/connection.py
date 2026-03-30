"""Connection router for managing connection endpoints."""

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_admin_permission
from app.models.user import User
from app.schemas.connection import (
    ConnectionStatus,
    PaginatedConnectionResponse,
    ProviderType,
    SourceType,
)
from app.services.connection import get_connections

router = APIRouter(prefix="/connections", tags=["Connections"])


@router.get("", response_model=PaginatedConnectionResponse)
async def list_connections(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    source_type: Optional[SourceType] = Query(
        None, description="Filter by source type"
    ),
    provider_type: Optional[ProviderType] = Query(
        None, description="Filter by provider type"
    ),
    status: Optional[ConnectionStatus] = Query(None, description="Filter by status"),
) -> PaginatedConnectionResponse:
    """List all connections with pagination and filtering.

    Args:
        session: Database session
        current_user: Authenticated user
        page: Page number (default: 1)
        per_page: Items per page (default: 10, max: 100)
        source_type: Filter by source type
        provider_type: Filter by provider type
        status: Filter by status

    Returns:
        Paginated list of connections with WhatsApp details

    """
    return get_connections(
        session=session,
        page=page,
        per_page=per_page,
        source_type=source_type,
        provider_type=provider_type,
        status=status,
        organization_id=current_user.organization_id,
    )
