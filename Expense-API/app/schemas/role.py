"""Role-related schemas."""

from enum import Enum

from pydantic import BaseModel, ConfigDict


class UserRole(str, Enum):
    """Defines the supported user roles in the system."""

    USER = "User"
    ADMIN = "Admin"
    MANAGER = "Manager"
    FINANCER = "Financer"


class RolesResponse(BaseModel):
    """Represents a role response with its associated permissions."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)
