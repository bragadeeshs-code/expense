"""Shared types."""

from typing import Annotated

from fastapi import Query
from pydantic import StringConstraints

NonEmptyStr = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

MonthParam = Annotated[
    str,
    Query(
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$",
        description="Month in YYYY-MM format",
    ),
]
