"""Router for User-related endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.config.database import get_session
from app.controllers.user import create_user_for_current_user
from app.dependencies.permission import (
    require_admin_permission,
    require_manager_permission,
    require_user_permission,
)
from app.dependencies.user import get_user_filters
from app.models.user import User
from app.schemas.role import UserRole
from app.schemas.shared import SortDirection
from app.schemas.user import (
    PaginatedUserResponse,
    SimpleUser,
    UpdateUserRequest,
    UserCreate,
    UserDeleteResponse,
    UserListFilters,
    UserListQuery,
    UserProfileResponse,
    UserRead,
    UserSortColumn,
    UserUploadResponse,
)
from app.services.user import (
    delete_user_service,
    get_sample_template,
    get_team_members,
    get_user_options,
    get_user_profile,
    get_users,
    update_user_service,
    upload_and_read_user_file,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedUserResponse)
def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    filters: UserListFilters = Depends(get_user_filters),
    sort_by: UserSortColumn = Query(UserSortColumn.UPDATED_AT),
    sort_dir: SortDirection = Query(SortDirection.DESC),
    session: Session = Depends(get_session),
    current_user=Depends(require_admin_permission),
) -> PaginatedUserResponse:
    """List all users under the current user's organization."""
    return get_users(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        filters=filters,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )


@router.get("/managers", response_model=list[SimpleUser])
def list_managers(
    limit: int = Query(5, ge=1, le=15),
    search: str | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> list[SimpleUser]:
    """List all users with manager role."""
    return get_user_options(
        search=search,
        limit=limit,
        current_user=current_user,
        session=session,
        roles=[UserRole.MANAGER, UserRole.ADMIN],
    )


@router.get("/options", response_model=list[SimpleUser])
def list_other_active_users(
    limit: int = Query(5, ge=1, le=15),
    search: str | None = Query(None),
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> list[SimpleUser]:
    """List all active users under the current user's organization excluding the current user."""
    return get_user_options(
        search=search,
        limit=limit,
        current_user=current_user,
        session=session,
    )


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
) -> UserProfileResponse:
    """Get the profile of the current user."""
    return get_user_profile(session, current_user)


@router.post("", response_model=UserRead)
async def create_user(
    user_data: UserCreate,
    session: Session = Depends(get_session),
    current_user=Depends(require_admin_permission),
) -> UserRead:
    """Create a new user under the current user's organization."""
    return await create_user_for_current_user(session, user_data, current_user)


@router.post("/upload", response_model=UserUploadResponse)
async def upload_user_file(
    file: Annotated[UploadFile, File(...)],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> UserUploadResponse:
    """Upload file and read users from it."""
    return await upload_and_read_user_file(file, session, current_user)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_data: UpdateUserRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> UserRead:
    """Update user."""
    return update_user_service(
        session,
        user_id,
        current_user.organization_id,
        user_data,
    )


@router.delete("/{id}", response_model=UserDeleteResponse)
async def delete_user(
    id: int,
    session: Session = Depends(get_session),
    current_user=Depends(require_admin_permission),
) -> UserDeleteResponse:
    """Delete a user by ID under the current user's organization."""
    return await delete_user_service(session, id, current_user)


@router.get("/template", response_class=StreamingResponse)
def user_template(
    _: Annotated[User, Depends(require_admin_permission)],
) -> StreamingResponse:
    """Get user sample template."""
    return get_sample_template()


@router.get("/team-members", response_model=PaginatedUserResponse)
def team_members(
    params: Annotated[UserListQuery, Depends()],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_manager_permission)],
) -> PaginatedUserResponse:
    """Get user's team members."""
    return get_team_members(
        params,
        session,
        current_user.id,
        current_user.organization_id,
    )
