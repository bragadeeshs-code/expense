"""Connection schemas for API request/response models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ProviderType(str, Enum):
    """Enum for provider types."""

    WHATSAPP = "whatsapp"
    WEBHOOK = "webhook"


class SourceType(str, Enum):
    """Enum for source types."""

    INPUT = "input"
    OUTPUT = "output"


class ConnectionStatus(str, Enum):
    """Enum for connection status."""

    CONNECTED = "connected"
    DISCONNECTED = "disconnected"


class ConnectionCreate(BaseModel):
    """Schema for validating connection creation data."""

    id: int
    organization_id: int
    provider_type: ProviderType
    source_type: SourceType
    status: ConnectionStatus
    phone_number_id: str
    phone_number: str
    whatsapp_token: str
    whatsapp_verification_token: str


class WhatsAppConfigResponse(BaseModel):
    """Response schema for WhatsApp configuration data."""

    phone_number_id: str
    phone_number: str
    verification_token: str

    class Config:
        """Configuration for WhatsAppConfigResponse schema."""

        from_attributes = True


class ConnectionListItem(BaseModel):
    """Response schema for connection list items with nested configuration."""

    id: int
    organization_id: int
    provider_type: ProviderType
    source_type: SourceType
    status: ConnectionStatus
    created_at: datetime
    updated_at: datetime
    webhook_url: Optional[str] = Field(default=None, validation_alias="url")
    whatsapp_configuration: Optional[WhatsAppConfigResponse] = None

    class Config:
        """Configuration for ConnectionListItem schema."""

        from_attributes = True


class PaginatedConnectionResponse(BaseModel):
    """Paginated response model for connections."""

    total: int
    page: int
    per_page: int
    items: List[ConnectionListItem]


class WebhookConnection(BaseModel):
    """Schema for webhook connection data."""

    id: int
    url: str
    organization_id: int
    provider_type: str
    source_type: str
    status: ConnectionStatus

    class Config:
        """Configuration for WebhookConnection schema."""

        from_attributes = True
