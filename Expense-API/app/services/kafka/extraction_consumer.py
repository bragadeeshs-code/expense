"""Kafka consumer for expense extraction results."""

import json

from aiokafka import AIOKafkaConsumer

from app.config.config import settings
from app.config.database import get_thread_session
from app.config.kafka import start_consumer_with_retry
from app.config.logger import get_logger
from app.schemas.expense import ExtractionServiceResponse
from app.schemas.kafka import KafkaTopics
from app.services.expense import update_extracted_expense

logger = get_logger(__name__)


async def consume_extraction_results():
    """Consume extraction results from Kafka and update expenses accordingly."""
    consumer = AIOKafkaConsumer(
        KafkaTopics.expenses_extracted.value,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id="extraction-result-consumer",
        auto_offset_reset="earliest",
        enable_auto_commit=True,
    )
    await start_consumer_with_retry(consumer)
    try:
        async for msg in consumer:
            try:
                body = json.loads(msg.value.decode("utf-8"))
                result = ExtractionServiceResponse(**body)
                with get_thread_session() as db_session:
                    update_extracted_expense(result, db_session)
            except Exception as e:
                logger.error(f"Failed to process document extraction result: {e}")
                logger.debug(f"Message content: {msg.value}")
    finally:
        await consumer.stop()
