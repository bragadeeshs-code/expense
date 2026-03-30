"""Utility functions for datetime."""

from calendar import monthrange
from datetime import date, datetime, timedelta, timezone

from fastapi import HTTPException, status

from app.schemas.dashboard import DateFilter


def utc_now():
    """Return the current UTC datetime with timezone awareness."""
    return datetime.now(timezone.utc)


def get_date_range(filter_key: DateFilter) -> tuple[datetime | None, datetime | None]:
    """Return (start_datetime, end_datetime) for each filter option."""
    now = utc_now()
    today_start = datetime(now.year, now.month, now.day)

    if filter_key == DateFilter.TODAY:
        return today_start, now

    if filter_key == DateFilter.THIS_WEEK:
        week_start = today_start - timedelta(days=today_start.weekday())
        return week_start, now

    if filter_key == DateFilter.THIS_MONTH:
        month_start = datetime(now.year, now.month, 1)
        return month_start, now

    if filter_key == DateFilter.THIS_YEAR:
        year_start = datetime(now.year, 1, 1)
        return year_start, now

    return None, None


def get_month_range(month: str | None) -> tuple[datetime, datetime]:
    """Return the start of the month and start of the next month for the given datetime."""
    date = datetime.strptime(month, "%Y-%m") if month else utc_now()
    start = date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return start, (start + timedelta(days=32)).replace(day=1)


def get_month_start_end(month: str | None) -> tuple[datetime, datetime]:
    """Return the first and last day of the given month as datetime."""
    parsed = datetime.strptime(month, "%Y-%m") if month else utc_now()
    start = parsed.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day = monthrange(start.year, start.month)[1]
    end = start.replace(day=last_day, hour=23, minute=59, second=59, microsecond=999999)
    return start, end


def resolve_bill_date(
    bill_date_input: str | None,
) -> date:
    """Resolve bill date for expense calculations."""
    if isinstance(bill_date_input, str):
        try:
            return datetime.strptime(bill_date_input, "%d/%m/%Y").date()
        except ValueError:
            raise HTTPException(
                detail="Invalid bill date. Expected DD/MM/YYYY.",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )
    raise HTTPException(
        detail="Bill date is required.",
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
    )
