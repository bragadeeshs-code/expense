"""Run all seeders to populate the database with initial data."""

from sqlmodel import Session

from app.config.database import engine
from app.config.logger import get_logger
from app.seeders import grade, organization, role, user

logger = get_logger(__name__)


def run_all_seeders():
    """Run all seeders to populate the database with initial data."""
    with Session(engine) as session:
        logger.info("Seeders started")
        organization.seed_organization(session, logger)
        grade.seed_grade(session, logger)
        role.seed_role(session, logger)
        user.seed_user(session, logger)
        logger.info("Seeders done")


if __name__ == "__main__":
    run_all_seeders()
