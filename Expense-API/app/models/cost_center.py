"""Cost center database model."""

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


class CostCenter(SQLModel, table=True):
    """Represents a cost center within an organization."""

    __tablename__ = "cost_centers"

    __table_args__ = (
        UniqueConstraint("code", "organization_id", name="uq_cost_center_code_org"),
    )

    id: int | None = Field(default=None, primary_key=True, index=True)

    code: str = Field(sa_column=Column(CITEXT, nullable=False))

    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id",
                name="fk_cost_centers_organization_id",
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
        back_populates="cost_center",
        passive_deletes="all",
    )
