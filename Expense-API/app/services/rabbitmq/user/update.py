"""Handles RabbitMQ user update events."""

from app.config.logger import get_logger
from app.schemas.user import UserRabbitMQUpdateRequest
from app.services.rabbitmq.consumer import AsyncRabbitMQConsumer
from app.services.user import update_user_fields

logger = get_logger(__name__)

QUEUE_NAME = "expense_api_user_events"


def update_user(payload: dict):
    """Handle user update events from RabbitMQ."""
    logger.info(f"Handling update_user event: {payload}")
    user_dict = payload.get("user")
    if user_dict:
        user_obj = UserRabbitMQUpdateRequest(**user_dict)
        fields_to_update = user_obj.model_dump(exclude_unset=True)
        update_user_fields(user_email=user_obj.email, fields_to_update=fields_to_update)
        return


class UserUpdateConsumer:
    """Consumer for processing user update events from RabbitMQ."""

    def __init__(self):
        """Initialize the UserUpdateConsumer."""
        self.consumer = AsyncRabbitMQConsumer({QUEUE_NAME: update_user})

    async def startup(self):
        """Startup the consumer by connecting and starting consumption."""
        await self.consumer.start()

    async def shutdown(self):
        """Shutdown the consumer by stopping consumption and closing connection."""
        await self.consumer.stop()


user_update_consumer = UserUpdateConsumer()
