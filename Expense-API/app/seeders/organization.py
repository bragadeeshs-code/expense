"""Seeder for Default Organization."""

from logging import Logger

from sqlmodel import Session

from app.models.organization import Organization


def seed_organization(session: Session, logger: Logger):
    """Seed the database with a default organization."""
    try:
        logger.info("Organization seeding started")

        org = session.get(Organization, 1)
        if not org:
            org = Organization(id=1, name="Yavar")
            session.add(org)
            session.commit()
            logger.info("Created default organization with ID 1")

    except Exception as e:
        session.rollback()
        logger.error(f"Organization seeding failed: {str(e)}")
