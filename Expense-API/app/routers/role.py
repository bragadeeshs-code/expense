"""Role management API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_admin_permission
from app.models.user import User
from app.schemas.role import RolesResponse
from app.services.role import get_roles

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("", response_model=list[RolesResponse])
def list_roles(
    session: Annotated[Session, Depends(get_session)],
    _: Annotated[User, Depends(require_admin_permission)],
) -> list[RolesResponse]:
    """Return all roles visible to the current user."""
    return get_roles(session)
