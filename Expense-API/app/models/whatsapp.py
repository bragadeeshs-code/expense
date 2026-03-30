"""WhatsApp model for storing WhatsApp connection data."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.connection import Connection


class WhatsappConfiguration(SQLModel, table=True):
    """WhatsApp configuration model representing WhatsApp connection data in the database."""

    __tablename__ = "whatsapp_configurations"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    phone_number_id: str = Field(max_length=255)
    phone_number: str = Field(sa_column=Column(String, nullable=False))
    access_token: str = Field(max_length=500)
    verification_token: str = Field(max_length=500)
    connection_id: int = Field(
        sa_column=Column(
            Integer, ForeignKey("connections.id", ondelete="CASCADE"), nullable=False
        )
    )
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
    connection: Optional["Connection"] = Relationship(
        back_populates="whatsapp_configuration"
    )
