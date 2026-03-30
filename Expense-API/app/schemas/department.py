"""Department related schemas."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict

from app.constants.types import NonEmptyStr
from app.schemas.shared import PaginatedResponse


class DepartmentBase(BaseModel):
    """Base schema for department creation and updates."""

    name: NonEmptyStr


class DepartmentCreateRequest(DepartmentBase):
    """Request schema for creating a department."""

    pass


class DepartmentUpdateRequest(DepartmentBase):
    """Request schema for updating a department."""

    pass


class DepartmentResponse(BaseModel):
    """Response schema for department details."""

    id: int
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedDepartmentResponse(PaginatedResponse):
    """Paginated response model for department."""

    data: list[DepartmentResponse]


class DepartmentSortColumn(str, Enum):
    """Enum for department sorting columns."""

    NAME = "name"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class DepartmentDeleteResponse(BaseModel):
    """Response Schema for department deletion."""

    id: int


class DepartmentSimpleResponse(BaseModel):
    """Simple response schema for department."""

    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
