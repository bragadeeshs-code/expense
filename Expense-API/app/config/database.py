"""Database configuration and session management for the Expense Management API."""

from sqlmodel import Session, create_engine

from app.config.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)


def get_session():
    """Provide a SQLModel database session."""
    with Session(engine) as session:
        yield session


def get_thread_session():
    """Return a SQLModel session bound to the current thread."""
    return Session(engine)
