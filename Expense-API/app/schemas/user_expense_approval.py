"""Schema for user expense approval status."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class ApprovalStatus(str, Enum):
    """Enumeration for approval status."""

    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PENDING = "PENDING"
    CANCELLED = "CANCELLED"


class ExpenseApprovalAction(str, Enum):
    """Enumeration for approval status."""

    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ApproveUserExpenseRequest(BaseModel):
    """Request model for approving or rejecting a user expense."""

    status: ExpenseApprovalAction


class UserExpenseApprovalResponse(BaseModel):
    """Response model for user expense approval status."""

    id: int
    user_expense_id: int
    status: ApprovalStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic configuration."""

        form_attributes = True
