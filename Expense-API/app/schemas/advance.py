"""Schema definitions for advance-related models and enums."""

from enum import Enum


class AdvanceStatus(str, Enum):
    """Enum representing Advance statuses."""

    PENDING = "pending"
    ISSUED = "issued"
    REJECTED = "rejected"
