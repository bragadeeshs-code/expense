"""Department database model."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy.dialects.postgresql import CITEXT
from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)

if TYPE_CHECKING:
    from user import User


class Department(SQLModel, table=True):
    """Represents a department within an organization."""

    __tablename__ = "departments"

    __table_args__ = (
        UniqueConstraint("name", "organization_id", name="uq_department_name_org"),
    )

    id: int | None = Field(default=None, primary_key=True, index=True)

    name: str = Field(sa_column=Column(CITEXT, nullable=False))

    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id",
                name="fk_departments_organization_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
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

    users: list["User"] = Relationship(
        back_populates="department",
        passive_deletes="all",
    )
