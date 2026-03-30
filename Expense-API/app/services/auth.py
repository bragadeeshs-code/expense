"""Authentication service functions."""

from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from app.models.user import User


def get_user_by_email(session: Session, email: str) -> User | None:
    """Retrieve a user by their email address."""
    stmt = select(User).where(User.email == email)
    return session.exec(stmt).first()


def get_user_with_role_by_email(session: Session, email: str) -> User | None:
    """Retrieve a user by email, including their role and permissions."""
    stmt = select(User).where(User.email == email).options(joinedload(User.role))
    return session.exec(stmt).one_or_none()
