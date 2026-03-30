"""Model for ExtractedExpense representing processed expense data."""

from datetime import datetime
from typing import TYPE_CHECKING, Any, Optional

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import (
    Column,
    DateTime,
    Field,
    Float,
    ForeignKey,
    Relationship,
    SQLModel,
    Text,
    func,
)

if TYPE_CHECKING:
    from expense import Expense


class ExtractedExpense(SQLModel, table=True):
    """Represents extracted expense data."""

    __tablename__ = "extracted_expenses"

    id: Optional[int] = Field(default=None, primary_key=True)

    expense_id: int = Field(
        sa_column=Column(ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False)
    )

    processed_data: dict[str, Any] = Field(sa_column=Column(JSONB, nullable=False))
    processed_data_updated: dict[str, Any] = Field(
        sa_column=Column(JSONB, nullable=False)
    )

    overall_document_confidence: float = Field(sa_column=Column(Float, nullable=False))

    verifiability_message: str = Field(sa_column=Column(Text, nullable=False))

    note: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))

    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
        )
    )

    expense: Optional["Expense"] = Relationship(back_populates="extracted_expense")
