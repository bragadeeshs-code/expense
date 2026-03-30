"""Schemas related to connection configuration and messaging."""

from pydantic import BaseModel


class RabbitMQConnectionUpdateDelete(BaseModel):
    """Schemas related to connection configuration and messaging."""

    id: int
    organization_id: int
