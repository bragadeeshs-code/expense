"""Role-related service functions."""

from sqlmodel import Session, exists, select

from app.models.role import Role
from app.schemas.role import RolesResponse


def get_roles(session: Session) -> list[RolesResponse]:
    """Return all roles for the specified organization."""
    return session.exec(select(Role)).all()


def role_exists(session: Session, role_id: int) -> bool:
    """Check whether a role exists."""
    stmt = select(exists().where(Role.id == role_id))
    return session.exec(stmt).one()


def get_role_by_name(
    db_session: Session,
    name: str,
) -> Role | None:
    """Retrieve a Role by name for a specific organization."""
    return db_session.exec(select(Role).where(Role.name == name)).one_or_none()
