"""Router for expense-related endpoints."""

from datetime import date, datetime
from decimal import Decimal
from typing import Annotated

from aiokafka import AIOKafkaProducer
from fastapi import APIRouter, Body, Depends, File, Query, UploadFile
from sqlmodel import Session

from app.config.database import get_session
from app.config.kafka import get_kafka_producer
from app.constants.types import MonthParam
from app.dependencies.expense import (
    get_financer_expense_filters,
    get_financer_expense_sorting,
)
from app.dependencies.permission import (
    require_financer_permission,
    require_manager_permission,
    require_user_permission,
)
from app.models.user import User
from app.schemas.expense import (
    BulkDeleteRequest,
    BulkDeleteResponse,
    CategoryType,
    CreateSplitRequest,
    DeleteResponse,
    ExpenseDetailResponse,
    ExpenseManagerSortColumn,
    ExpenseSortColumn,
    ExpenseUploadResponse,
    ExtractedExpenseUpdateRequest,
    ExtractedExpenseUpdateResponse,
    ExtractExpenseResponse,
    FinancerExpenseDetailResponse,
    FinancerExpenseFilters,
    FinancerSortParams,
    PaginatedExpenseResponse,
    PaginatedFinancerExpensesResponse,
    PaginatedTeamExpenseResponse,
    PresignedURLResponse,
    SplitResponse,
    SplitUpdateStatusRequest,
    SplitUpdateStatusResponse,
    SubcategoryType,
    TeamExpenseStatus,
)
from app.schemas.shared import SortDirection
from app.schemas.user_expense import ExpenseStatus
from app.schemas.user_expense_approval import ApprovalStatus
from app.services.expense import (
    accept_or_reject_splitting,
    bulk_delete_expenses_by_ids,
    delete_expense_by_id,
    get_expense_detail,
    get_expense_detail_financer_service,
    get_expenses,
    get_financer_expenses,
    get_presigned_link_by_id,
    get_team_expenses,
    split_expense_between_users,
    submit_expense,
    upload_file_to_minio,
)
from app.services.expense import (
    extract_expense as extract_expense_service,
)

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseUploadResponse)
async def upload_expense(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    producer: AIOKafkaProducer = Depends(get_kafka_producer),
    current_user=Depends(require_user_permission),
) -> ExpenseUploadResponse:
    """Upload a single expense to MinIO and store metadata in the database."""
    return await upload_file_to_minio(file, session, producer, current_user)


