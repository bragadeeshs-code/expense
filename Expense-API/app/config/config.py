"""Configuration settings for the application.

This module defines the configuration settings for the application using
Pydantic. It includes settings such as the port number and allows for
environment variable overrides.
"""

from decimal import Decimal
from typing import Set
from urllib.parse import quote

from pydantic import AnyUrl, Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration settings for the application."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # PostgreSQL database settings
    POSTGRES_HOST: str = Field(default="expense-postgres")
    POSTGRES_PORT: int = Field(default=5435, ge=1, le=65535)
    POSTGRES_USER: str = Field(default="user")
    POSTGRES_PASSWORD: str = Field(default="password")
    POSTGRES_DB: str = Field(default="expense")

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        """Return the full PostgreSQL connection URL."""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # MinIO settings
    MINIO_URL: AnyUrl = "http://expense-minio:9000"
    MINIO_ROOT_USER: str = Field(default="minioadmin")
    MINIO_ROOT_PASSWORD: str = Field(default="minioadminpassword")
    BUCKET_NAME: str = Field(default="expenses")

    # CORS settings
    FRONTEND_URLS: Set[str] = Field(default_factory=lambda: {"http://localhost:5173"})
    SECRET_KEY: str = Field(default="change-me", min_length=5)
    DOMAIN_URL: str
    DISABLE_AUTH: bool = Field(default=False)
    DEV_AUTH_EMAIL: str | None = None
    DISABLE_EXTERNAL_SERVICES: bool = Field(default=False)

    # AUTH – RSA KEYS (RS256)
    AUTH_PUBLIC_KEY: str

    BUDGET_THRESHOLD_PERCENT: Decimal = Decimal("80")

    @computed_field
    @property
    def AUTH_PUBLIC_KEY_PEM(self) -> str:
        """Return the Auth service public key in PEM format."""
        return self.AUTH_PUBLIC_KEY.replace("\\n", "\n")

    # Docker settings
    PORT: int = Field(default=8010, ge=1, le=65535)
    MINIO_API_PORT: int = Field(default=9100, ge=1, le=65535)
    MINIO_CONSOLE_PORT: int = Field(default=9101, ge=1, le=65535)

    # SMTP settings
    SMTP_SERVER: str
    SMTP_PORT: int = Field(default=465, ge=1, le=65535)
    SMTP_USERNAME: str
    SMTP_APP_PASSWORD: str

    # RabbitMQ configuration
    RABBITMQ_HOST: str = Field(default="expense-rabbitmq")
    RABBITMQ_USER: str = Field(default="user")
    RABBITMQ_PASSWORD: str = Field(default="password")
    RABBITMQ_PORT: int = Field(default=5673, ge=1, le=65535)
    RABBITMQ_MANAGEMENT_PORT: int = Field(default=15673, ge=1, le=65535)

    @computed_field
    @property
    def AMQP_URL(self) -> str:
        """Return AMQP connection URL."""
        return (
            f"amqp://{quote(self.RABBITMQ_USER)}:"
            f"{quote(self.RABBITMQ_PASSWORD)}@"
            f"{self.RABBITMQ_HOST}:{self.RABBITMQ_PORT}/"
        )

    # Redis configuration
    REDIS_HOST: str = Field(default="expense-redis")
    REDIS_PORT: int = Field(default=6379, ge=1, le=65535)

    # Kafka configuration
    KAFKA_BOOTSTRAP_SERVERS: str

    # Total Kafka partitions
    TOTAL_KAFKA_PARTITIONS: int = Field(default=10, ge=1)


settings = Settings()
