"""Seeder for Default Grade."""

from logging import Logger

from sqlmodel import Session, select

from app.models.grade import Grade
from app.models.organization import Organization
from app.services.grade import create_default_grade


def seed_grade(session: Session, logger: Logger):
    """Seed the database with a default grade."""
    try:
        logger.info("Grade seeding started")
        stmt = select(Grade).where(Grade.organization_id == 1)
        db_grade = session.exec(stmt).first()
        if db_grade:
            return
        db_organization = session.get(Organization, 1)
        if not db_organization:
            return
        create_default_grade(
            organization_id=db_organization.id,
            session=session,
        )
        session.commit()
        logger.info("Created default grade with ID 1")

    except Exception as e:
        session.rollback()
        logger.error(f"Grade seeding failed: {str(e)}")
