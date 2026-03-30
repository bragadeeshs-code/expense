"""Handles RabbitMQ user event publishing."""

from app.config.logger import get_logger
from app.schemas.user import UserActions
from app.services.rabbitmq.client import AsyncRabbitMQClient

logger = get_logger(__name__)

QUEUE_NAME = "user_events"


class UserEventProducer:
    """Producer for publishing user events to RabbitMQ."""

    def __init__(self):
        """Initialize the UserEventProducer."""
        self.client = AsyncRabbitMQClient()

    async def startup(self):
        """Startup the producer by connecting and declaring the queue."""
        await self.client.connect()
        await self.client.declare_queue(QUEUE_NAME)

    async def publish_event(self, payload: dict, action: UserActions):
        """Publish a user event to the RabbitMQ queue."""
        logger.info(f"Publishing User {action.value}: {payload}")
        await self.client.publish(
            QUEUE_NAME,
            {
                **payload,
                "action": action.value,
            },
        )

    async def shutdown(self):
        """Shutdown the producer by closing the connection."""
        await self.client.close()


user_event_producer = UserEventProducer()
