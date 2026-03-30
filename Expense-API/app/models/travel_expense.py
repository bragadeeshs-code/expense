"""Travel Expense model definition."""

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import (
    JSON,
    Column,
    Date,
    DateTime,
    Enum,
    Field,
    ForeignKey,
    Integer,
    Numeric,
    Relationship,
    SQLModel,
    String,
    func,
)

from app.schemas.travel_expense import TravelExpenseStatus, Vehicles, VehicleTypes

if TYPE_CHECKING:
    from project import Project
    from user import User


class TravelExpense(SQLModel, table=True):
    """Represents a travel expense record."""

    __tablename__ = "travel_expenses"
    id: int | None = Field(sa_column=Column(Integer, default=None, primary_key=True))
    from_location: dict = Field(sa_column=Column(JSON, nullable=False))
    to_location: dict = Field(sa_column=Column(JSON, nullable=False))
    from_date: date = Field(sa_column=Column(Date, nullable=False))
    to_date: date = Field(sa_column=Column(Date, nullable=False))
    vehicle: Vehicles = Field(sa_column=Column(Enum(Vehicles), nullable=False))
    vehicle_type: VehicleTypes = Field(
        sa_column=Column(Enum(VehicleTypes), nullable=False)
    )
    status: TravelExpenseStatus = Field(
        sa_column=Column(
            Enum(TravelExpenseStatus),
            nullable=False,
            default=TravelExpenseStatus.DRAFTED,
        )
    )
    amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))
    distance: Decimal = Field(sa_column=Column(Numeric(8, 2), nullable=False))
    customer_name: str = Field(sa_column=Column(String, nullable=False))
    duration_seconds: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))
    reject_reason: str | None = Field(sa_column=Column(String, nullable=True))
    carbon_emission: Decimal = Field(sa_column=Column(Numeric(10, 3), nullable=False))
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
    project_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "projects.id", name="fk_travel_expenses_project_id", ondelete="RESTRICT"
            ),
            nullable=False,
        )
    )
    created_by_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id", name="fk_travel_expenses_created_by_id", ondelete="RESTRICT"
            ),
            nullable=False,
        )
    )
    created_by: "User" = Relationship()
    project: "Project" = Relationship()
