"""User expense approval model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Integer,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)
from sqlmodel import Enum as SQLEnum

from app.schemas.user_expense_approval import ApprovalStatus

if TYPE_CHECKING:
    from user import User
    from user_expense import UserExpense


class UserExpenseApproval(SQLModel, table=True):
    """Represents an approval or rejection done by a user on a user expense."""

    __tablename__ = "user_expense_approvals"

    __table_args__ = (
        UniqueConstraint(
            "user_expense_id",
            "approver_id",
            "approval_level",
            name="unique_user_expense_approver_level",
        ),
    )

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    user_expense_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "user_expenses.id",
                name="fk_user_expense_approvals_user_expense_id",
                ondelete="CASCADE",
            ),
            nullable=False,
        )
    )

    approver_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id",
                name="fk_user_expense_approvals_approver_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
    )

    approval_level: int = Field(sa_column=Column(Integer, nullable=False))

    status: ApprovalStatus = Field(
        sa_column=Column(
            SQLEnum(ApprovalStatus),
            nullable=False,
        ),
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

    user_expense: Optional["UserExpense"] = Relationship(back_populates="approvals")

    approver: Optional["User"] = Relationship()
