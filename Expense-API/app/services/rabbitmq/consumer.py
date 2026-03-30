"""Asynchronous RabbitMQ consumer implementation."""

import asyncio
import json

from aio_pika import ExchangeType, IncomingMessage, connect_robust

from app.config.config import settings
from app.config.logger import get_logger

logger = get_logger(__name__)

EXCHANGE_NAME = "user_events_auth"


class AsyncRabbitMQConsumer:
    """Asynchronous RabbitMQ consumer for handling messages from queues."""

    def __init__(self, queue_handlers: dict):
        """Initialize the RabbitMQ consumer."""
        self.amqp_url = settings.AMQP_URL
        self.queue_handlers = queue_handlers
        self.connection = None
        self.should_stop = False
        self.consumer_task = None

    async def _on_message(self, message: IncomingMessage, handler):
        """Process an incoming message using the provided handler."""
        async with message.process():
            try:
                payload = json.loads(message.body)
                logger.info(f"Received message from {message.routing_key}: {payload}")
                if asyncio.iscoroutinefunction(handler):
                    await handler(payload)
                else:
                    loop = asyncio.get_running_loop()
                    await loop.run_in_executor(None, handler, payload)
                logger.info(f"Processed message on {message.routing_key}")
            except Exception:
                logger.exception(f"Error processing message from {message.routing_key}")
                raise

    async def start_consuming(self):
        """Start consuming messages from the configured queues."""
        self.connection = await connect_robust(self.amqp_url)
        channel = await self.connection.channel()
        await channel.set_qos(prefetch_count=1)

        exchange = await channel.declare_exchange(
            EXCHANGE_NAME, type=ExchangeType.FANOUT, durable=True
        )

        for queue_name, handler in self.queue_handlers.items():
            queue = await channel.declare_queue(queue_name, durable=True)
            await queue.bind(exchange)
            logger.info(f"Bound queue {queue_name} to exchange {EXCHANGE_NAME}")
            await queue.consume(lambda msg, h=handler: self._on_message(msg, h))
            logger.info(f"Subscribed to queue: {queue_name}")
        while not self.should_stop:
            await asyncio.sleep(1)

    async def start(self):
        """Start the consumer by initiating the consuming task."""
        self.consumer_task = asyncio.create_task(self.start_consuming())

    async def stop(self):
        """Stop the consumer by signaling to stop and closing the connection."""
        self.should_stop = True
        if self.consumer_task:
            self.consumer_task.cancel()
            try:
                await self.consumer_task
            except asyncio.CancelledError:
                logger.info("Consumer task cancelled")
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            logger.info("Connection closed")
