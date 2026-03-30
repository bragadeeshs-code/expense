"""Cost Center related schemas."""

from datetime import datetime
from enum import Enum
from typing import List

from pydantic import BaseModel, ConfigDict

from app.constants.types import NonEmptyStr
from app.schemas.shared import PaginatedResponse


class CostCenterBase(BaseModel):
    """Base schema for cost center creation and updates."""

    code: NonEmptyStr


class CostCenterCreateRequest(CostCenterBase):
    """Request schema for creating a cost center."""

    pass


class CostCenterUpdateRequest(CostCenterBase):
    """Request schema for updating a cost center."""

    pass


class CostCenterResponse(BaseModel):
    """Response schema for cost center details."""

    id: int
    code: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedCostCenterResponse(PaginatedResponse):
    """Paginated response model for cost center."""

    data: List[CostCenterResponse]


class CostCenterSortColumn(str, Enum):
    """Enum for cost center sorting columns."""

    CODE = "code"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class CostCenterDeleteResponse(BaseModel):
    """Response Schema for cost center deletion."""

    id: int


class ConstCenterSimpleResponse(BaseModel):
    """Simple response schema for cost center."""

    id: int
    code: str

    model_config = ConfigDict(from_attributes=True)
