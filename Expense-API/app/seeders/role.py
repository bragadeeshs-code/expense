"""Database seeder for initializing roles and role-permission mappings."""

from logging import Logger

from sqlalchemy.dialects.postgresql import insert
from sqlmodel import Session

from app.models.role import Role
from app.schemas.role import UserRole


def seed_role(session: Session, logger: Logger):
    """Seed default roles."""
    try:
        roles_data = [
            Role(
                name=UserRole.ADMIN.value,
                description="Can manage all settings, users, and data.",
            ).model_dump(),
            Role(
                name=UserRole.USER.value,
                description="Can view data but can't make changes.",
            ).model_dump(),
            Role(
                name=UserRole.MANAGER.value,
                description="Can approve requests but can't make changes.",
            ).model_dump(),
            Role(
                name=UserRole.FINANCER.value,
                description="Can review expenses, enforce budget rules, and approve payments.",
            ).model_dump(),
        ]

        role_insert_stmt = (
            insert(Role)
            .values(roles_data)
            .on_conflict_do_nothing(index_elements=["name"])
        )
        session.exec(role_insert_stmt)

        session.commit()
        logger.info("Role seeding completed")

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to seed roles: {str(e)}")
