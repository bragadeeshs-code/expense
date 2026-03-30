"""Organization model."""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, Relationship, SQLModel, String

if TYPE_CHECKING:
    from expense import Expense
    from user import User


class Organization(SQLModel, table=True):
    """Represents an organization."""

    __tablename__ = "organizations"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    name: str = Field(
        sa_column=Column(
            String,
            nullable=False,
            unique=True,
        ),
    )

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
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

    users: List["User"] = Relationship(
        back_populates="organization",
    )

    expenses: List["Expense"] = Relationship(
        back_populates="organization",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
