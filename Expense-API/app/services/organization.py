"""Service layer for organization-related business logic."""

from sqlmodel import Session

from app.models.organization import Organization


def create_organization(session: Session, name: str):
    """Create and persist a new organization."""
    new_org = Organization(name=name)
    session.add(new_org)
    session.flush()
    return new_org
