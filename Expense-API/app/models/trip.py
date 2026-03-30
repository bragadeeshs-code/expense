"""Trip database model."""

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, func
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, Relationship, SQLModel, String

from app.models.user import User
from app.schemas.trip import TravelMode, TripStatus

if TYPE_CHECKING:
    from .project import Project


class Trip(SQLModel, table=True):
    """Represents a trip taken by an employee."""

    __tablename__ = "trips"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    project_id: int = Field(
        sa_column=Column(
            ForeignKey("projects.id", ondelete="RESTRICT", name="fk_trips_project_id"),
            nullable=False,
        )
    )

    destination: str

    description: Optional[str] = Field(
        default=None, sa_column=Column(String, nullable=True)
    )

    start_date: date
    end_date: date

    hotel_accommodation_needed: bool

    mode_of_travel: TravelMode = Field(
        sa_column=Column(SAEnum(TravelMode), nullable=False)
    )

    vehicle_needed: bool

    advance_needed: bool

    advance_amount: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2)),
    )

    status: TripStatus = Field(
        default=TripStatus.SUBMITTED,
        sa_column=Column(
            Enum(TripStatus),
            nullable=False,
        ),
    )

    created_by: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id",
                ondelete="RESTRICT",
                name="fk_trips_created_by",
            ),
            nullable=False,
        )
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

    project: Optional["Project"] = Relationship()

    user: Optional["User"] = Relationship()
