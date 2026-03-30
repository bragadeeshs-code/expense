"""Signup router."""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.database import get_session
from app.controllers.user import create_user_under_organization
from app.schemas.user import UserRead, UserSignUpRequest

router = APIRouter(prefix="/signup", tags=["Signup"])


@router.post("", response_model=UserRead)
async def signup(
    user_data: UserSignUpRequest, session: Session = Depends(get_session)
) -> UserRead:
    """Handle user signup and organization creation."""
    return await create_user_under_organization(session, user_data)
