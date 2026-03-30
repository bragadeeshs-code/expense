"""Kafka configuration and management utilities."""

import asyncio

from aiokafka import AIOKafkaProducer
from aiokafka.admin import AIOKafkaAdminClient, NewPartitions, NewTopic
from fastapi import Request

from app.config.config import settings
from app.config.logger import get_logger

logger = get_logger(__name__)

TOPICS_CONFIG = {
    "expenses_to_extract": settings.TOTAL_KAFKA_PARTITIONS,
    "expenses_extracted": 1,
}


def get_kafka_producer(request: Request) -> AIOKafkaProducer:
    """Retrieve the shared Kafka producer instance from the FastAPI application state."""
    return request.app.state.producer


class KafkaManager:
    """Manages Kafka producer lifecycle and topic configuration."""

    def __init__(
        self,
        bootstrap_servers: str = settings.KAFKA_BOOTSTRAP_SERVERS,
        max_retries: int = 5,
        retry_delay: int = 5,
    ):
        """Initialize a KafkaManager instance."""
        self.bootstrap_servers = bootstrap_servers
        self._producer: AIOKafkaProducer | None = None
        self.max_retries = max_retries
        self.retry_delay = retry_delay

    async def startup(self):
        """Start the Kafka producer and ensure required topics exist."""
        await self._create_topics()
        if self._producer:
            return
        logger.info("Starting Kafka producer...")
        self._producer = AIOKafkaProducer(bootstrap_servers=self.bootstrap_servers)
        for attempt in range(1, self.max_retries + 1):
            try:
                await self._producer.start()
                logger.info("Kafka producer started successfully")
                return
            except Exception as e:
                logger.warning(f"Kafka connection failed (attempt {attempt}): {e}")
                if attempt == self.max_retries:
                    logger.error("Kafka producer failed after max retries")
                    raise
                await asyncio.sleep(self.retry_delay * attempt)

    async def _create_topics(self):
        """Create or update Kafka topics and partitions as per `TOPICS_CONFIG`."""
        admin = AIOKafkaAdminClient(bootstrap_servers=self.bootstrap_servers)
        try:
            await admin.start()
            existing_topics = await admin.list_topics()
            topic_metadata = await admin.describe_topics(list(existing_topics))

            existing_partitions = {
                t["topic"]: len(t["partitions"]) for t in topic_metadata
            }

            new_topics = [
                NewTopic(name=t, num_partitions=p, replication_factor=1)
                for t, p in TOPICS_CONFIG.items()
                if t not in existing_partitions
            ]
            if new_topics:
                await admin.create_topics(new_topics)
                logger.info(f"Created Kafka topics: {[t.name for t in new_topics]}")

            topics_to_increase = {
                t: NewPartitions(total_count=p)
                for t, p in TOPICS_CONFIG.items()
                if t in existing_partitions and p > existing_partitions[t]
            }

            if topics_to_increase:
                await admin.create_partitions(topic_partitions=topics_to_increase)
                logger.info(
                    "Increased partitions for topics: "
                    + ", ".join(
                        f"{t}: {existing_partitions[t]} → {TOPICS_CONFIG[t]}"
                        for t in topics_to_increase
                    )
                )

            if not new_topics and not topics_to_increase:
                logger.info("All Kafka topics already up to date")

        except Exception as e:
            logger.error(f"Failed to create/update Kafka topics: {e}")
        finally:
            await admin.close()

    async def shutdown(self):
        """Stop the Kafka producer gracefully."""
        if self._producer:
            logger.info("Stopping Kafka producer...")
            await self._producer.stop()
            self._producer = None
            logger.info("Kafka producer stopped")

    @property
    def producer(self) -> AIOKafkaProducer:
        """Return the active Kafka producer instance."""
        if not self._producer:
            raise RuntimeError("Kafka producer not started yet")
        return self._producer


kafka_manager = KafkaManager()


async def start_consumer_with_retry(consumer, max_retries=5, retry_delay=5):
    """Start a Kafka consumer with retry logic."""
    for attempt in range(1, max_retries + 1):
        try:
            await consumer.start()
            return
        except Exception as e:
            logger.warning(f"Kafka consumer failed (attempt {attempt}): {e}")
            if attempt == max_retries:
                raise
            await asyncio.sleep(retry_delay * attempt)
