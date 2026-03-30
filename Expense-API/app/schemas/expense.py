"""Expense schema."""

from datetime import date, datetime
from decimal import ROUND_HALF_UP, Decimal
from enum import Enum
from typing import Annotated, Any, Dict, List, Optional

from fastapi import HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.schemas.grade import AccommodationType, FlightClassEnum, TrainClassEnum
from app.schemas.project import ProjectInfoResponse, ProjectStakeHolderResponse
from app.schemas.shared import PaginatedResponse, SortDirection
from app.schemas.trip import TripInfoResponse
from app.schemas.user import EmployeeInfo
from app.schemas.user_expense import ExpenseStatus, SplitAction
from app.schemas.user_expense_approval import ApprovalStatus


class CategoryType(str, Enum):
    """Expense category."""

    TRAVEL = "travel"
    HOTEL_ACCOMMODATION = "hotel_accommodation"
    MEALS_FOOD = "meals_food"
    STATIONERY = "stationery"
    FUEL_GAS = "fuel_gas"
    OTHERS = "others"


class SubcategoryType(str, Enum):
    """Expense subcategory."""

    GENERAL = "general"
    AUTO_BIKE_TAXI = "auto_bike_taxi"
    BUS = "bus"
    TRAIN = "train"
    FLIGHT_INVOICE = "flight_invoice"
    FLIGHT_RECEIPT = "flight_receipt"
    INVOICE = "invoice"
    RECEIPT = "receipt"


class ExpenseUploadResponse(BaseModel):
    """Response model for uploaded expense files."""

    id: Optional[int] = None
    name: str
    format: Optional[str] = None
    status: ExpenseStatus

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ExpenseSortColumn(str, Enum):
    """Available Column for sorting expenses."""

    NAME = "name"
    CATEGORY = "category"
    SUB_CATEGORY = "sub_category"
    STATUS = "status"
    VENDOR_NAME = "vendor_name"
    UPDATED_AT = "updated_at"
    TOTAL_AMOUNT = "total_amount"
    PROJECT_CODE = "project_code"
    BILL_DATE = "bill_date"


class SubmitBehavior(str, Enum):
    """Submit behaviors."""

    SUBMIT_TO_MANAGER = "submit_to_manager"
    SUBMIT_UPTO_LIMIT = "submit_upto_limit"


class SplitUser(BaseModel):
    """Split user model."""

    id: int
    email: str
    amount: Optional[Decimal]
    status: ExpenseStatus
    project_id: Optional[int] = None

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ExpenseData(BaseModel):
    """Expense data model."""

    id: int
    name: str
    vendor_name: str | None = None
    project_code: str | None = None
    format: Optional[str] = None
    category: Optional[CategoryType] = None
    sub_category: Optional[SubcategoryType] = None
    total_amount: Optional[Decimal] = None
    bill_date: Optional[date] = None
    scope: Optional[str] = None
    user_amount: Optional[Decimal] = None
    status: Optional[ExpenseStatus] = None
    document_no: Optional[str] = None
    split_with: List[SplitUser] = Field(default_factory=list)
    user_expense_id: int
    submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class PaginatedExpenseResponse(PaginatedResponse):
    """Paginated response model for expenses."""

    data: List[ExpenseData]


class PresignedURLResponse(BaseModel):
    """Response model for presigned URL."""

    url: str


class DeleteResponse(BaseModel):
    """Delete reponse model."""

    id: int
    name: str

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class ExtractedExpenseUpdateRequest(BaseModel):
    """Request model for updating extracted expense data."""

    project_id: Optional[int] = None
    trip_id: Optional[int] = None
    flight_class: FlightClassEnum | None = None
    train_class: TrainClassEnum | None = None
    accommodation_type: AccommodationType | None = None
    data: Dict[str, Any]
    note: str | None = None
    submit_behavior: SubmitBehavior | None = None

    @model_validator(mode="after")
    def validate_project_or_trip(self):
        """Validate either project or trip is provided."""
        if bool(self.project_id) == bool(self.trip_id):
            raise ValueError("Provide exactly one of project_id or trip_id.")
        return self


class ExtractedExpenseUpdateResponse(BaseModel):
    """Response model for updated extracted expense data."""

    id: int
    data: dict
    note: str
    overall_document_confidence: Optional[float] = None
    status: Optional[ExpenseStatus] = None
    project_id: Optional[int] = None
    trip_id: Optional[int] = None
    user_amount: Decimal


class Split(BaseModel):
    """Split model."""

    user_id: int
    amount: Decimal

    @field_validator("amount")
    def validate_amount_precision_and_positive(cls, v: Decimal):
        """Ensure amount > 0 and within precision limits."""
        v = v.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        if v <= Decimal("0"):
            raise ValueError("Amount must be greater than 0.")
        digits = len(v.as_tuple().digits)
        if digits > 12:
            raise ValueError("Amount too large.")
        return v


class CreateSplitRequest(BaseModel):
    """Create Split Request."""

    updated_data: ExtractedExpenseUpdateRequest
    users: List[Split]

    @model_validator(mode="after")
    def check_unique_users(self):
        """Validate that at least one user is present and all user IDs are unique."""
        if not self.users:
            raise ValueError("At least one user must be specified for split.")
        ids = [u.user_id for u in self.users]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate user IDs in split request.")
        return self


class SplitResponse(BaseModel):
    """Response schema for expense split."""

    expense_id: int
    total_split: Decimal
    users: List[Split]
    updated_data: dict
    note: str
    status: Optional[ExpenseStatus] = None
    project_id: Optional[int] = None
    trip_id: Optional[int] = None


