"""Kafka related schemas."""

from enum import Enum


class KafkaTopics(str, Enum):
    """Kafka topics."""

    expenses_to_extract = "expenses_to_extract"
    expenses_extracted = "expenses_extracted"