@router.patch("/{user_expense_id}/split", response_model=SplitResponse)
async def split_expense(
    user_expense_id: int,
    split: CreateSplitRequest,
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> SplitResponse:
    """Split expense among users."""
    return await split_expense_between_users(
        user_expense_id, split, session, current_user
    )


@router.patch("/{expense_id}/split/status", response_model=SplitUpdateStatusResponse)
async def accept_or_reject_split(
    expense_id: int,
    action: SplitUpdateStatusRequest,
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> SplitUpdateStatusResponse:
    """Accept or reject a split request."""
    return await accept_or_reject_splitting(expense_id, action, session, current_user)


@router.patch(
    "/{user_expense_id}/submit", response_model=ExtractedExpenseUpdateResponse
)
async def update_and_submit_expense(
    user_expense_id: int,
    updated_data: ExtractedExpenseUpdateRequest = Body(...),
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> ExtractedExpenseUpdateResponse:
    """Submit an extracted expense after user review."""
    return await submit_expense(user_expense_id, updated_data, session, current_user)


@router.get("", response_model=PaginatedExpenseResponse)
def get_all_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    ids: list[int] | None = Query(None),
    search: str | None = Query(None),
    name: str | None = Query(None),
    format: str | None = Query(None),
    category: list[CategoryType] | None = Query(None),
    sub_category: list[SubcategoryType] | None = Query(None),
    bill_date: date | None = Query(None),
    bill_month: MonthParam | None = None,
    status: list[ExpenseStatus] | None = Query(
        None, description="Filter by expense status"
    ),
    user_amount: Decimal | None = Query(
        None, description="Filter by user-specific amount"
    ),
    project_ids: list[int] | None = Query(None),
    project_code: str | None = Query(None),
    created_at: datetime | None = Query(None),
    updated_at: datetime | None = Query(None),
    sort_by: list[ExpenseSortColumn] = Query([ExpenseSortColumn.UPDATED_AT]),
    sort_dir: list[SortDirection] = Query([SortDirection.DESC]),
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> PaginatedExpenseResponse:
    """Get a paginated list of expenses with optional search, filters, and sorting."""
    return get_expenses(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        ids=ids,
        search=search,
        name=name,
        format=format,
        category=category,
        sub_category=sub_category,
        bill_date=bill_date,
        bill_month=bill_month,
        status=status,
        user_amount=user_amount,
        project_ids=project_ids,
        project_code=project_code,
        created_at=created_at,
        updated_at=updated_at,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )


@router.get("/team", response_model=PaginatedTeamExpenseResponse)
def list_team_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    search: str | None = Query(None),
    status: list[TeamExpenseStatus] | None = Query(None),
    category: CategoryType | None = Query(None),
    sub_category: SubcategoryType | None = Query(None),
    approval_status: list[ApprovalStatus] | None = Query(None),
    project_ids: list[int] | None = Query(None),
    sort_by: list[ExpenseManagerSortColumn] = Query(
        [ExpenseManagerSortColumn.UPDATED_AT]
    ),
    sort_dir: list[SortDirection] = Query([SortDirection.DESC]),
    session: Session = Depends(get_session),
    current_user=Depends(require_manager_permission),
    bill_date: date | None = Query(None),
    bill_month: MonthParam | None = None,
) -> PaginatedTeamExpenseResponse:
    """Get a paginated list of expenses for approvers with optional search, filters, and sorting."""
    return get_team_expenses(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        category=category,
        sub_category=sub_category,
        approval_status=approval_status,
        project_ids=project_ids,
        search=search,
        status=status,
        sort_by=sort_by,
        sort_dir=sort_dir,
        bill_date=bill_date,
        bill_month=bill_month,
    )


@router.get("/{id}/link", response_model=PresignedURLResponse)
async def get_uploaded_expense(
    id: int,
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> PresignedURLResponse:
    """Generate a presigned download URL for an uploaded expense by its ID."""
    return get_presigned_link_by_id(
        expense_id=id, session=session, current_user=current_user
    )


@router.get("/finance", response_model=PaginatedFinancerExpensesResponse)
def financer_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_financer_permission),
    filters: FinancerExpenseFilters = Depends(get_financer_expense_filters),
    sorting: FinancerSortParams = Depends(get_financer_expense_sorting),
) -> PaginatedFinancerExpensesResponse:
    """Get expenses for financer."""
    return get_financer_expenses(
        db_session=session,
        org_id=current_user.organization_id,
        page=page,
        per_page=per_page,
        filters=filters,
        sorting=sorting,
    )


@router.get(
    "/finance/{user_expense_id}",
    response_model=FinancerExpenseDetailResponse,
)
def get_expense_detail_financer(
    user_expense_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_financer_permission)],
) -> FinancerExpenseDetailResponse:
    """Get expense detail view for financer."""
    return get_expense_detail_financer_service(
        session=session,
        user_expense_id=user_expense_id,
        current_user=current_user,
    )


@router.get(
    "/{user_expense_id}",
    response_model=ExpenseDetailResponse,
    response_model_exclude_none=True,
)
def fetch_expense_detail(
    user_expense_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> ExpenseDetailResponse:
    """Get detailed information about a specific expense by its ID."""
    return get_expense_detail(
        user_expense_id=user_expense_id, session=session, current_user=current_user
    )


@router.delete("/{user_expense_id}", response_model=DeleteResponse)
def delete_expense(
    user_expense_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> DeleteResponse:
    """Delete a user expense and remove the expense if it has no remaining user expenses."""
    return delete_expense_by_id(user_expense_id, session, current_user)


@router.post("/{user_expense_id}/extract", response_model=ExtractExpenseResponse)
async def extract_expense(
    user_expense_id: int,
    session: Session = Depends(get_session),
    producer: AIOKafkaProducer = Depends(get_kafka_producer),
    current_user=Depends(require_user_permission),
) -> ExtractExpenseResponse:
    """Trigger extraction for a single expense that is in UPLOADED status."""
    return await extract_expense_service(
        user_expense_id=user_expense_id,
        session=session,
        producer=producer,
        current_user=current_user,
    )


@router.post("/delete-all", response_model=BulkDeleteResponse)
def bulk_delete_expenses(
    payload: BulkDeleteRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
) -> BulkDeleteResponse:
    """Delete multiple user expenses.

    Follows same rules as single delete.
    """
    return bulk_delete_expenses_by_ids(
        user_expense_ids=payload.ids,
        session=session,
        current_user=current_user,
    )
