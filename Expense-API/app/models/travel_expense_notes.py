"""Model for Travel Expense Notes."""

from datetime import datetime

from sqlalchemy import func
from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Integer,
    Relationship,
    SQLModel,
    String,
)

from app.models.travel_expense import TravelExpense
from app.models.user import User


class TravelExpenseNotes(SQLModel, table=True):
    """Represents notes associated with a travel expense."""

    __tablename__ = "travel_expense_notes"
    id: int | None = Field(sa_column=Column(Integer, default=None, primary_key=True))
    notes: str | None = Field(sa_column=Column(String, nullable=True))
    file_name: str | None = Field(sa_column=Column(String, nullable=True))
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    expense_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "travel_expenses.id",
                name="fk_travel_expense_notes_expense_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
    )
    created_by_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id",
                name="fk_travel_expense_notes_created_by_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
    )

    creaded_by: "User" = Relationship()
    travel_expense: "TravelExpense" = Relationship()
