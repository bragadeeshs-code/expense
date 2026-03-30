"""Notification model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, func
from sqlmodel import JSON, Field, SQLModel, Text
from sqlmodel import Enum as SQLEnum

from app.schemas.notification import NotificationType

if TYPE_CHECKING:
    pass


class Notification(SQLModel, table=True):
    """Represents a user notification."""

    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    user_id: int = Field(
        sa_column=Column(
            ForeignKey("users.id", name="fk_notifications_user_id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )
    )

    message: str = Field(sa_column=Column(Text, nullable=False))
    type: NotificationType = Field(
        sa_column=Column(SQLEnum(NotificationType), nullable=False)
    )
    is_read: bool = Field(sa_column=Column(Boolean, default=False, nullable=False))

    meta_data: dict = Field(sa_column=Column(JSON, nullable=False))

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
