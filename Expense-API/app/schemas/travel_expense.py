"""Travel expense request and response schemas."""

import re
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Annotated, List

from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from pydantic_core import PydanticCustomError


class Vehicles(str, Enum):
    """Enum for vehicles."""

    CAR = "car"
    BIKE = "bike"
    BUS = "bus"
    TRAIN = "train"
    FLIGHT = "flight"


class VehicleTypes(str, Enum):
    """Enum for vehicle types."""

    PUBLIC = "public"
    PERSONAL = "personal"
    COMPANY = "company"


class TravelExpenseStatus(str, Enum):
    """Enum for travel expense status."""

    DRAFTED = "drafted"
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"


class AddTravelExpenseResponse(BaseModel):
    """Response model for successful travel expense creation."""

    message: str = "Travel expense added successfully."


class LocationSchema(BaseModel):
    """Location schema with name and coordinates."""

    name: str = Field(..., min_length=3, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class TravelExpenseList(BaseModel):
    """Schema for listing travel expenses."""

    id: int
    from_location: LocationSchema
    to_location: LocationSchema
    from_date: date
    to_date: date
    vehicle: Vehicles
    vehicle_type: VehicleTypes
    status: TravelExpenseStatus
    amount: Decimal
    distance: Decimal
    customer_name: str
    project_id: int

    model_config = ConfigDict(from_attributes=True)


class TravelExpenseListResponse(BaseModel):
    """Response model for listing travel expenses with pagination."""

    total: int
    page: int
    per_page: int
    has_next_page: bool
    data: List[TravelExpenseList]


class AddTravelExpenseRequest(BaseModel):
    """Request schema for creating a new travel expense."""

    from_date: date = Field(..., description="Travel start date")
    to_date: date = Field(..., description="Travel end date")
    from_location: LocationSchema
    to_location: LocationSchema
    vehicle: Vehicles
    vehicle_type: VehicleTypes
    distance: Decimal = Field(..., gt=0, description="Distance in kilometers")
    customer_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Customer name must contain only alphabetic characters",
    )
    project_id: int = Field(..., gt=0)
    duration_seconds: Decimal = Field(
        ..., gt=0, description="Duration of travel in seconds"
    )

    model_config = ConfigDict(extra="forbid")

    # Validate customer_name
    @field_validator("customer_name", mode="before")
    def validate_customer_name_length(cls, v: str) -> str:
        """Validate customer name length."""
        if len(v.strip()) < 3:
            raise PydanticCustomError(
                "customer_name_invalid_length",
                "Customer name must contain at least 3 characters.",
            )

        if not re.fullmatch(r"[A-Za-z]+( [A-Za-z]+)*", v):
            raise PydanticCustomError(
                "customer_name_invalid_format",
                "Customer name must contain only alphabets (no numbers or special characters).",
            )

        return v

    # Validate from_date and to_date
    @field_validator("from_date", "to_date")
    def validate_dates(cls, v: date):
        """Ensure dates are not in the future."""
        today = date.today()
        if v > today:
            raise PydanticCustomError(
                "future_date_not_allowed",
                "Date cannot be in the future. Only current or past dates are allowed.",
            )

        return v

    # Validate that from_date is not greater than to_date
    @model_validator(mode="after")
    def validate_date_range(self):
        """Ensure dates are not in the future."""
        if self.from_date > self.to_date:
            raise PydanticCustomError(
                "invalid_date_range",
                "From date cannot be greater than To date.",
            )

        return self

    # Validate that distance format
    @field_validator("distance", mode="before")
    def validate_distance(cls, v):
        """Validate distance format."""
        value_str = str(v)
        if not re.fullmatch(r"\d{1,6}\.\d{1,2}", value_str):
            raise PydanticCustomError(
                "distance_invalid_format",
                "Distance must be in format XXXXXX.X or XXXXXX.XX (max 6 digits before decimal)",
            )

        value_decimal = Decimal(value_str)

        return value_decimal


class UpdateTravelExpenseRequest(BaseModel):
    """Request schema for updating travel expense."""

    project_id: int = Field(..., gt=0)

    model_config = ConfigDict(extra="forbid")


class UpdateTravelExpenseResponse(BaseModel):
    """Response model for successful update."""

    message: str = "Travel expense updated successfully."


class TravelExpenseDetailResponse(BaseModel):
    """Response model for travel expense details."""

    id: int
    from_location: LocationSchema
    to_location: LocationSchema
    from_date: date
    to_date: date
    vehicle: Vehicles
    vehicle_type: VehicleTypes
    status: TravelExpenseStatus
    amount: Decimal
    distance: Decimal
    customer_name: str
    project_id: int
    duration_seconds: Decimal
    project_name: str
    carbon_emission: Decimal

    model_config = ConfigDict(from_attributes=True)


class MileageRateResponse(BaseModel):
    """Response model for mileage rate."""

    car_mileage_rate: Decimal
    bike_mileage_rate: Decimal


class AddTravelExpenseNotesResponse(BaseModel):
    """Response model for successful travel expense notes addition."""

    message: str = "Travel expense notes added successfully."


class TravelExpenseNotesRequest(BaseModel):
    """Request schema for adding notes to a travel expense."""

    notes: str | None = Field(
        None, min_length=3, max_length=1000, description="Notes for the travel expense"
    )
    expense_id: int = Field(
        ..., gt=0, description="ID of the travel expense to add notes to"
    )

    model_config = ConfigDict(extra="forbid", from_attributes=True)

    @classmethod
    def as_form(
        cls,
        expense_id: Annotated[int, Form(...)],
        notes: Annotated[str | None, Form()] = None,
    ):
        """Create schema instance from multipart form data."""
        return cls(notes=notes, expense_id=expense_id)


class TravelExpenseNotesListResponse(BaseModel):
    """Response model for listing travel expense notes."""

    notes: str | None
    file_name: str | None
    file_url: str | None
    created_by: str
    created_at: datetime
    created_by_id: int

    model_config = ConfigDict(from_attributes=True)


class UpdateTravelExpenseRejectRequest(BaseModel):
    """Request schema for rejecting travel expense."""

    reject_reason: str = Field(..., min_length=3, max_length=1000)


class TravelExpenseRejectResponse(BaseModel):
    """Response model for successful rejection of travel expense."""

    message: str = "Travel expense rejected successfully."


class TravelExpenseApproveResponse(BaseModel):
    """Response model for successful approval of travel expense."""

    message: str = "Travel expense approved successfully."


class DashboardMetricsResponse(BaseModel):
    """Response model for travel expense dashboard metrics."""

    total_claim_amount: Decimal
    total_distance: Decimal
    total_carbon_emission: Decimal


class TeamDashboardMetricsResponse(BaseModel):
    """Response model for travel expense dashboard metrics by team."""

    total_distance: Decimal
    total_claim_amount: Decimal
    total_approved_amount: Decimal
    pending_count: int
    total_carbon_emission: Decimal
