"""Connection model for storing connection data."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlmodel import Enum as SQLEnum
from sqlmodel import Field, Relationship, SQLModel

from app.schemas.connection import ConnectionStatus, ProviderType, SourceType

if TYPE_CHECKING:
    from app.models.whatsapp import WhatsappConfiguration


class Connection(SQLModel, table=True):
    """Connection model representing a connection in the database."""

    __tablename__ = "connections"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    organization_id: int = Field(
        sa_column=Column(
            Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
        )
    )
    provider_type: ProviderType = Field(
        sa_column=Column(SQLEnum(ProviderType), nullable=False)
    )
    source_type: SourceType = Field(
        sa_column=Column(SQLEnum(SourceType), nullable=False)
    )
    status: ConnectionStatus = Field(
        sa_column=Column(SQLEnum(ConnectionStatus), nullable=False)
    )

    url: Optional[str] = Field(
        default=None,
        sa_column=Column(String, nullable=True),
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
    whatsapp_configuration: Optional["WhatsappConfiguration"] = Relationship(
        back_populates="connection", cascade_delete=True
    )
