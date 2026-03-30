"""Dependency providers for trip."""

from fastapi import Query

from app.schemas.shared import SortDirection
from app.schemas.trip import TravelMode, TripFilters, TripSortColumn, TripsSortParams


def get_trip_filters(
    search: str | None = Query(None),
    hotel_accommodation_needed: bool | None = Query(None),
    mode_of_travel: list[TravelMode] | None = Query(None),
    vehicle_needed: bool | None = Query(None),
    advance_needed: bool | None = Query(None),
) -> TripFilters:
    """Parse query parameters into TripFilters schema."""
    return TripFilters(
        search=search,
        hotel_accommodation_needed=hotel_accommodation_needed,
        mode_of_travel=mode_of_travel,
        vehicle_needed=vehicle_needed,
        advance_needed=advance_needed,
    )


def get_trip_sorting(
    sort_by: list[TripSortColumn] = Query([TripSortColumn.UPDATED_AT]),
    sort_dir: list[SortDirection] = Query([SortDirection.DESC]),
) -> TripsSortParams:
    """Parse query parameters into TripsSortParams schema."""
    return TripsSortParams(sort_by=sort_by, sort_dir=sort_dir)
