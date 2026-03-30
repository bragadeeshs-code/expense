"""Service startup and shutdown management."""

from app.config.logger import get_logger
from app.services.rabbitmq.connection.create import connection_create_consumer
from app.services.rabbitmq.connection.delete import connection_delete_consumer
from app.services.rabbitmq.connection.disconnect import connection_disconnect_consumer
from app.services.rabbitmq.user.event import user_event_producer
from app.services.rabbitmq.user.update import user_update_consumer

logger = get_logger(__name__)


async def start_rabbitmq_services():
    """Start RabbitMQ producer and consumer services."""
    logger.info("Starting RabbitMQ producer and consumer services")
    await user_event_producer.startup()
    await user_update_consumer.startup()
    await connection_create_consumer.startup()
    await connection_delete_consumer.startup()
    await connection_disconnect_consumer.startup()


async def stop_rabbitmq_services():
    """Stop RabbitMQ services."""
    logger.info("Shutting down RabbitMQ services")
    await user_event_producer.shutdown()
    await user_update_consumer.shutdown()
    await connection_create_consumer.shutdown()
    await connection_delete_consumer.shutdown()
    await connection_disconnect_consumer.shutdown()
