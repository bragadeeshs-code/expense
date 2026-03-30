"""Handles RabbitMQ connection creation events."""

from app.config.logger import get_logger
from app.schemas.connection import ConnectionCreate, WebhookConnection
from app.services.connection import (
    upsert_webhook_connection,
    upsert_whatsapp_connection,
)
from app.services.rabbitmq.consumer import AsyncRabbitMQConsumer

logger = get_logger(__name__)

QUEUE_NAME = "expense_connection_created"


def handle_connection_created(payload: dict):
    """Handle connection creation event from RabbitMQ."""
    whatsapp_connection = payload.get("whatsapp_connection")
    if whatsapp_connection:
        connection_payload = ConnectionCreate.model_validate(whatsapp_connection)
        upsert_whatsapp_connection(connection_payload)
        return

    webhook_connection = payload.get("webhook_connection")
    if webhook_connection:
        webhook_payload = WebhookConnection.model_validate(webhook_connection)
        upsert_webhook_connection(webhook_payload)
        return

    logger.error("No valid connection data found in payload")


class ConnectionCreateConsumer:
    """Consumer for processing connection creation events from RabbitMQ."""

    def __init__(self):
        """Initialize the ConnectionCreateConsumer."""
        self.consumer = AsyncRabbitMQConsumer({QUEUE_NAME: handle_connection_created})

    async def startup(self):
        """Startup the consumer by connecting and starting consumption."""
        await self.consumer.start()

    async def shutdown(self):
        """Shutdown the consumer by stopping consumption and closing connection."""
        await self.consumer.stop()


connection_create_consumer = ConnectionCreateConsumer()
