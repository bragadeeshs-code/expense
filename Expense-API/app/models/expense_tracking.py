"""SQLModel definition for the UserDailyExpense and UserMonthlyExpense tables."""

from datetime import date
from decimal import Decimal

from sqlalchemy import Column, Date, Numeric
from sqlmodel import Field, ForeignKey, SQLModel


class UserDailyExpense(SQLModel, table=True):
    """Represents user's daily expenses."""

    __tablename__ = "user_daily_expenses"
    user_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id",
                name="fk_user_daily_expenses_user_id",
                ondelete="CASCADE",
            ),
            primary_key=True,
        )
    )
    day: date = Field(sa_column=Column(Date, primary_key=True))
    daily_spent: Decimal = Field(default=0, sa_column=Column(Numeric(18, 2)))


class UserMonthlyExpense(SQLModel, table=True):
    """Represents user's monthly expenses."""

    __tablename__ = "user_monthly_expenses"
    user_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id",
                name="fk_user_monthly_expenses_user_id",
                ondelete="CASCADE",
            ),
            primary_key=True,
        )
    )
    month: date = Field(sa_column=Column(Date, primary_key=True))
    monthly_spent: Decimal = Field(default=0, sa_column=Column(Numeric(18, 2)))
