"""Shared Pydantic schemas."""

from enum import Enum

from pydantic import BaseModel


class SortDirection(str, Enum):
    """Sorting direction for results."""

    ASC = "asc"
    DESC = "desc"


class PaginatedResponse(BaseModel):
    """Base schema for paginated responses."""

    total: int
    page: int
    per_page: int
    has_next_page: bool
