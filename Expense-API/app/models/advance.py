"""Advance database model."""

from datetime import datetime
from decimal import Decimal

from sqlmodel import (
    Column,
    DateTime,
    Enum,
    Field,
    ForeignKey,
    Integer,
    Numeric,
    SQLModel,
    func,
)

from app.schemas.advance import AdvanceStatus


class Advance(SQLModel, table=True):
    """Represents a advance requested by an employee."""

    __tablename__ = "advances"

    id: int | None = Field(
        default=None,
        primary_key=True,
        index=True,
        nullable=False,
    )
    trip_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(
                "trips.id",
                ondelete="RESTRICT",
                name="fk_advances_trip_id",
            ),
            nullable=False,
        )
    )
    organization_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(
                "organizations.id",
                ondelete="CASCADE",
                name="fk_advances_organization_id",
            ),
            nullable=False,
        )
    )
    issued_amount: Decimal | None = Field(
        default=None,
        sa_column=Column(
            Numeric(18, 2),
            nullable=True,
        ),
    )
    issued_by: int | None = Field(
        default=None,
        sa_column=Column(
            Integer,
            ForeignKey(
                "users.id",
                ondelete="RESTRICT",
                name="fk_advances_issued_by",
            ),
            nullable=True,
        ),
    )
    issued_at: datetime = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=True,
        ),
    )
    status: AdvanceStatus = Field(
        default=AdvanceStatus.PENDING,
        sa_column=Column(
            Enum(AdvanceStatus),
            nullable=False,
        ),
    )
    created_at: datetime = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        ),
    )
    updated_at: datetime = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        ),
    )
