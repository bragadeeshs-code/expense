"""Provide logger configuration for the Expense Management API."""

import logging
from logging import StreamHandler


def get_logger(name="expense-management"):
    """Return a logger instance with the specified name.

    Args:
    ----
        name (str): The name of the logger. Defaults to "expense-management".

    Returns:
    -------
        logging.Logger: A logger instance configured with the specified name.

    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Add a handler only if it doesn't already exist
    if not logger.handlers:
        handler = StreamHandler()
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s - %(name)s - %(message)s",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger
