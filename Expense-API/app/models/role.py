"""Role database models."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import (
    Column,
    DateTime,
    Field,
    Integer,
    Relationship,
    SQLModel,
    String,
    func,
)

if TYPE_CHECKING:
    from app.models.user import User


class Role(SQLModel, table=True):
    """Represents an Role record."""

    __tablename__ = "roles"

    id: int = Field(
        sa_column=Column(
            Integer,
            primary_key=True,
            index=True,
            nullable=False,
        )
    )
    name: str = Field(
        sa_column=Column(
            String,
            index=True,
            unique=True,
            nullable=False,
        ),
    )
    description: str = Field(
        sa_column=Column(
            String,
            nullable=False,
        ),
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )

    users: list["User"] = Relationship(back_populates="role")
