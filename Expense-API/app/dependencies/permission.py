"""Permission dependencies for routes."""

from typing import Annotated

from fastapi import Depends, HTTPException, status

from app.config.config import settings
from app.dependencies.auth import get_authenticated_user
from app.models.user import User
from app.schemas.role import UserRole


def require_role(allowed_roles: set):
    """Dependency to require a user to have one of the specified roles."""

    def validate_role(
        user: Annotated[User, Depends(get_authenticated_user)],
    ) -> User:
        """Validate that the user has one of the allowed roles."""
        if settings.DISABLE_AUTH:
            return user

        if user.role and user.role.name in allowed_roles:
            return user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to perform this operation.",
        )

    return validate_role


require_admin_permission = require_role(allowed_roles={UserRole.ADMIN})

require_user_permission = require_role(
    allowed_roles={UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCER, UserRole.USER}
)

require_manager_permission = require_role(
    allowed_roles={UserRole.ADMIN, UserRole.MANAGER}
)

require_financer_permission = require_role(
    allowed_roles={UserRole.ADMIN, UserRole.FINANCER}
)
