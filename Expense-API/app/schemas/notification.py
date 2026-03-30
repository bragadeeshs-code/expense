"""Notification related schemas."""

from datetime import datetime
from enum import Enum
from typing import List

from pydantic import BaseModel

from app.schemas.shared import PaginatedResponse


class NotificationResponse(BaseModel):
    """Notitication Response."""

    id: int
    message: str
    type: str
    is_read: bool
    meta_data: dict
    created_at: datetime

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class NotificationsResponse(PaginatedResponse):
    """Paginated response model for notifications."""

    notifications: List[NotificationResponse]


class NotificationType(str, Enum):
    """Type of the Notification."""

    INFO = "Info"
    SPLIT_ACTION = "split_action"
    SUBMIT_FOR_APPROVAL = "submit_for_approval"


class MarkAllResponse(BaseModel):
    """Number of messages read."""

    total_read: int
