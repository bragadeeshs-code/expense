"""Entry point for the FastAPI Expense Management service."""

import asyncio
from contextlib import asynccontextmanager
from typing import cast

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import ExceptionHandler

from app.config.config import settings
from app.config.kafka import kafka_manager
from app.config.logger import get_logger
from app.config.minio import ensure_bucket_exists
from app.exceptions.handlers import global_exception_handler, handle_validation_error
from app.routers.main import router
from app.services.kafka.extraction_consumer import consume_extraction_results
from app.services.startup import start_rabbitmq_services, stop_rabbitmq_services

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    kafka_expense_extraction_consumer_task = None

    if settings.DISABLE_EXTERNAL_SERVICES:
        logger.info("Skipping external service startup for local development")
    else:
        await ensure_bucket_exists()
        logger.info("Starting Kafka producer service")
        await kafka_manager.startup()
        app.state.producer = kafka_manager.producer

        await start_rabbitmq_services()

        logger.info("Starting Kafka documents processing consumer")
        kafka_expense_extraction_consumer_task = asyncio.create_task(
            consume_extraction_results()
        )

    yield

    if settings.DISABLE_EXTERNAL_SERVICES:
        return

    await stop_rabbitmq_services()

    logger.info("Shutting down Kafka producer service")
    if kafka_expense_extraction_consumer_task:
        kafka_expense_extraction_consumer_task.cancel()

        try:
            await kafka_expense_extraction_consumer_task
        except asyncio.CancelledError:
            logger.info("Kafka expense extraction consumer task cancelled")


expense_management_app = FastAPI(
    title="Expense Management API",
    version="0.0.1",
    description="API for Expense Management",
    terms_of_service="https://www.yavar.ai/terms-and-conditions",
    servers=[
        {
            "url": "http://localhost:8000/expense",
            "description": "Local environment",
        },
        {
            "url": "https://api.z-transact.yavar.ai/expense",
            "description": "Production environment",
        },
    ],
    root_path="/expense",
    root_path_in_servers=False,
    lifespan=lifespan,
)

expense_management_app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS,
    allow_methods=["OPTIONS", "GET", "POST", "DELETE", "PATCH", "PUT"],
    allow_credentials=True,
)

expense_management_app.add_exception_handler(Exception, global_exception_handler)

expense_management_app.add_exception_handler(
    RequestValidationError,
    cast(ExceptionHandler, handle_validation_error),
)


@expense_management_app.get("/", include_in_schema=False)
@expense_management_app.get("/expense", include_in_schema=False)
@expense_management_app.get("/expense/", include_in_schema=False)
def service_index() -> dict[str, object]:
    """Return a small index payload for local development."""
    return {
        "service": "expense-api",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "api_prefixes": ["/v1", "/expense/v1"],
    }


expense_management_app.include_router(router)
expense_management_app.include_router(router, prefix="/expense", include_in_schema=False)
