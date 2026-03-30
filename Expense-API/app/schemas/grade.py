"""Grade-related schemas."""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, computed_field, model_validator

from app.constants.types import NonEmptyStr
from app.schemas.shared import PaginatedResponse


class FlightClassEnum(str, Enum):
    """Supported flight classes for grade-based travel policies."""

    ECONOMY = "economy"
    PREMIUM_ECONOMY = "premium_economy"
    BUSINESS = "business"


class TrainClassEnum(str, Enum):
    """Supported train classes that determine travel entitlements."""

    TIER_3 = "tier_3"
    TIER_2 = "tier_2"
    TIER_1 = "tier_1"


class AccommodationType(str, Enum):
    """Supported flight classes for grade-based travel policies."""

    DOMESTIC = "domestic"
    INTERNATIONAL = "international"


class AutoApprovalThresholdType(str, Enum):
    """Defines the period used to determine auto-approval threshold limits."""

    DAILY = "daily"
    Monthly = "monthly"


class GradeBase(BaseModel):
    """Base schema defining limits, travel classes, and approval rules for a grade."""

    name: NonEmptyStr
    daily_limit: Annotated[Decimal, Field(gt=0)]
    monthly_limit: Annotated[Decimal, Field(gt=0)]
    flight_class: FlightClassEnum
    train_class: TrainClassEnum
    domestic_accommodation_limit: Annotated[Decimal, Field(gt=0)]
    international_accommodation_limit: Annotated[Decimal, Field(gt=0)]
    food_daily_limit: Annotated[Decimal, Field(gt=0)]
    car_mileage_rate: Decimal = Field(default=Decimal("0"), ge=0)
    bike_mileage_rate: Decimal = Field(default=Decimal("0"), ge=0)


class CreateGradeRequest(GradeBase):
    """Schema for creating a new grade."""

    auto_approval_threshold_type: Annotated[
        AutoApprovalThresholdType, Field(exclude=True)
    ]

    @model_validator(mode="after")
    def validate_grade_rules(self):
        """Validate grade limits and auto-approval threshold rules."""
        if self.daily_limit == self.monthly_limit:
            raise ValueError("Daily limit and Monthly limit can't be same")

        if self.daily_limit > self.monthly_limit:
            raise ValueError("Daily limit can't be greater than monthly limit")

        return self

    @computed_field
    @property
    def auto_approval_threshold(self) -> Decimal:
        """Return the effective auto-approval threshold based on the configured period."""
        if self.auto_approval_threshold_type == AutoApprovalThresholdType.DAILY:
            return self.daily_limit
        return self.monthly_limit


class UpdateGradeRequest(CreateGradeRequest):
    """Schema for updating existing grade."""

    pass


class GradeResponse(GradeBase):
    """Schema representing a grade response."""

    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime
    auto_approval_threshold: Annotated[Decimal, Field(exclude=True)]

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def auto_approval_threshold_type(self) -> str:
        """Return the threshold period ("daily" or "monthly") derived from the configured limits."""
        if self.daily_limit == self.auto_approval_threshold:
            return AutoApprovalThresholdType.DAILY
        return AutoApprovalThresholdType.Monthly


class DeleteGradeResponse(BaseModel):
    """Schema representing a delete grade response."""

    id: int
    model_config = ConfigDict(from_attributes=True)


class GradeUploadResponse(BaseModel):
    """Schema for grade upload response."""

    message: str


class PaginatedGradesResponse(PaginatedResponse):
    """Represents a paginated list of grades along with metadata."""

    data: list[GradeResponse]


class GradeSortColumn(str, Enum):
    """Allowed fields for sorting grade results."""

    NAME = "name"
    DAILY_LIMIT = "daily_limit"
    MONTHLY_LIMIT = "monthly_limit"
    AUTO_APPROVAL_THRESHOLD = "auto_approval_threshold"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class GradeOptionResponse(BaseModel):
    """Grade fields for dropdown options."""

    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
