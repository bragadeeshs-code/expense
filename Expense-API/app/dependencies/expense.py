"""Dependency providers for financer."""

from datetime import datetime

from fastapi import Query

from app.schemas.expense import (
    CategoryType,
    FinancerExpenseFilters,
    FinancerExpenseSortColumn,
    FinancerSortParams,
    TeamExpenseStatus,
)
from app.schemas.shared import SortDirection


def get_financer_expense_filters(
    search: str | None = Query(None),
    employee_ids: list[int] | None = Query(None),
    category: list[CategoryType] | None = Query(None),
    submitted_at: datetime | None = Query(None),
    status: list[TeamExpenseStatus] | None = Query(None),
) -> FinancerExpenseFilters:
    """Parse query parameters into FinancerExpenseFilters schema."""
    return FinancerExpenseFilters(
        search=search,
        employee_ids=employee_ids,
        category=category,
        submitted_at=submitted_at,
        status=status,
    )


def get_financer_expense_sorting(
    sort_by: list[FinancerExpenseSortColumn] = Query(
        [FinancerExpenseSortColumn.SUBMITTED_AT]
    ),
    sort_dir: list[SortDirection] = Query([SortDirection.DESC]),
) -> FinancerSortParams:
    """Parse query parameters into FinancerSortParams schema."""
    return FinancerSortParams(sort_by=sort_by, sort_dir=sort_dir)
