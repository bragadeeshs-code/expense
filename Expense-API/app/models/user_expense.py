"""UserExpense association model definition."""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

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
from sqlmodel import Enum as SQLEnum

from app.schemas.user_expense import ExpenseStatus

if TYPE_CHECKING:
    from expense import Expense
    from project import Project
    from trip import Trip
    from user import User
    from user_expense_approval import UserExpenseApproval


class UserExpense(SQLModel, table=True):
    """Association between users and expenses, with per-user status and amount."""

    __tablename__ = "user_expenses"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    user_id: int = Field(
        sa_column=Column(
            ForeignKey("users.id", name="fk_user_expenses_user_id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    expense_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "expenses.id", name="fk_user_expenses_expense_id", ondelete="CASCADE"
            ),
            nullable=False,
        )
    )

    project_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "projects.id",
                name="fk_user_expenses_project_id",
                ondelete="RESTRICT",
            ),
            nullable=True,
        )
    )

    trip_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "trips.id",
                name="fk_user_expenses_trip_id",
                ondelete="RESTRICT",
            ),
            nullable=True,
        )
    )

    status: ExpenseStatus = Field(
        sa_column=Column(SQLEnum(ExpenseStatus), nullable=False, index=True)
    )

    amount: Optional[Decimal] = Field(
        default=None, sa_column=Column(Numeric(precision=12, scale=2))
    )

    submitted_at: Optional[datetime] = Field(
        default=None, sa_column=Column(DateTime(timezone=True), nullable=True)
    )

    highest_approved_level: Optional[int] = Field(default=None, nullable=True)

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

    user: Optional["User"] = Relationship(back_populates="user_expenses")
    expense: Optional["Expense"] = Relationship(back_populates="user_expenses")
    approvals: List["UserExpenseApproval"] = Relationship(
        back_populates="user_expense",
        passive_deletes="all",
    )

    project: Optional["Project"] = Relationship(back_populates="user_expenses")
    trip: Optional["Trip"] = Relationship()
