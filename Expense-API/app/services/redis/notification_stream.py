"""Redis-backed real-time notification stream."""

import asyncio

from .client import redis_client


async def redis_event_stream(user_id: int):
    """Stream real-time notifications for a specific user using Redis Pub/Sub."""
    channel = f"notifications-{user_id}"
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(channel)
    try:
        while True:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=5
            )
            if message and message["type"] == "message":
                data = message["data"]
                yield f"data: {data}\n\n"
            await asyncio.sleep(0.01)
    except asyncio.CancelledError:
        pass
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.close()
