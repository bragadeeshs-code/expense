"""Schema for projects."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.constants.types import NonEmptyStr
from app.schemas.shared import PaginatedResponse
from app.schemas.user_expense_approval import ApprovalStatus


class ApproverInput(BaseModel):
    """Input schema for project approvers."""

    approval_level: int = Field(gt=0)
    approver_id: int


class ProjectUpsertRequest(BaseModel):
    """Request schema for creating/updating a new project."""

    name: NonEmptyStr
    description: Optional[str] = Field(default=None, max_length=50)
    code: NonEmptyStr
    manager_id: int
    monthly_budget: Decimal = Field(gt=0)
    total_budget: Decimal = Field(gt=0)
    member_ids: list[int] = Field(default_factory=list)
    approvers: list[ApproverInput] = Field(default_factory=list)

    @field_validator("approvers")
    @classmethod
    def validate_approvers(cls, approvers: list[ApproverInput]):
        """Ensure no duplicate approvers and unique approval levels."""
        if not approvers:
            return approvers

        approver_ids = set()
        levels = set()

        for approver in approvers:
            if approver.approver_id in approver_ids:
                raise ValueError(
                    "Duplicate approver found. Each approver can be added only once."
                )

            if approver.approval_level in levels:
                raise ValueError("Approval levels must be unique per project.")

            approver_ids.add(approver.approver_id)
            levels.add(approver.approval_level)
        return approvers

    @model_validator(mode="after")
    def validate_monthly_vs_total(self):
        """Ensure monthly budget does not exceed total budget."""
        if self.monthly_budget > self.total_budget:
            raise ValueError("Monthly budget cannot exceed total budget")
        return self


class ProjectMemberResponse(BaseModel):
    """Represent a project member in response."""

    user_id: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectApproverResponse(BaseModel):
    """Represent a project approver in response."""

    approver_id: int
    approval_level: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectResponse(BaseModel):
    """Response schema returned after creating or fetching a project."""

    id: int
    name: str
    description: Optional[str]
    code: str
    manager_id: int
    monthly_budget: Decimal
    total_budget: Decimal
    organization_id: int
    created_at: datetime
    updated_at: datetime
    members: List[ProjectMemberResponse] = Field(default_factory=list)
    approvers: List[ProjectApproverResponse] = Field(
        default_factory=list,
        validation_alias="approval_matrix",
    )

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectMemberUser(BaseModel):
    """Project Member."""

    id: int
    first_name: str
    last_name: str

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectListItem(BaseModel):
    """Project list item."""

    id: int
    code: str
    name: str
    description: Optional[str]
    current_month_spent: Decimal
    total_spent: Decimal
    monthly_budget: Decimal
    total_budget: Decimal
    created_at: datetime
    members: List[ProjectMemberUser]

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class PaginatedProjectResponse(PaginatedResponse):
    """Paginated response model for project."""

    data: List[ProjectListItem]


class ProjectDetailApproverResponse(BaseModel):
    """Represent a project approver in response."""

    approver: ProjectMemberUser
    approval_level: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectDetailResponse(BaseModel):
    """Response schema for detailed project."""

    id: int
    name: str
    description: Optional[str]
    code: str
    manager: ProjectMemberUser
    monthly_budget: Decimal
    total_budget: Decimal
    organization_id: int
    created_at: datetime
    updated_at: datetime
    members: List[ProjectMemberUser] = Field(default_factory=list)
    approvers: List[ProjectDetailApproverResponse] = Field(default_factory=list)

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ProjectDeleteResponse(BaseModel):
    """Response schema for project delete response."""

    id: int


class ProjectStakeHolderResponse(BaseModel):
    """Project StakeHolder Response."""

    id: int
    first_name: str
    last_name: str
    approval_level: int
    status: ApprovalStatus

    model_config = ConfigDict(from_attributes=True)


class ProjectInfoResponse(BaseModel):
    """Project Info Response."""

    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)


class MyProjectsResponse(PaginatedResponse):
    """Paginated wrapper for member project list."""

    data: list[ProjectInfoResponse]


class ProjectOverviewEntry(BaseModel):
    """Project overview entry."""

    name: str
    total_budget: Decimal
    total_spent: Decimal

    model_config = ConfigDict(from_attributes=True)


class ProjectSpendResponse(BaseModel):
    """Project spend response."""

    month_spent: Decimal
    total_spent: Decimal
    monthly_budget: Decimal
    total_budget: Decimal
    project_name: str
    manager_email: str
    manager_name: str


class ProjectUploadResponse(BaseModel):
    """Schema for project upload response."""

    message: str


class ProjectCodeResponse(BaseModel):
    """Project Info Response with code."""

    id: int
    code: str

    model_config = ConfigDict(from_attributes=True)
