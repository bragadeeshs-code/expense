"""User-related schemas."""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.constants.types import NonEmptyStr
from app.schemas.cost_center import ConstCenterSimpleResponse
from app.schemas.department import DepartmentSimpleResponse
from app.schemas.role import RolesResponse
from app.schemas.shared import PaginatedResponse
from app.utils.phone_number import normalize_phone_number


class UserActions(Enum):
    """User actions for RabbitMQ events."""

    CREATE = "CREATE"
    DELETE = "DELETE"


class UserStatus(str, Enum):
    """Possible user statuses."""

    INVITED = "INVITED"
    ACTIVE = "ACTIVE"


class MobileNumberSchema(BaseModel):
    """Mobile number schema."""

    mobile_number: Optional[str] = None

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, v):
        """Mobile number validation."""
        return normalize_phone_number(v)


class UserSignUpRequest(MobileNumberSchema):
    """Request schema for user signup."""

    email: EmailStr
    first_name: NonEmptyStr
    last_name: NonEmptyStr
    code: NonEmptyStr
    organization_name: NonEmptyStr


class UserCreateBase(BaseModel):
    """Base schema for user creation shared across workflows."""

    email: EmailStr
    grade_id: int
    first_name: NonEmptyStr
    last_name: NonEmptyStr
    role_id: int
    code: NonEmptyStr
    reporting_manager_id: Optional[int] = None
    cost_center_id: Optional[int] = None
    department_id: Optional[int] = None


class UserCreate(UserCreateBase, MobileNumberSchema):
    """Schema for creating a new user."""

    pass


class UserCreateWithOrg(UserCreateBase):
    """Schema for creating a user with an associated organization."""

    mobile_number: str | None = None
    organization_id: int
    status: UserStatus = UserStatus.INVITED


class UserRabbitMQUpdateRequest(BaseModel):
    """Schema for updating user information via RabbitMQ."""

    email: str
    status: UserStatus = UserStatus.INVITED


class UserDeleteResponse(BaseModel):
    """Schema for deleting a user."""

    id: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class UserGrade(BaseModel):
    """User Grade response."""

    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class SimpleUser(BaseModel):
    """Simplified user schema."""

    id: int
    first_name: str
    last_name: str

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class UserRead(BaseModel):
    """Schema for reading user details with grade name."""

    id: int
    email: EmailStr
    first_name: str
    last_name: str
    mobile_number: Optional[str] = None
    grade: UserGrade
    role: RolesResponse
    code: str
    organization_id: int
    reporting_manager: Optional[SimpleUser] = None
    status: UserStatus
    cost_center: Optional[ConstCenterSimpleResponse] = None
    department: Optional[DepartmentSimpleResponse] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedUserResponse(PaginatedResponse):
    """Paginated response model for user."""

    data: List[UserRead]


class UserSortColumn(str, Enum):
    """Allowed fields for sorting user results."""

    ID = "id"
    EMAIL = "email"
    FIRST_NAME = "first_name"
    LAST_NAME = "last_name"
    MOBILE_NUMBER = "mobile_number"
    GRADE = "grade"
    ROLE = "role"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class UpdateUserRequest(MobileNumberSchema):
    """Schema to update user."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    grade_id: Optional[int] = None
    role_id: Optional[int] = None
    code: Optional[str] = None
    reporting_manager_id: Optional[int] = None
    cost_center_id: Optional[int] = None
    department_id: Optional[int] = None


class UserListQuery(BaseModel):
    """Schema for user list query."""

    page: int = Field(1, ge=1)
    per_page: int = Field(10, le=100)
    search: str | None = None


class UserProfileResponse(BaseModel):
    """Schema for user profile response."""

    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str]
    role: str
    grade: str
    cost_center: Optional[str] = None
    department: Optional[str] = None


class UserUploadResponse(BaseModel):
    """Schema for user upload response."""

    message: str


class UserListFilters(BaseModel):
    """Filter parameters for user listing."""

    search: str | None
    statuses: list[UserStatus] | None
    department_ids: list[int] | None
    role_ids: list[int] | None
    grade_ids: list[int] | None
    cost_center_ids: list[int] | None


class EmployeeInfo(BaseModel):
    """Simple employee info response."""

    name: str
    email: str
    code: str
