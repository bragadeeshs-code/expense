"""Trip related schemas."""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

from fastapi import HTTPException, status
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    RootModel,
    computed_field,
    model_validator,
)

from app.schemas.project import ProjectCodeResponse
from app.schemas.shared import PaginatedResponse, SortDirection
from app.schemas.user import SimpleUser


class TravelMode(str, Enum):
    """Enum representing different modes of travel for a trip."""

    FLIGHT = "flight"
    TRAIN = "train"
    BUS = "bus"
    OWN_VEHICLE = "own_vehicle"


class TripStatus(str, Enum):
    """Possible statuses of a trip."""

    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"


class TripStatusUpdate(str, Enum):
    """Actions a manager can perform on a submitted trip."""

    APPROVED = "approved"
    REJECTED = "rejected"


class TripSortColumn(str, Enum):
    """Enum representing sortable columns for trips."""

    DESTINATION = "destination"
    START_DATE = "start_date"
    END_DATE = "end_date"
    ADVANCE_AMOUNT = "advance_amount"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class TripBase(BaseModel):
    """Base schema containing common trip fields."""

    destination: str
    start_date: date
    end_date: date

    description: Optional[str]

    hotel_accommodation_needed: bool
    mode_of_travel: TravelMode
    vehicle_needed: bool

    advance_needed: bool
    advance_amount: Optional[Decimal] = Field(
        default=None,
        max_digits=12,
        decimal_places=2,
    )


class UpsertTripRequest(TripBase):
    """Request model for creating a trip."""

    project_id: int

    @model_validator(mode="after")
    def validate_trip(self):
        """Ensure start_date is not after end_date."""
        if self.start_date > self.end_date:
            raise ValueError("start_date must be before or equal to end_date")

        if self.advance_needed and (
            self.advance_amount is None or self.advance_amount <= 0
        ):
            raise ValueError(
                "Advance amount must be greater than 0 when Advance needed is True"
            )

        return self


class TripResponseBase(TripBase):
    """Response model for a trip."""

    id: int
    status: TripStatus
    created_at: datetime
    updated_at: datetime


class TripResponse(TripResponseBase):
    """Response model for a trip."""

    project_id: int

    model_config = ConfigDict(from_attributes=True)


class DetailedTripResponse(TripResponseBase):
    """Detailed Response model for a trip."""

    project: ProjectCodeResponse

    model_config = ConfigDict(from_attributes=True)


class PaginatedTripResponse(PaginatedResponse):
    """Response model for paginated list of trips."""

    data: list[DetailedTripResponse]


class DetailedTeamTripResponse(TripResponseBase):
    """Detailed Response model for a trip."""

    project: ProjectCodeResponse = Field(exclude=True)
    user: SimpleUser = Field(exclude=True)

    @computed_field
    @property
    def project_code(self) -> str:
        """Derive project_code from project."""
        return self.project.code

    @computed_field
    @property
    def submitted_by(self) -> str:
        """Derive submitted_by from user."""
        return self.user.first_name + " " + self.user.last_name

    model_config = ConfigDict(from_attributes=True)


class PaginatedTeamTripResponse(PaginatedResponse):
    """Response model for paginated list of trips."""

    data: list[DetailedTeamTripResponse]


class TripOption(BaseModel):
    """Trip option used for dropdown selections."""

    id: int
    destination: str


class TripOptions(RootModel[list[TripOption]]):
    """List wrapper for trip options."""

    pass


class TripFilters(BaseModel):
    """Filter parameters for trip listing."""

    search: str | None = None
    hotel_accommodation_needed: bool | None = None
    mode_of_travel: list[TravelMode] | None = None
    vehicle_needed: bool | None = None
    advance_needed: bool | None = None


class TripsSortParams(BaseModel):
    """Sorting configuration for trip listing."""

    sort_by: list[TripSortColumn] = [TripSortColumn.UPDATED_AT]
    sort_dir: list[SortDirection] = [SortDirection.DESC]

    @model_validator(mode="after")
    def validate_lengths(self):
        """Ensure sort_by and sort_dir lengths match."""
        if len(self.sort_by) != len(self.sort_dir):
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_CONTENT,
                "sort_by and sort_dir must have same length",
            )
        return self

    def pairs(self):
        """Return paired sort columns and directions."""
        return zip(self.sort_by, self.sort_dir)


class TripStatusUpdatePayload(BaseModel):
    """Request payload for updating a trip status."""

    status: TripStatusUpdate


class TripInfoResponse(BaseModel):
    """Trip Info Response."""

    id: int
    destination: str
    start_date: date
    end_date: date

    model_config = ConfigDict(from_attributes=True)


class DeleteTripResponse(BaseModel):
    """Response schema for deleted trip."""

    id: int
