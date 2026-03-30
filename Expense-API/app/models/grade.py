"""SQLModel definition for the Grade table."""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Numeric
from sqlmodel import (
    Column,
    DateTime,
    Enum,
    Field,
    ForeignKey,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)

from app.schemas.grade import FlightClassEnum, TrainClassEnum

if TYPE_CHECKING:
    from user import User


class Grade(SQLModel, table=True):
    """Represents a grade within an organization."""

    __tablename__ = "grades"

    __table_args__ = (
        UniqueConstraint("name", "organization_id", name="uq_grades_name_org"),
    )

    id: int = Field(default=None, primary_key=True, index=True)

    name: str = Field(nullable=False, index=True)

    daily_limit: Decimal = Field(sa_column=Column(Numeric(18, 2), nullable=False))
    monthly_limit: Decimal = Field(sa_column=Column(Numeric(18, 2), nullable=False))
    auto_approval_threshold: Decimal = Field(
        sa_column=Column(Numeric(18, 2), nullable=False)
    )

    train_class: TrainClassEnum = Field(
        sa_column=Column(
            Enum(TrainClassEnum),
            nullable=False,
        )
    )
    flight_class: FlightClassEnum = Field(
        sa_column=Column(
            Enum(FlightClassEnum),
            nullable=False,
        )
    )
    domestic_accommodation_limit: Decimal = Field(
        sa_column=Column(
            Numeric(18, 2),
            nullable=False,
        )
    )
    international_accommodation_limit: Decimal = Field(
        sa_column=Column(
            Numeric(18, 2),
            nullable=False,
        )
    )
    food_daily_limit: Decimal = Field(
        sa_column=Column(
            Numeric(18, 2),
            nullable=False,
        )
    )

    car_mileage_rate: Decimal = Field(
        sa_column=Column(
            Numeric(18, 2),
            nullable=False,
        )
    )

    bike_mileage_rate: Decimal = Field(
        sa_column=Column(
            Numeric(18, 2),
            nullable=False,
        )
    )

    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id",
                name="fk_grades_organization_id",
                ondelete="CASCADE",
            ),
            nullable=False,
        )
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
    users: list["User"] = Relationship(back_populates="grade")
