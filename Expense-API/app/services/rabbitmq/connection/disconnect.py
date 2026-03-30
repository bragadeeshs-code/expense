"""Disconnect RabbitMQ connection consumer."""

from app.config.logger import get_logger
from app.schemas.configuration import RabbitMQConnectionUpdateDelete
from app.services.connection import disconnect_connection
from app.services.rabbitmq.consumer import AsyncRabbitMQConsumer

logger = get_logger(__name__)


QUEUE_NAME = "expense_connection_disconnected"


def update_connection(payload: dict):
    """Handle connection disconnect event from RabbitMQ."""
    logger.info(f"Handling connection_disconnected event: {payload}")
    conn_dict = payload.get("connection")
    if not conn_dict:
        logger.error("No 'connection' key in payload")
        return

    try:
        conn_obj = RabbitMQConnectionUpdateDelete(**conn_dict)
    except Exception as e:
        logger.error(f"Invalid connection payload: {e}")
        return
    disconnect_connection(conn_obj)


class ConnectionDisconnectConsumer:
    """Consumer for processing connection disconnect events from RabbitMQ."""

    def __init__(self):
        """Initialize the RabbitMQ disconnect connection consumer."""
        self.consumer = AsyncRabbitMQConsumer({QUEUE_NAME: update_connection})

    async def startup(self):
        """Start the RabbitMQ consumer."""
        await self.consumer.start()

    async def shutdown(self):
        """Stop the RabbitMQ consumer."""
        await self.consumer.stop()


connection_disconnect_consumer = ConnectionDisconnectConsumer()