class SplitUpdateStatusRequest(BaseModel):
    """Request schema for updating split status."""

    project_id: Optional[int] = None
    trip_id: Optional[int] = None
    status: SplitAction
    submit_behavior: Optional[SubmitBehavior] = None

    @model_validator(mode="after")
    def validate_project_or_trip(self):
        """Validate either project or trip is provided."""
        if bool(self.project_id) == bool(self.trip_id):
            raise ValueError("Provide exactly one of project_id or trip_id.")
        return self


class SplitUpdateStatusResponse(BaseModel):
    """Response schema for updating split status."""

    expense_id: int
    status: Optional[ExpenseStatus] = None
    user_amount: Decimal
    project_id: Optional[int] = None
    trip_id: Optional[int] = None


class ExtractionDocument(BaseModel):
    """Document model from the extraction service."""

    filetype: str
    sub_category: Optional[str] = None
    processed_data: Dict[str, Any]
    overall_document_confidence: float
    verifiability_message: str


class ExtractionServiceResponse(BaseModel):
    """Response model from the extraction service."""

    id: int
    documents: List[ExtractionDocument]


class ExpenseDetailResponse(BaseModel):
    """Detailed expense response."""

    id: int
    name: str
    project: Optional[ProjectInfoResponse] = None
    trip: Optional[TripInfoResponse] = None
    url: Optional[str] = None
    format: Optional[str] = None
    category: Optional[CategoryType] = None
    sub_category: Optional[SubcategoryType] = None
    total_amount: Optional[Decimal] = None
    bill_date: Optional[date] = None
    currency: Optional[str] = None
    scope: Optional[str] = None
    status: Optional[ExpenseStatus] = None
    user_expense_id: Optional[int] = None
    users: List[SplitUser] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    data: Optional[dict]
    note: Optional[str] = None
    overall_document_confidence: Optional[float] = None
    verifiability_message: Optional[str] = None
    approvers: list[ProjectStakeHolderResponse] = Field(default_factory=list)
    next_id: int | None
    prev_id: int | None
    flight_class: FlightClassEnum | None
    train_class: TrainClassEnum | None
    accommodation_type: AccommodationType | None


class TeamExpenseStatus(str, Enum):
    """Status of the expense for manager or financer view."""

    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class TeamExpense(BaseModel):
    """Expense data model for manager view."""

    id: int
    employee_name: str
    bill_name: str
    bill_format: str | None
    bill_date: date | None
    status: TeamExpenseStatus
    amount: Decimal | None
    project_code: str
    scope: str | None
    category: Optional[CategoryType] = None
    user_expense_id: int
    sub_category: Optional[SubcategoryType] = None
    submitted_at: Optional[datetime] = None
    approval_status: ApprovalStatus
    approval_level: int

    model_config = ConfigDict(from_attributes=True)


class PaginatedTeamExpenseResponse(PaginatedResponse):
    """Paginated response model for manager view of expenses."""

    data: List[TeamExpense]


class ExpenseManagerSortColumn(str, Enum):
    """Allowed sorting fields for manager expense list."""

    NAME = "employee_name"
    BILL_DATE = "bill_date"
    AMOUNT = "amount"
    PROJECT_CODE = "project_code"
    STATUS = "status"
    CATEGORY = "category"
    SUB_CATEGORY = "sub_category"
    UPDATED_AT = "updated_at"


class ExtractExpenseResponse(BaseModel):
    """Response model for extracting a single expense."""

    user_expense_id: int
    expense_id: int
    expense_name: str
    status: ExpenseStatus


class BulkDeleteRequest(BaseModel):
    """Request model for bulk deleting expenses."""

    ids: Annotated[list[int], Field(min_length=1)]


class BulkDeleteResponse(BaseModel):
    """Response model for bulk deleting expenses."""

    deleted_ids: list[int]
    failed_ids: list[int]


class ApprovalInfo(BaseModel):
    """Approval Info response for financer."""

    approved_by: str
    approved_at: datetime


class FinancerExpenseDetailResponse(BaseModel):
    """Response model for Expense detail for financer."""

    employee: EmployeeInfo

    amount: Decimal | None
    submitted_at: datetime | None = None
    uploaded_at: datetime | None = None
    status: ExpenseStatus

    user_expense_id: int
    category: CategoryType | None = None
    name: str
    format: str | None = None

    note: str | None = None
    url: str

    approvers: list[ApprovalInfo] = []


class FinancerExpense(BaseModel):
    """Expense data model for financer view."""

    employee_name: str
    amount: Decimal | None
    user_expense_id: int
    expense_id: int
    user_id: int
    category: Optional[CategoryType] = None
    submitted_at: Optional[datetime] = None
    status: TeamExpenseStatus

    model_config = ConfigDict(from_attributes=True)


class PaginatedFinancerExpensesResponse(PaginatedResponse):
    """Schema for financer's paginated expense list response."""

    user_expenses: List[FinancerExpense]


class FinancerExpenseSortColumn(str, Enum):
    """Enum representing sortable columns for financer expences."""

    EMPLOYEE_NAME = "employee_name"
    AMOUNT = "amount"
    CATEGORY = "category"
    SUBMITTED_AT = "submitted_at"
    STATUS = "status"


class FinancerExpenseFilters(BaseModel):
    """Filter parameters for financer expense listing."""

    search: str | None = None
    employee_ids: list[int] | None
    category: list[CategoryType] | None = None
    submitted_at: date | None = None
    status: list[TeamExpenseStatus] | None = None


class FinancerSortParams(BaseModel):
    """Sorting configuration for Financer's expense listing."""

    sort_by: list[FinancerExpenseSortColumn] = [FinancerExpenseSortColumn.SUBMITTED_AT]
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
