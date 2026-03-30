"""Dependency to get the currently authenticated user."""

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import joinedload
from sqlmodel import Session
from sqlmodel import select

from app.config.config import settings
from app.config.database import get_session
from app.models.user import User
from app.schemas.user import UserStatus
from app.schemas.role import UserRole
from app.services.auth import (
    get_user_by_email,
    get_user_with_role_by_email,
)
from app.utils.jwt import JWTManager
from app.utils.refresh_token import RefreshTokenVerifier


def _get_dev_authenticated_user(db: Session) -> User:
    """Return a real database user when auth is disabled for local development."""
    stmt = select(User).options(joinedload(User.role))

    if settings.DEV_AUTH_EMAIL:
        stmt = stmt.where(User.email == settings.DEV_AUTH_EMAIL)
    else:
        stmt = stmt.where(User.status == UserStatus.ACTIVE).order_by(User.id)

    user = db.exec(stmt).first()
    if user:
        return user

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Auth bypass is enabled, but no matching local user was found.",
    )


def get_authenticated_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_session),
) -> User:
    """Return the currently authenticated user. Uses app access token first, falls back to auth refresh token."""
    if settings.DISABLE_AUTH:
        return _get_dev_authenticated_user(db)

    access_token = request.cookies.get("access_token")

    if access_token:
        try:
            payload = JWTManager().decode_token(access_token)

            email = payload.get("email")
            if not email:
                raise ValueError("Invalid access token payload")

            user = get_user_by_email(email=email, session=db)
            if user:
                return user

        except Exception:
            pass

    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        refresh_payload = RefreshTokenVerifier.decode(refresh_token)

        email = refresh_payload.get("email")
        if not email:
            raise ValueError("Invalid refresh token payload")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    user = get_user_with_role_by_email(email=email, session=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    token_payload = {
        "user_id": user.id,
        "email": user.email,
        "organization_id": user.organization_id,
    }
    if user.role.name == UserRole.ADMIN:
        token_payload["permissions"] = ["all_write"]
    access_token = JWTManager().create_access_token(token_payload)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        domain=settings.DOMAIN_URL,
        max_age=60 * 60,
    )

    return user
