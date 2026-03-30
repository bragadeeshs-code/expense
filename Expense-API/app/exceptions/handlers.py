"""Global exception handler for the FastAPI application.

This function handles all exceptions raised in the application.
"""

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


async def global_exception_handler(_request: Request, exc: Exception):
    """Handle uncaught exceptions globally and return a standardized JSON error response."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc)},
    )


async def handle_validation_error(_request: Request, exc: RequestValidationError):
    """Handle request validation errors globally and return a standardized JSON error response."""
    errors = [
        {
            "field": (
                ".".join(map(str, err["loc"][1:]))
                if err.get("loc")
                else "non_field_error"
            ),
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "unknown_error"),
        }
        for err in exc.errors()
    ]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )
