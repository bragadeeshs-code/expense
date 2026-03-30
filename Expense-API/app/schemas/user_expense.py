"""User expense related schemas."""

from enum import Enum


class ExpenseStatus(str, Enum):
    """Status of the user-specific expense processing."""

    UPLOADED = "Uploaded"
    EXTRACTING = "Extracting"
    EXTRACTED = "Extracted"
    SPLITTING = "Splitting"
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class SplitAction(str, Enum):
    """Split action enumeration."""

    APPROVE = "approve"
    REJECT = "reject"
