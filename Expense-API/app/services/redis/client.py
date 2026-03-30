"""Async Redis client instance."""

import redis.asyncio as aioredis

from app.config.config import settings

redis_client = aioredis.from_url(
    f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}",
    encoding="utf-8",
    decode_responses=True,
)
