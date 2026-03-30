"""Expense model definition."""

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum
from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Numeric,
    Relationship,
    SQLModel,
    func,
)

from app.schemas.expense import CategoryType, SubcategoryType
from app.schemas.grade import AccommodationType, FlightClassEnum, TrainClassEnum

if TYPE_CHECKING:
    from extracted_expense import ExtractedExpense
    from organization import Organization
    from user_expense import UserExpense


class Expense(SQLModel, table=True):
    """Represents an expense record."""

    __tablename__ = "expenses"
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id",
                name="fk_expenses_organization_id",
                ondelete="CASCADE",
            ),
            nullable=False,
        )
    )

    connection_id: Optional[int] = Field(
        default=None,
        sa_column=Column(
            ForeignKey(
                "connections.id",
                name="fk_expenses_connection_id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
    )

    name: str = Field(index=True)
    format: Optional[str] = Field(default=None)
    vendor_name: Optional[str] = Field(default=None)
    category: Optional[CategoryType] = Field(default=None)
    sub_category: Optional[SubcategoryType] = Field(default=None)
    total_amount: Optional[Decimal] = Field(
        default=None, sa_column=Column(Numeric(precision=12, scale=2))
    )
    currency: Optional[str] = Field(default=None)
    bill_date: Optional[date] = Field(default=None)
    document_no: Optional[str] = Field(default=None)
    scope: Optional[str] = Field(default=None)
    train_class: Optional[TrainClassEnum] = Field(
        sa_column=Column(
            Enum(TrainClassEnum),
            nullable=True,
        )
    )
    flight_class: Optional[FlightClassEnum] = Field(
        sa_column=Column(
            Enum(FlightClassEnum),
            nullable=True,
        )
    )
    accommodation_type: Optional[AccommodationType] = Field(
        sa_column=Column(
            Enum(AccommodationType),
            nullable=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
        )
    )
    created_by: int = Field(
        sa_column=Column(
            ForeignKey("users.id", name="fk_expenses_created_by", ondelete="CASCADE"),
            nullable=False,
        )
    )
    organization: Optional["Organization"] = Relationship(back_populates="expenses")

    user_expenses: list["UserExpense"] = Relationship(
        back_populates="expense",
        passive_deletes="all",
    )

    extracted_expense: Optional["ExtractedExpense"] = Relationship(
        back_populates="expense",
        sa_relationship_kwargs={"uselist": False, "cascade": "all, delete-orphan"},
    )
