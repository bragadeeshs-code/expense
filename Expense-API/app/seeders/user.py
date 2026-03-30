"""Seed the database with a default admin user."""

from logging import Logger

from sqlmodel import Session, select

from app.models.grade import Grade
from app.models.organization import Organization
from app.models.role import Role
from app.models.user import User
from app.schemas.role import UserRole
from app.schemas.user import UserStatus


def seed_user(session: Session, logger: Logger):
    """Seed the database with a default admin user."""
    logger.info("Admin user seeding started")

    user_email = "udhayakumar.c@yavar.ai"
    first_name = "Udhayakumar"
    last_name = "C"

    existing_user = session.exec(select(User).where(User.email == user_email)).first()
    if existing_user:
        logger.info(
            f"User '{user_email}' already exists under org id {existing_user.organization_id}"
        )
        return

    org = session.get(Organization, 1)
    if not org:
        logger.error(
            "Default organization with ID 1 does not exist. Cannot create admin user."
        )
        return

    grade = session.exec(
        select(Grade).where(
            Grade.organization_id == org.id,
        )
    ).first()

    if not grade:
        logger.error(
            "Grade does not exist in the default organization 1. Cannot create admin user."
        )
        return

    role = session.exec(
        select(Role).where(
            Role.name == UserRole.ADMIN.value,
        )
    ).one_or_none()

    if not role:
        logger.error(
            "Admin role does not exist in the default organization 1. Cannot create admin user."
        )
        return

    admin_user = User(
        email=user_email,
        status=UserStatus.ACTIVE,
        grade_id=grade.id,
        organization_id=1,
        first_name=first_name,
        last_name=last_name,
        code="ADMIN001",
        role_id=role.id,
    )

    session.add(admin_user)
    session.commit()

    logger.info(f"User '{user_email}' created under organization ID 1")
