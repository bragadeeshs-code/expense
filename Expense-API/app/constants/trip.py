"""Trip related constants."""

from app.models.trip import Trip
from app.schemas.trip import TripSortColumn

TRIP_SORT_MAP = {
    TripSortColumn.DESTINATION: Trip.destination,
    TripSortColumn.START_DATE: Trip.start_date,
    TripSortColumn.END_DATE: Trip.end_date,
    TripSortColumn.CREATED_AT: Trip.created_at,
    TripSortColumn.UPDATED_AT: Trip.updated_at,
    TripSortColumn.ADVANCE_AMOUNT: Trip.advance_amount,
}

FILTER_MAP = {
    "hotel_accommodation_needed": lambda v: Trip.hotel_accommodation_needed == v,
    "mode_of_travel": lambda v: Trip.mode_of_travel.in_(v),
    "vehicle_needed": lambda v: Trip.vehicle_needed == v,
    "advance_needed": lambda v: Trip.advance_needed == v,
}
