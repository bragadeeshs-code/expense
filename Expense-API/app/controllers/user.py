"""Controller for User-related operations."""

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.user import User
from app.schemas.role import UserRole
from app.schemas.user import (
    UserCreate,
    UserCreateWithOrg,
    UserRead,
    UserSignUpRequest,
)
from app.services.cost_center import cost_center_exists
from app.services.department import department_exists
from app.services.grade import create_default_grade, grade_exists
from app.services.organization import create_organization
from app.services.role import get_role_by_name, role_exists
from app.services.user import create_user_service, validate_manager


async def create_user_for_current_user(
    session: Session, user_data: UserCreate, current_user: User
) -> UserRead:
    """Create a new user under the current user's organization."""
    grade = grade_exists(session, user_data.grade_id, current_user.organization_id)
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid grade. Grade does not exist.",
        )
    role = role_exists(session, user_data.role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Role does not exist.",
        )

    if user_data.reporting_manager_id is not None:
        if not validate_manager(
            session, user_data.reporting_manager_id, current_user.organization_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reporting manager. Manager does not exist or has insufficient role.",
            )

    if user_data.cost_center_id is not None:
        if not cost_center_exists(
            session, user_data.cost_center_id, current_user.organization_id
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid cost center.",
            )

    if user_data.department_id is not None:
        if not department_exists(
            session, user_data.department_id, current_user.organization_id
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid department.",
            )

    user_with_org = UserCreateWithOrg(
        **user_data.model_dump(),
        organization_id=current_user.organization_id,
    )
    return await create_user_service(session, user_with_org)


async def create_user_under_organization(
    session: Session, user_data: UserSignUpRequest
) -> UserRead:
    """Create an organization and a user under it."""
    try:
        new_org = create_organization(session, user_data.organization_name)
        new_grade = create_default_grade(organization_id=new_org.id, session=session)
        role = get_role_by_name(session, UserRole.ADMIN.value)
        if not role:
            raise HTTPException(status_code=404, detail="Role not found.")
        user_with_org = UserCreateWithOrg(
            **user_data.model_dump(),
            organization_id=new_org.id,
            grade_id=new_grade.id,
            role_id=role.id,
        )
        return await create_user_service(session, user_with_org)
    except HTTPException:
        session.rollback()
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )
