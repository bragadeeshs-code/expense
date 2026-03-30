"""Async RabbitMQ client for publishing and declaring queues."""

import json

from aio_pika import DeliveryMode, Message, connect_robust

from app.config.config import settings
from app.config.logger import get_logger

logger = get_logger(__name__)


class AsyncRabbitMQClient:
    """Handles asynchronous RabbitMQ connections and operations."""

    def __init__(self):
        """Initialize the RabbitMQ client."""
        self.amqp_url = settings.AMQP_URL
        self.connection = None
        self.channel = None
        self.queues = set()

    async def connect(self):
        """Establish a connection to RabbitMQ."""
        if self.connection and not self.connection.is_closed:
            return
        logger.info(f"Connecting to RabbitMQ at {self.amqp_url}")
        self.connection = await connect_robust(self.amqp_url)
        self.channel = await self.connection.channel(publisher_confirms=True)

    async def declare_queue(self, queue_name: str):
        """Declare a queue in RabbitMQ."""
        await self.connect()
        await self.channel.declare_queue(queue_name, durable=True)
        self.queues.add(queue_name)
        logger.info(f"Declared queue: {queue_name}")

    async def publish(self, queue_name: str, message: dict):
        """Publish a message to a specified queue."""
        if queue_name not in self.queues:
            raise ValueError(f"Queue '{queue_name}' not declared.")
        try:
            await self.connect()
            msg = Message(
                body=json.dumps(message).encode(),
                delivery_mode=DeliveryMode.PERSISTENT,
            )
            await self.channel.default_exchange.publish(msg, routing_key=queue_name)
            logger.info(f"Published message to '{queue_name}': {message}")
        except Exception as e:
            logger.exception(
                f"[Producer] Failed to publish message to '{queue_name}': {e}"
            )
            raise

    async def close(self):
        """Close the RabbitMQ connection."""
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            logger.info("Connection closed")
