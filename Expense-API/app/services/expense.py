"""Expense service functions."""

import json
import os
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

import sqlalchemy as sa
from aiokafka import AIOKafkaProducer
from fastapi import HTTPException, UploadFile, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import (
    contains_eager,
    joinedload,
    selectinload,
    with_loader_criteria,
)
from sqlmodel import Session, String, and_, exists, func, or_, select

from app.config.database import get_thread_session
from app.config.logger import get_logger
from app.constants.expenses import (
    ALLOWED_MIME_TYPES,
    EMPLOYEE_NAME_COL,
    EXPENSE_SORT_MAP,
    FINANCER_FILTER_MAP,
    FINANCER_SORT_MAP,
    FLIGHT_CLASS_RANK,
    TEAM_EXPENSE_SORT_MAP,
    TRAIN_CLASS_RANK,
)
from app.models import Expense
from app.models.extracted_expense import ExtractedExpense
from app.models.grade import Grade
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.user import User
from app.models.user_expense import UserExpense
from app.models.user_expense_approval import UserExpenseApproval
from app.schemas.expense import (
    BulkDeleteResponse,
    CategoryType,
    CreateSplitRequest,
    DeleteResponse,
    ExpenseData,
    ExpenseDetailResponse,
    ExpenseManagerSortColumn,
    ExpenseSortColumn,
    ExpenseUploadResponse,
    ExtractedExpenseUpdateRequest,
    ExtractedExpenseUpdateResponse,
    ExtractExpenseResponse,
    ExtractionServiceResponse,
    FinancerExpenseDetailResponse,
    FinancerExpenseFilters,
    FinancerSortParams,
    PaginatedExpenseResponse,
    PaginatedFinancerExpensesResponse,
    PaginatedTeamExpenseResponse,
    PresignedURLResponse,
    Split,
    SplitResponse,
    SplitUpdateStatusRequest,
    SplitUpdateStatusResponse,
    SplitUser,
    SubcategoryType,
    SubmitBehavior,
    TeamExpenseStatus,
)
from app.schemas.grade import AccommodationType
from app.schemas.kafka import KafkaTopics
from app.schemas.notification import NotificationType
from app.schemas.project import ProjectStakeHolderResponse
from app.schemas.shared import SortDirection
from app.schemas.user import EmployeeInfo, UserStatus
from app.schemas.user_expense import ExpenseStatus, SplitAction
from app.schemas.user_expense_approval import ApprovalStatus
from app.services.connection import post_to_webhook_connections
from app.services.expense_tracking import (
    check_project_budget_threshold,
    get_daily_spent,
    get_monthly_spent,
    get_project_current_and_total_spend,
    update_user_totals,
)
from app.services.grade import get_grade
from app.services.minio import (
    build_expense_file_key,
    delete_object,
    get_presigned_download_url,
    upload_object,
)
from app.services.notification import create_notification
from app.services.project import (
    check_project_exists,
    get_user_expense_approvers,
    notify_project_stakeholders,
)
from app.services.trip import get_project_id_by_trip_id
from app.services.user_expense import create_next_pending_user_expense_approval
from app.utils.datetime import get_month_start_end, resolve_bill_date, utc_now
from app.utils.enums import (
    is_valid_flight_class,
    is_valid_train_class,
    parse_category,
    parse_subcategory,
)
from app.utils.file import guess_file_metadata, normalize_filename

logger = get_logger(__name__)


def get_unique_filename(
    original: str,
    session: Session,
    organization_id: int,
    user_id: int,
) -> str:
    """Generate a unique filename within the organization's expenses."""
    base, ext = os.path.splitext(normalize_filename(original))
    existing_expense_names = session.exec(
        select(Expense.name).where(
            Expense.name.ilike(f"{base}%{ext}"),
            Expense.created_by == user_id,
            Expense.organization_id == organization_id,
        )
    ).all()
    candidate = f"{base}{ext}"
    index = 1
    while candidate in existing_expense_names:
        candidate = f"{base} ({index}){ext}"
        index += 1
    return candidate


async def queue_expense_for_extraction(
    expense: Expense,
    user_expense: UserExpense,
    producer: AIOKafkaProducer,
) -> None:
    """Queue an expense for extraction by sending message to Kafka."""
    message_payload = {
        "id": expense.id,
        "filename": build_expense_file_key(
            expense_name=expense.name,
            organization_id=expense.organization_id,
            user_id=expense.created_by,
        ),
    }
    message = json.dumps(message_payload).encode("utf-8")

    await producer.send_and_wait(
        KafkaTopics.expenses_to_extract.value,
        value=message,
        key=str(expense.organization_id).encode("utf-8"),
    )

    user_expense.status = ExpenseStatus.EXTRACTING


async def extract_expense(
    user_expense_id: int,
    session: Session,
    producer: AIOKafkaProducer,
    current_user: User,
) -> ExtractExpenseResponse:
    """Trigger extraction for a single expense."""
    user_expense = session.exec(
        select(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.id == user_expense_id,
            Expense.organization_id == current_user.organization_id,
        )
    ).first()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {user_expense_id} not found.",
        )

    if user_expense.status != ExpenseStatus.UPLOADED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Expense must be in UPLOADED status to manually extract. "
                f"Current status: {user_expense.status.value}"
            ),
        )

    expense = user_expense.expense

    try:
        await queue_expense_for_extraction(
            expense=expense,
            user_expense=user_expense,
            producer=producer,
        )
        session.commit()

        return ExtractExpenseResponse(
            user_expense_id=user_expense.id,
            expense_id=expense.id,
            expense_name=expense.name,
            status=user_expense.status,
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger extraction: {str(e)}",
        )


async def upload_file_to_minio(
    file: UploadFile,
    session: Session,
    producer: AIOKafkaProducer,
    user: User,
) -> ExpenseUploadResponse:
    """Upload a file to MinIO and saves its metadata to the database."""
    try:
        # Read file content
        file_data = await file.read()

        if not file_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File is empty: {file.filename}",
            )

        ext, mime_type = guess_file_metadata(file_data, file.filename)

        if mime_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File format not allowed: {file.filename}",
            )

        expense, user_expense = await run_in_threadpool(
            save_to_db_and_minio,
            original_filename=file.filename,
            file_data=file_data,
            session=session,
            organization_id=user.organization_id,
            user_id=user.id,
        )

        await queue_expense_for_extraction(
            expense=expense,
            user_expense=user_expense,
            producer=producer,
        )
        session.commit()

        return ExpenseUploadResponse(
            id=expense.id,
            name=expense.name,
            format=expense.format,
            status=user_expense.status,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to upload file {file.filename}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file {file.filename}: {str(e)}",
        )


def save_to_db_and_minio(
    original_filename: str,
    file_data: bytes,
    session: Session,
    organization_id: int,
    user_id: int,
) -> tuple[Expense, UserExpense]:
    """Save file metadata to the database and uploads the file to MinIO."""
    filename = get_unique_filename(original_filename, session, organization_id, user_id)
    ext, mime_type = guess_file_metadata(file_data, original_filename)
    file_format = ext or "unknown"

    try:
        expense = Expense(
            name=filename,
            format=file_format,
            organization_id=organization_id,
            created_by=user_id,
        )

        session.add(expense)

        session.flush()

        upload_object(
            expense_name=filename,
            organization_id=organization_id,
            file=file_data,
            mime_type=mime_type,
            user_id=user_id,
        )

        user_expense = UserExpense(
            user_id=user_id,
            expense_id=expense.id,
            status=ExpenseStatus.UPLOADED,
        )
        session.add(user_expense)

        session.commit()

        return expense, user_expense

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {e}",
        )


def get_expenses(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
    sort_by: list[ExpenseSortColumn],
    sort_dir: list[SortDirection],
    ids: list[int] | None = None,
    search: str | None = None,
    name: str | None = None,
    format: str | None = None,
    category: list[CategoryType] | None = None,
    sub_category: list[SubcategoryType] | None = None,
    bill_date: date | None = None,
    bill_month: str | None = None,
    status: list[ExpenseStatus] | None = None,
    user_amount: Decimal | None = None,
    project_ids: list[int] | None = None,
    project_code: str | None = None,
    created_at: datetime | None = None,
    updated_at: datetime | None = None,
) -> PaginatedExpenseResponse:
    """Build and execute an optimized query for expenses."""
    if len(sort_by) != len(sort_dir):
        raise HTTPException(
            status_code=400,
            detail="sort_by and sort_dir must have same length",
        )

    try:
        query = (
            select(
                UserExpense,
            )
            .options(
                joinedload(UserExpense.expense).joinedload(Expense.extracted_expense),
                joinedload(UserExpense.expense)
                .selectinload(Expense.user_expenses)
                .joinedload(UserExpense.user),
                joinedload(UserExpense.project),
            )
            .join(Expense, Expense.id == UserExpense.expense_id)
            .outerjoin(Project, Project.id == UserExpense.project_id)
            .where(
                UserExpense.user_id == current_user.id,
                Expense.organization_id == current_user.organization_id,
            )
        )

        if bill_month:
            start_date, end_date = get_month_start_end(bill_month)
            query = query.where(Expense.bill_date.between(start_date, end_date))

        filters = []

        if ids:
            filters.append(Expense.id.in_(ids))
        if project_ids:
            filters.append(UserExpense.project_id.in_(project_ids))
        if project_code:
            filters.append(Project.code.ilike(f"%{project_code.strip()}%"))
        if created_at:
            filters.append(func.date(Expense.created_at) == created_at.date())
        if updated_at:
            filters.append(func.date(Expense.updated_at) == updated_at.date())

        for field, value in [
            (Expense.name, name),
            (Expense.format, format),
        ]:
            if value:
                filters.append(field.ilike(f"%{value.strip()}%"))

        if bill_date:
            filters.append(Expense.bill_date == bill_date)

        if category:
            filters.append(Expense.category.in_(category))

        if sub_category:
            filters.append(Expense.sub_category.in_(sub_category))

        if search:
            pattern = f"%{search.lower()}%"
            filters.append(
                or_(
                    func.lower(func.coalesce(Expense.name, "")).like(pattern),
                    func.lower(func.coalesce(Expense.format, "")).like(pattern),
                    func.lower(func.coalesce(Expense.vendor_name, "")).like(pattern),
                    func.lower(
                        func.coalesce(func.cast(Expense.category, String), "")
                    ).like(pattern),
                    func.lower(
                        func.coalesce(func.cast(Expense.sub_category, String), "")
                    ).like(pattern),
                    func.lower(func.coalesce(Project.code, "")).like(pattern),
                )
            )

        if status is not None:
            filters.append(UserExpense.status.in_(status))
        if user_amount is not None:
            filters.append(UserExpense.amount == user_amount)

        if filters:
            query = query.where(and_(*filters))

        total = session.exec(select(func.count()).select_from(query.subquery())).one()

        order_clauses = []

        for column, direction in zip(sort_by, sort_dir):
            sort_column = EXPENSE_SORT_MAP[column]
            order_clauses.append(
                sort_column.asc()
                if direction == SortDirection.ASC
                else sort_column.desc()
            )

        query = query.order_by(*order_clauses)

        results = session.exec(
            query.offset((page - 1) * per_page).limit(per_page)
        ).all()

        data = []
        for ue in results:
            expense = ue.expense
            project = ue.project

            shared_users = [
                SplitUser(
                    id=split_ue.user.id,
                    email=split_ue.user.email,
                    amount=split_ue.amount,
                    status=split_ue.status,
                    project_id=split_ue.project_id,
                )
                for split_ue in expense.user_expenses
                if split_ue.user_id != current_user.id
            ]

            data.append(
                ExpenseData(
                    id=expense.id,
                    document_no=expense.document_no,
                    name=expense.name,
                    format=expense.format,
                    category=expense.category,
                    sub_category=expense.sub_category,
                    total_amount=expense.total_amount,
                    bill_date=expense.bill_date,
                    scope=expense.scope,
                    submitted_at=ue.submitted_at,
                    created_at=expense.created_at,
                    updated_at=expense.updated_at,
                    status=ue.status,
                    user_amount=ue.amount,
                    split_with=shared_users,
                    project_code=project.code if project else None,
                    vendor_name=expense.vendor_name,
                    user_expense_id=ue.id,
                )
            )

        return PaginatedExpenseResponse(
            total=total,
            page=page,
            per_page=per_page,
            has_next_page=page * per_page < total,
            data=data,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {e}",
        )


def get_presigned_link_by_id(
    expense_id: int,
    session: Session,
    current_user: User,
    expiry_seconds: int = 3600,
) -> PresignedURLResponse:
    """Generate a presigned download URL for an expense by its ID."""
    expense = get_expense_by_id(
        session=session,
        expense_id=expense_id,
        organization_id=current_user.organization_id,
    )

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {expense_id} not found.",
        )

    try:
        url = get_presigned_download_url(
            expense_name=expense.name,
            user_id=expense.created_by,
            organization_id=expense.organization_id,
            expiry_seconds=expiry_seconds,
        )
        return PresignedURLResponse(url=url)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate presigned URL: {e!s}",
        )


def delete_expense_by_id(
    user_expense_id: int,
    session: Session,
    current_user: User,
) -> DeleteResponse:
    """Delete a user expense and remove the expense if it has no remaining user expenses."""
    user_expense = session.exec(
        select(UserExpense)
        .join(Expense)
        .options(joinedload(UserExpense.expense))
        .where(
            UserExpense.id == user_expense_id,
            UserExpense.user_id == current_user.id,
            Expense.organization_id == current_user.organization_id,
        )
    ).first()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {user_expense_id} not found.",
        )

    if user_expense.status not in {
        ExpenseStatus.EXTRACTING,
        ExpenseStatus.EXTRACTED,
        ExpenseStatus.UPLOADED,
        ExpenseStatus.PENDING,
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete expense in status '{user_expense.status.value}'.",
        )

    expense = user_expense.expense

    try:
        session.delete(user_expense)
        session.flush()
        has_remaining_user_expense = session.scalar(
            select(exists().where(UserExpense.expense_id == expense.id))
        )
        if not has_remaining_user_expense:
            session.delete(expense)
            has_other_expense_with_file = session.scalar(
                select(
                    exists().where(
                        Expense.name == expense.name,
                        Expense.id != expense.id,
                        Expense.created_by == current_user.id,
                    )
                )
            )
        session.commit()
        if not has_remaining_user_expense and not has_other_expense_with_file:
            delete_object(
                expense_name=expense.name,
                organization_id=current_user.organization_id,
                user_id=expense.created_by,
            )
        return expense
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user expense {user_expense_id}: {str(e)}",
        )


async def split_expense_between_users(
    user_expense_id: int,
    split: CreateSplitRequest,
    session: Session,
    current_user: User,
) -> SplitResponse:
    """Split an expense among multiple users."""
    expense, owner_expense = validate_expense_and_owner(
        session=session,
        current_user=current_user,
        user_expense_id=user_expense_id,
        updated_data=split.updated_data,
    )

    process_extracted_expense_update(
        session=session,
        expense=expense,
        updated_data=split.updated_data,
    )

    project_id = split.updated_data.project_id
    trip_id = split.updated_data.trip_id
    bill_date = expense.bill_date

    if trip_id:
        project_id = get_project_id_by_trip_id(
            session=session,
            trip_id=trip_id,
            user_id=expense.created_by,
        )
    else:
        check_project_exists(
            project_id=project_id,
            org_id=expense.organization_id,
            session=session,
            user_id=current_user.id,
        )

    if not expense.total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense has no total amount defined.",
        )

    user_ids = [u.user_id for u in split.users]
    if current_user.id in user_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot include yourself in the split request.",
        )

    db_users = session.exec(
        select(User.id).where(
            User.id.in_(user_ids),
            User.organization_id == current_user.organization_id,
            User.status == UserStatus.ACTIVE,
        )
    ).all()

    valid_user_ids = set(db_users)
    invalid_users = set(user_ids) - valid_user_ids
    if invalid_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user IDs: {sorted(list(invalid_users))}",
        )

    total_split = sum(u.amount for u in split.users)

    if total_split >= expense.total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "The combined split amount for other users "
                f"({total_split}) must be less than "
                f"the expense total ({expense.total_amount})."
            ),
        )

    remaining_amount = expense.total_amount - total_split

    try:
        for user_split in split.users:
            session.add(
                UserExpense(
                    user_id=user_split.user_id,
                    expense_id=expense.id,
                    amount=user_split.amount,
                    status=ExpenseStatus.SPLITTING,
                )
            )

        grade = (
            get_grade(current_user.grade_id, current_user.organization_id, session)
            if current_user.grade_id
            else None
        )

        owner_expense.project_id = project_id
        owner_expense.trip_id = trip_id
        owner_expense.submitted_at = utc_now()

        final_amount, user_expense_status = apply_submit_behavior(
            grade=grade,
            total_amount=remaining_amount,
            behavior=split.updated_data.submit_behavior,
            owner_expense=owner_expense,
            session=session,
            user_id=current_user.id,
            organization_id=current_user.organization_id,
            bill_date=bill_date,
        )

        session.commit()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to split expense: {str(e)}",
        )

    with get_thread_session() as split_notification_session:
        try:
            for user_split in split.users:
                await create_notification(
                    split_notification_session,
                    user_split.user_id,
                    (
                        f"{current_user.email} added you to an expense "
                        f"'{expense.name}' with a share of {user_split.amount:.2f}."
                    ),
                    NotificationType.SPLIT_ACTION,
                    meta_data={
                        "expense_id": expense.id,
                        "sender": current_user.email,
                    },
                )
            split_notification_session.commit()
        except Exception as e:
            split_notification_session.rollback()
            logger.error(f"Split notifications failed: {e}")

    if user_expense_status == ExpenseStatus.APPROVED:
        with get_thread_session() as db_session:
            check_project_budget_threshold(
                session=db_session,
                project_id=project_id,
                org_id=current_user.organization_id,
                bill_date=bill_date,
                new_expense_amount=final_amount,
                ignore_user_expense_id=owner_expense.id,
            )

    if split.updated_data.project_id and user_expense_status == ExpenseStatus.PENDING:
        with get_thread_session() as project_stakeholders_notification_session:
            create_next_pending_user_expense_approval(
                session=project_stakeholders_notification_session,
                user_expense=owner_expense,
                project_id=project_id,
            )
            try:
                await notify_project_stakeholders(
                    session=project_stakeholders_notification_session,
                    project_id=project_id,
                    expense=expense,
                    user_expense=owner_expense,
                    actor=current_user,
                )
                project_stakeholders_notification_session.commit()
            except Exception as e:
                project_stakeholders_notification_session.rollback()
                logger.error(f"Notification failed: {e}")

    all_users = split.users + [Split(user_id=current_user.id, amount=final_amount)]

    return SplitResponse(
        expense_id=expense.id,
        total_split=expense.total_amount,
        users=all_users,
        updated_data=split.updated_data.data,
        note=split.updated_data.note or "",
        status=owner_expense.status,
        project_id=project_id,
        trip_id=trip_id,
    )


async def accept_or_reject_splitting(
    expense_id: int,
    action: SplitUpdateStatusRequest,
    session: Session,
    current_user: User,
) -> SplitUpdateStatusResponse:
    """Approve or reject a split expense by a user."""
    expense = get_expense_by_id(
        session=session,
        expense_id=expense_id,
        organization_id=current_user.organization_id,
    )

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {expense_id} not found.",
        )

    user_expense = session.exec(
        select(UserExpense).where(
            UserExpense.expense_id == expense.id,
            UserExpense.user_id == current_user.id,
        )
    ).first()
    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this expense split.",
        )

    if user_expense.status != ExpenseStatus.SPLITTING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only approve or reject an expense awaiting your response.",
        )

    bill_date = expense.bill_date
    if bill_date is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense has no bill date defined.",
        )

    if action.status == SplitAction.APPROVE:
        project_id = action.project_id
        trip_id = action.trip_id

        if trip_id:
            project_id = get_project_id_by_trip_id(
                session=session,
                trip_id=trip_id,
                user_id=expense.created_by,
            )
        else:
            check_project_exists(
                project_id=project_id,
                org_id=expense.organization_id,
                session=session,
                user_id=current_user.id,
            )

        user_expense.project_id = project_id
        user_expense.trip_id = trip_id

        user_expense.submitted_at = utc_now()

        grade = (
            get_grade(current_user.grade_id, current_user.organization_id, session)
            if current_user.grade_id
            else None
        )

        total_amount = user_expense.amount or 0

        final_amount, user_expense_status = apply_submit_behavior(
            grade=grade,
            total_amount=total_amount,
            behavior=action.submit_behavior,
            owner_expense=user_expense,
            session=session,
            user_id=current_user.id,
            organization_id=current_user.organization_id,
            bill_date=bill_date,
        )

        status_text = (
            f"{current_user.email} has accepted the split request "
            f"for the expense '{expense.name}'. Their share is {final_amount:.2f}."
        )

    else:
        user_expense.status = ExpenseStatus.REJECTED
        status_text = (
            f"{current_user.email} has declined the split request "
            f"for the expense '{expense.name}'. They will not be part of the split."
        )

    try:
        session.commit()

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update split status: {str(e)}",
        )

    other_users = session.exec(
        select(UserExpense.user_id).where(
            UserExpense.expense_id == expense.id,
            UserExpense.user_id != current_user.id,
        )
    ).all()

    with get_thread_session() as split_status_notification_session:
        try:
            for uid in other_users:
                await create_notification(
                    split_status_notification_session,
                    uid,
                    status_text,
                    NotificationType.INFO,
                    meta_data={
                        "expense_id": expense.id,
                        "sender": current_user.email,
                    },
                )
            split_status_notification_session.commit()
        except Exception as e:
            split_status_notification_session.rollback()
            logger.error(f"Split status notifications failed: {e}")

    if user_expense_status == ExpenseStatus.APPROVED:
        with get_thread_session() as db_session:
            check_project_budget_threshold(
                session=db_session,
                project_id=project_id,
                org_id=current_user.organization_id,
                bill_date=bill_date,
                new_expense_amount=final_amount,
                ignore_user_expense_id=user_expense.id,
            )

    if (
        action.status == SplitAction.APPROVE
        and user_expense_status == ExpenseStatus.PENDING
    ):
        with get_thread_session() as project_stakeholders_notification_session:
            create_next_pending_user_expense_approval(
                session=project_stakeholders_notification_session,
                user_expense=user_expense,
                project_id=project_id,
            )

            try:
                await notify_project_stakeholders(
                    session=project_stakeholders_notification_session,
                    project_id=project_id,
                    expense=expense,
                    user_expense=user_expense,
                    actor=current_user,
                )
                project_stakeholders_notification_session.commit()
            except Exception as e:
                project_stakeholders_notification_session.rollback()
                logger.error(f"Notification failed: {e}")

    return SplitUpdateStatusResponse(
        expense_id=expense.id,
        status=user_expense.status,
        user_amount=user_expense.amount,
        project_id=project_id,
        trip_id=trip_id,
    )


def get_expense_by_id(
    session: Session, expense_id: int, organization_id: Optional[int] = None
) -> Expense:
    """Retrieve an expense by its ID, optionally filtering by organization ID."""
    conditions = [Expense.id == expense_id]

    if organization_id:
        conditions.append(Expense.organization_id == organization_id)

    stmt = select(Expense).where(*conditions)

    return session.exec(stmt).first()


def update_extracted_expense(result: ExtractionServiceResponse, session: Session):
    """Update expense and user expense status based on extraction result."""
    base_user_expense = session.exec(
        select(UserExpense)
        .where(
            UserExpense.expense_id == result.id,
            UserExpense.status == ExpenseStatus.EXTRACTING,
        )
        .options(joinedload(UserExpense.expense))
    ).one_or_none()
    if not base_user_expense:
        logger.warning(f"Expense with ID {result.id} not found")
        return

    base_expense = base_user_expense.expense
    try:
        for index, document in enumerate(result.documents):
            if index == 0:
                expense = base_expense
                user_expense = base_user_expense
            else:
                expense = Expense(
                    organization_id=base_expense.organization_id,
                    name=base_expense.name,
                    format=base_expense.format,
                    created_by=base_expense.created_by,
                )
                session.add(expense)
                session.flush()
                user_expense = UserExpense(
                    expense_id=expense.id,
                    user_id=base_user_expense.user_id,
                    status=ExpenseStatus.EXTRACTING,
                )
                session.add(user_expense)

            expense.category = parse_category(document.filetype)
            expense.sub_category = parse_subcategory(document.sub_category)

            expense.document_no = document.processed_data.get("document_id", {}).get(
                "value"
            )
            expense.vendor_name = document.processed_data.get("vendor_name", {}).get(
                "value"
            )
            expense.total_amount = document.processed_data.get(
                "grand_total_After_GST", {}
            ).get("value")
            expense.currency = document.processed_data.get("currency", {}).get("value")
            bill_date = document.processed_data.get("date", {}).get("value")
            try:
                resolved_bill_date = resolve_bill_date(bill_date)
                expense.bill_date = resolved_bill_date
            except HTTPException:
                logger.warning(
                    "Invalid bill date format for Expense ID %s: %s",
                    expense.id,
                    bill_date,
                )

            train_class = (
                document.processed_data.get("transaction_details", {})
                .get("class", {})
                .get("value")
            )

            parsed_train_class = is_valid_train_class(train_class, raise_exc=False)

            if parsed_train_class is not None:
                expense.train_class = parsed_train_class

            best_flight_class = None
            best_rank = -1

            for segment in document.processed_data.get("flight_segments", []):
                raw_class = segment.get("class")

                parsed_class = is_valid_flight_class(raw_class, raise_exc=False)

                if parsed_class:
                    rank = FLIGHT_CLASS_RANK[parsed_class]

                    if rank > best_rank:
                        best_rank = rank
                        best_flight_class = parsed_class

            expense.flight_class = best_flight_class

            extracted = expense.extracted_expense or ExtractedExpense(
                expense_id=expense.id
            )
            if not expense.extracted_expense:
                session.add(extracted)
            extracted.processed_data = document.processed_data
            extracted.processed_data_updated = document.processed_data
            extracted.overall_document_confidence = document.overall_document_confidence
            extracted.verifiability_message = document.verifiability_message

            user_expense.status = ExpenseStatus.EXTRACTED

        session.commit()
        logger.info(
            f"extraction for {base_expense.name} expense of ID {base_expense.id} completed."
        )
    except Exception as e:
        session.rollback()
        logger.warning(f"Failed to update expense ID {result.id}: {e}")
        try:
            base_user_expense.status = ExpenseStatus.UPLOADED
            session.commit()
            logger.info(
                (
                    "Reverted user expense with expense ID %s status to UPLOADED "
                    "after failed extraction."
                ),
                result.id,
            )
        except Exception as e2:
            session.rollback()
            logger.error(
                (
                    "Failed to revert user expense with expense ID %s "
                    "to UPLOADED status: %s"
                ),
                result.id,
                e2,
            )


def get_expense_detail(
    user_expense_id: int, session: Session, current_user: User
) -> ExpenseDetailResponse:
    """Fetch detailed info for a specific expense, including splits and extracted details."""
    user_expense = session.exec(
        select(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .options(
            contains_eager(UserExpense.expense).options(
                selectinload(Expense.extracted_expense),
                selectinload(Expense.user_expenses).options(
                    selectinload(UserExpense.project),
                    selectinload(UserExpense.trip),
                ),
            ),
        )
        .where(
            UserExpense.id == user_expense_id,
            Expense.organization_id == current_user.organization_id,
            or_(
                UserExpense.user_id == current_user.id,
                exists(
                    select(1).where(
                        ProjectApprovalMatrix.project_id == UserExpense.project_id,
                        ProjectApprovalMatrix.approver_id == current_user.id,
                    )
                ),
            ),
        )
    ).first()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense not found",
        )

    is_uploader = user_expense.user_id == current_user.id
    is_approver = not is_uploader

    user_expense_approval = (
        session.exec(
            select(UserExpenseApproval).where(
                UserExpenseApproval.approver_id == current_user.id,
                UserExpenseApproval.user_expense_id == user_expense.id,
            )
        ).first()
        if is_approver
        else None
    )

    expense = user_expense.expense
    extracted = expense.extracted_expense
    extracted_data = extracted.processed_data_updated if extracted else None
    note = extracted.note if extracted else None
    overall_confidence = extracted.overall_document_confidence if extracted else None
    verifiability_message = extracted.verifiability_message if extracted else None

    presigned_url = get_presigned_link_by_id(expense.id, session, current_user)

    if user_expense.status == ExpenseStatus.APPROVED:
        expense_status = ExpenseStatus.APPROVED
    elif is_uploader:
        expense_status = user_expense.status
    else:
        if not user_expense_approval:
            raise HTTPException(
                detail="Approval record not found.",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )
        expense_status = {
            ApprovalStatus.APPROVED: ExpenseStatus.APPROVED,
            ApprovalStatus.REJECTED: ExpenseStatus.REJECTED,
        }.get(user_expense_approval.status, ExpenseStatus.PENDING)

    approvers: list[ProjectStakeHolderResponse] = (
        get_user_expense_approvers(
            session,
            user_expense.id,
            highest_approved_level=user_expense.highest_approved_level or 0,
            project_id=user_expense.project_id,
        )
        if user_expense.project_id
        else []
    )

    users = [
        SplitUser(
            id=user_expense.user.id,
            email=user_expense.user.email,
            amount=user_expense.amount,
            status=user_expense.status,
            project_id=user_expense.project_id,
        )
        for user_expense in expense.user_expenses
    ]

    next_user_expense_id, prev_user_expense_id = _get_user_expense_navigation(
        session=session,
        current_user=current_user,
        current_user_expense_id=user_expense.id,
        is_approver=is_approver,
        expense_status=expense_status,
    )

    return ExpenseDetailResponse(
        id=expense.id,
        name=expense.name,
        url=presigned_url.url,
        format=expense.format,
        category=expense.category,
        sub_category=expense.sub_category,
        total_amount=expense.total_amount,
        bill_date=expense.bill_date,
        currency=expense.currency,
        scope=expense.scope,
        status=expense_status,
        project=user_expense.project,
        trip=user_expense.trip,
        user_expense_id=user_expense_id,
        users=users,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
        data=extracted_data,
        note=note,
        overall_document_confidence=overall_confidence,
        verifiability_message=verifiability_message,
        approvers=approvers,
        next_id=next_user_expense_id,
        prev_id=prev_user_expense_id,
        flight_class=expense.flight_class,
        train_class=expense.train_class,
        accommodation_type=expense.accommodation_type,
    )


def _get_user_expense_navigation(
    session: Session,
    current_user: User,
    current_user_expense_id: int,
    expense_status: ExpenseStatus,
    is_approver: bool,
) -> tuple[int | None, int | None]:
    stmt = (
        select(
            UserExpense.id,
            func.lead(UserExpense.id)
            .over(
                partition_by=UserExpense.status,
                order_by=(Expense.updated_at.asc(), UserExpense.id.asc()),
            )
            .label("next_id"),
            func.lag(UserExpense.id)
            .over(
                partition_by=UserExpense.status,
                order_by=(Expense.updated_at.asc(), UserExpense.id.asc()),
            )
            .label("prev_id"),
        )
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            Expense.organization_id == current_user.organization_id,
            UserExpense.status == expense_status,
        )
    )

    if not is_approver:
        stmt = stmt.where(UserExpense.user_id == current_user.id)
    else:
        stmt = stmt.join(
            ProjectApprovalMatrix,
            ProjectApprovalMatrix.project_id == UserExpense.project_id,
        ).where(ProjectApprovalMatrix.approver_id == current_user.id)

    base_q = stmt.subquery()

    row = session.exec(
        select(base_q.c.next_id, base_q.c.prev_id).where(
            base_q.c.id == current_user_expense_id
        )
    ).first()

    return (
        row.next_id if row else None,
        row.prev_id if row else None,
    )


def validate_expense_and_owner(
    session: Session,
    current_user: User,
    user_expense_id: int,
    updated_data: ExtractedExpenseUpdateRequest,
) -> tuple[Expense, UserExpense]:
    """Validate that the expense exists and belongs to the current user."""
    user_expense = session.exec(
        select(UserExpense)
        .join(Expense, Expense.id == UserExpense.expense_id)
        .options(joinedload(UserExpense.expense))
        .where(
            UserExpense.id == user_expense_id,
            Expense.organization_id == current_user.organization_id,
        )
    ).first()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    if user_expense.status != ExpenseStatus.EXTRACTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Expense must be in Extracted state "
                f"but is '{user_expense.status.value}'."
            ),
        )

    expense = user_expense.expense

    bill_date_value = updated_data.data.get("date", {}).get("value")
    bill_date = resolve_bill_date(bill_date_value)

    category = expense.category
    sub_category = expense.sub_category
    total_amount = updated_data.data.get("grand_total_After_GST", {}).get("value")
    duplicate_stmt = (
        select(UserExpense)
        .join(Expense)
        .where(
            UserExpense.status.in_([ExpenseStatus.PENDING, ExpenseStatus.APPROVED]),
            Expense.bill_date == bill_date,
            Expense.document_no == expense.document_no,
            Expense.category == category,
            Expense.sub_category == sub_category,
            Expense.total_amount == total_amount,
            Expense.organization_id == current_user.organization_id,
            Expense.id != expense.id,
        )
        .order_by(Expense.created_at.asc())
    )

    duplicate_record = session.exec(duplicate_stmt).first()

    if duplicate_record is not None:
        belongs_to_current_user = duplicate_record.user_id == current_user.id

        detail = {
            "message": "This expense already exists.",
            "error_code": "DUPLICATE_EXPENSE",
        }

        if belongs_to_current_user:
            detail["existing_expense_id"] = duplicate_record.id

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )

    return expense, user_expense


def process_extracted_expense_update(
    session: Session,
    expense: Expense,
    updated_data: ExtractedExpenseUpdateRequest,
):
    """Process and verify updated extracted expense data."""
    extracted = expense.extracted_expense
    if not extracted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No extracted data found for this expense.",
        )

    try:
        expense.total_amount = updated_data.data.get("grand_total_After_GST", {}).get(
            "value"
        )
        expense.currency = updated_data.data.get("currency", {}).get("value")

        bill_date_value = updated_data.data.get("date", {}).get("value")

        expense.bill_date = resolve_bill_date(bill_date_value)

        if expense.category == CategoryType.TRAVEL and expense.sub_category in {
            SubcategoryType.FLIGHT_INVOICE,
            SubcategoryType.FLIGHT_RECEIPT,
        }:
            if updated_data.flight_class:
                expense.flight_class = updated_data.flight_class
            else:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="Flight class is required.",
                )
        if (
            expense.category == CategoryType.TRAVEL
            and expense.sub_category == SubcategoryType.TRAIN
        ):
            if updated_data.train_class:
                expense.train_class = updated_data.train_class
            else:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="Train class is required.",
                )
        if expense.category == CategoryType.HOTEL_ACCOMMODATION:
            if updated_data.accommodation_type:
                expense.accommodation_type = updated_data.accommodation_type
            else:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="Accommodation type is required.",
                )

        expense.vendor_name = updated_data.data.get("vendor_name", {}).get("value")

        extracted.processed_data_updated = updated_data.data

        if updated_data.note is not None:
            extracted.note = updated_data.note

        session.commit()

    except HTTPException:
        session.rollback()
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist extracted updates: {e}",
        )


async def submit_expense(
    user_expense_id: int,
    updated_data: ExtractedExpenseUpdateRequest,
    session: Session,
    current_user: User,
) -> ExtractedExpenseUpdateResponse:
    """Submit an extracted expense after user review."""
    expense, owner_expense = validate_expense_and_owner(
        session=session,
        current_user=current_user,
        user_expense_id=user_expense_id,
        updated_data=updated_data,
    )

    process_extracted_expense_update(
        session=session,
        expense=expense,
        updated_data=updated_data,
    )

    bill_date = expense.bill_date

    project_id = updated_data.project_id
    trip_id = updated_data.trip_id

    if trip_id:
        project_id = get_project_id_by_trip_id(
            session=session,
            trip_id=trip_id,
            user_id=expense.created_by,
        )

    else:
        check_project_exists(
            project_id=project_id,
            org_id=expense.organization_id,
            session=session,
            user_id=current_user.id,
        )

    owner_expense.project_id = project_id
    owner_expense.trip_id = trip_id

    owner_expense.submitted_at = utc_now()

    grade = current_user.grade

    total_amount = expense.total_amount or Decimal("0")

    approved_amount, user_expense_status = apply_submit_behavior(
        grade=grade,
        total_amount=total_amount,
        behavior=updated_data.submit_behavior,
        owner_expense=owner_expense,
        session=session,
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        bill_date=bill_date,
    )

    if user_expense_status == ExpenseStatus.PENDING:
        create_next_pending_user_expense_approval(
            session=session,
            user_expense=owner_expense,
            project_id=project_id,
        )

    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update expense status: {str(e)}",
        )

    if user_expense_status == ExpenseStatus.APPROVED:
        await post_to_webhook_connections(
            data=expense.extracted_expense.processed_data_updated,
            organization_id=current_user.organization_id,
            category=expense.category,
            sub_category=expense.sub_category,
        )
        with get_thread_session() as db_session:
            check_project_budget_threshold(
                session=db_session,
                project_id=project_id,
                org_id=current_user.organization_id,
                bill_date=bill_date,
                new_expense_amount=approved_amount,
                ignore_user_expense_id=owner_expense.id,
            )

    if user_expense_status == ExpenseStatus.PENDING:
        with get_thread_session() as project_stakeholders_notification_session:
            try:
                await notify_project_stakeholders(
                    session=project_stakeholders_notification_session,
                    project_id=project_id,
                    expense=expense,
                    user_expense=owner_expense,
                    actor=current_user,
                )
                project_stakeholders_notification_session.commit()
            except Exception as e:
                project_stakeholders_notification_session.rollback()
                logger.error(f"Notification failed: {e}")

    extracted = expense.extracted_expense

    return ExtractedExpenseUpdateResponse(
        id=expense.id,
        data=extracted.processed_data_updated,
        note=extracted.note or "",
        overall_document_confidence=extracted.overall_document_confidence,
        status=owner_expense.status,
        user_amount=owner_expense.amount,
        project_id=project_id,
        trip_id=trip_id,
    )


def get_users_food_total_for_day(
    user_id: int, bill_date: date, session: Session
) -> Decimal:
    """Return the total approved food expense amount for the given user and bill date."""
    stmt = (
        select(func.coalesce(func.sum(UserExpense.amount), 0))
        .select_from(UserExpense)
        .join(Expense, UserExpense.expense_id == Expense.id)
        .where(
            UserExpense.user_id == user_id,
            Expense.bill_date == bill_date,
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.category == CategoryType.MEALS_FOOD,
        )
    )
    return session.scalar(stmt) or Decimal("0")


def _set_expense_status(
    owner_expense: UserExpense,
    total_amount: Decimal,
    status: ExpenseStatus,
) -> tuple[Decimal, ExpenseStatus]:
    """Apply the amount and status for the given expense."""
    owner_expense.amount = total_amount
    owner_expense.status = status
    return owner_expense.amount, owner_expense.status


def _handle_policy_failure(
    owner_expense: UserExpense,
    total_amount: Decimal,
    behavior: SubmitBehavior | None,
) -> tuple[Decimal, ExpenseStatus] | None:
    """Handle grade policy failure for the given behavior."""
    match behavior:
        case SubmitBehavior.SUBMIT_TO_MANAGER:
            return _set_expense_status(
                owner_expense, total_amount, ExpenseStatus.PENDING
            )
        case SubmitBehavior.SUBMIT_UPTO_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Limit exceeded. Please submit to manager.",
            )
        case _:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={"error_code": "LIMIT_EXHAUSTED"},
            )


def apply_auto_approval_policy(
    grade: Grade,
    session: Session,
    user_id: int,
    bill_date: date,
    total_amount: Decimal,
    owner_expense: UserExpense,
    behavior: SubmitBehavior | None,
) -> tuple[Decimal, ExpenseStatus] | None:
    """Apply auto-approval policy rules to an expense and update its status when eligible."""
    expense = owner_expense.expense
    match expense.category:
        case CategoryType.TRAVEL:
            match expense.sub_category:
                case SubcategoryType.FLIGHT_INVOICE | SubcategoryType.FLIGHT_RECEIPT:
                    grade_flight_class_rank = FLIGHT_CLASS_RANK[grade.flight_class]
                    expense_flight_class_rank = FLIGHT_CLASS_RANK[expense.flight_class]
                    if expense_flight_class_rank <= grade_flight_class_rank:
                        return _set_expense_status(
                            owner_expense, total_amount, ExpenseStatus.APPROVED
                        )
                    return _handle_policy_failure(owner_expense, total_amount, behavior)
                case SubcategoryType.TRAIN:
                    grade_train_class_rank = TRAIN_CLASS_RANK[grade.train_class]
                    expense_train_class_rank = TRAIN_CLASS_RANK[expense.train_class]
                    if expense_train_class_rank <= grade_train_class_rank:
                        return _set_expense_status(
                            owner_expense, total_amount, ExpenseStatus.APPROVED
                        )
                    return _handle_policy_failure(owner_expense, total_amount, behavior)
        case CategoryType.HOTEL_ACCOMMODATION:
            accommodation_grade_limit = (
                grade.domestic_accommodation_limit
                if expense.accommodation_type == AccommodationType.DOMESTIC
                else grade.international_accommodation_limit
            )
            if total_amount <= accommodation_grade_limit:
                return _set_expense_status(
                    owner_expense, total_amount, ExpenseStatus.APPROVED
                )
            return _handle_policy_failure(owner_expense, total_amount, behavior)
        case CategoryType.MEALS_FOOD:
            food_total = get_users_food_total_for_day(
                bill_date=bill_date, user_id=user_id, session=session
            )
            if food_total + total_amount <= grade.food_daily_limit:
                return _set_expense_status(
                    owner_expense, total_amount, ExpenseStatus.APPROVED
                )
            return _handle_policy_failure(owner_expense, total_amount, behavior)
    return None


def apply_submit_behavior(
    grade: Grade,
    total_amount: Decimal,
    behavior: Optional[SubmitBehavior],
    owner_expense: UserExpense,
    session: Session,
    user_id: int,
    organization_id: int,
    bill_date: date,
) -> tuple[Decimal, ExpenseStatus]:
    """Apply the submit behavior and validate limits before approving or routing the expense."""
    result = apply_auto_approval_policy(
        owner_expense=owner_expense,
        grade=grade,
        session=session,
        user_id=user_id,
        total_amount=total_amount,
        bill_date=bill_date,
        behavior=behavior,
    )
    if result:
        _, expense_status = result
        if expense_status == ExpenseStatus.APPROVED:
            update_user_totals(session, user_id, total_amount, bill_date)
        return result

    daily_limit = Decimal(getattr(grade, "daily_limit", 0))
    monthly_limit = Decimal(getattr(grade, "monthly_limit", 0))
    auto_approval_threshold = Decimal(getattr(grade, "auto_approval_threshold", 0))

    daily_spent = get_daily_spent(session, user_id, bill_date)
    monthly_spent = get_monthly_spent(session, user_id, bill_date)

    remaining_daily = max(daily_limit - daily_spent, Decimal(0))
    remaining_monthly = max(monthly_limit - monthly_spent, Decimal(0))
    approval_limit = min(remaining_daily, remaining_monthly)

    if approval_limit <= 0:
        if behavior == SubmitBehavior.SUBMIT_TO_MANAGER:
            approved_amount = total_amount
            expense_status = ExpenseStatus.PENDING
        else:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "message": "Available spending limit has been fully used.",
                    "error_code": "LIMIT_EXHAUSTED",
                    "daily_limit": float(daily_limit),
                    "daily_spent": float(daily_spent),
                    "monthly_limit": float(monthly_limit),
                    "monthly_spent": float(monthly_spent),
                    "approval_limit": float(approval_limit),
                },
            )

    elif total_amount > approval_limit:
        if behavior == SubmitBehavior.SUBMIT_TO_MANAGER:
            approved_amount = total_amount
            expense_status = ExpenseStatus.PENDING

        elif behavior == SubmitBehavior.SUBMIT_UPTO_LIMIT:
            approved_amount = approval_limit
            expense_status = (
                ExpenseStatus.APPROVED
                if auto_approval_threshold >= approval_limit
                else ExpenseStatus.PENDING
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "message": "Amount exceeds available spending limit.",
                    "error_code": "LIMIT_EXCEEDED",
                    "total_amount": float(total_amount),
                    "approval_limit": float(approval_limit),
                    "remaining_daily": float(remaining_daily),
                    "remaining_monthly": float(remaining_monthly),
                    "auto_approval_threshold": float(auto_approval_threshold),
                },
            )

    else:
        if total_amount <= auto_approval_threshold:
            approved_amount = total_amount
            expense_status = ExpenseStatus.APPROVED

        elif behavior == SubmitBehavior.SUBMIT_TO_MANAGER:
            approved_amount = total_amount
            expense_status = ExpenseStatus.PENDING

        elif behavior == SubmitBehavior.SUBMIT_UPTO_LIMIT:
            approved_amount = total_amount
            expense_status = ExpenseStatus.PENDING
        else:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "message": "Amount exceeds the auto-approval limit.",
                    "error_code": "LIMIT_EXCEEDED",
                    "total_amount": float(total_amount),
                    "auto_approval_threshold": float(auto_approval_threshold),
                    "approval_limit": float(approval_limit),
                },
            )

    if expense_status == ExpenseStatus.APPROVED:
        project_spend = get_project_current_and_total_spend(
            session=session,
            project_id=owner_expense.project_id,
            org_id=organization_id,
            bill_date=bill_date,
        )
        is_project_budget_exceeded = (
            project_spend.month_spent + approved_amount > project_spend.monthly_budget
            or project_spend.total_spent + approved_amount > project_spend.total_budget
        )
        if is_project_budget_exceeded:
            expense_status = ExpenseStatus.PENDING

    owner_expense.amount = approved_amount
    owner_expense.status = expense_status
    if expense_status == ExpenseStatus.APPROVED:
        update_user_totals(session, user_id, approved_amount, bill_date)

    return approved_amount, expense_status


def get_team_expenses(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
    sort_by: list[ExpenseManagerSortColumn],
    sort_dir: list[SortDirection],
    bill_date: date | None = None,
    bill_month: str | None = None,
    search: str | None = None,
    status: list[TeamExpenseStatus] | None = None,
    category: CategoryType | None = None,
    sub_category: SubcategoryType | None = None,
    approval_status: list[ApprovalStatus] | None = None,
    project_ids: list[int] | None = None,
) -> PaginatedTeamExpenseResponse:
    """Retrieve paginated expenses for projects where user is manager OR approver."""
    if len(sort_by) != len(sort_dir):
        raise HTTPException(
            status_code=400,
            detail="sort_by and sort_dir must have same length",
        )

    query = (
        select(
            Expense.id.label("id"),
            Expense.name.label("bill_name"),
            Expense.format.label("bill_format"),
            (User.first_name + sa.literal(" ") + User.last_name).label("employee_name"),
            Expense.bill_date,
            UserExpense.status,
            UserExpense.submitted_at,
            UserExpense.id.label("user_expense_id"),
            UserExpense.amount.label("amount"),
            Project.code.label("project_code"),
            Expense.scope,
            Expense.category,
            Expense.sub_category,
            UserExpenseApproval.status.label("approval_status"),
            UserExpenseApproval.approval_level.label("approval_level"),
        )
        .join(UserExpense, UserExpense.expense_id == Expense.id)
        .join(Project, Project.id == UserExpense.project_id)
        .join(User, User.id == UserExpense.user_id)
        .join(
            UserExpenseApproval,
            and_(
                UserExpenseApproval.user_expense_id == UserExpense.id,
                UserExpenseApproval.approver_id == current_user.id,
            ),
        )
        .where(
            Expense.organization_id == current_user.organization_id,
        )
    )

    if bill_month:
        start_date, end_date = get_month_start_end(bill_month)
        query = query.where(Expense.bill_date.between(start_date, end_date))

    filters = []

    if search:
        pattern = f"%{search.lower()}%"
        filters.append(
            or_(
                func.lower(User.first_name).like(pattern),
                func.lower(User.last_name).like(pattern),
                func.lower(Project.code).like(pattern),
                func.lower(func.coalesce(func.cast(Expense.category, String), "")).like(
                    pattern
                ),
                func.lower(
                    func.coalesce(func.cast(Expense.sub_category, String), "")
                ).like(pattern),
            )
        )

    if category:
        filters.append(Expense.category == category)

    if sub_category:
        filters.append(Expense.sub_category == sub_category)

    if approval_status:
        filters.append(UserExpenseApproval.status.in_(approval_status))

    if project_ids:
        filters.append(UserExpense.project_id.in_(project_ids))

    if bill_date:
        filters.append(Expense.bill_date == bill_date)

    if status:
        filters.append(UserExpense.status.in_(status))
    else:
        filters.append(UserExpense.status.in_([e.value for e in TeamExpenseStatus]))
    if filters:
        query = query.where(and_(*filters))

    order_clauses = []

    for column, direction in zip(sort_by, sort_dir):
        sort_column = TEAM_EXPENSE_SORT_MAP[column]

        order_clauses.append(
            sort_column.asc() if direction == SortDirection.ASC else sort_column.desc()
        )

    total = session.exec(select(func.count()).select_from(query.subquery())).one()

    query = query.order_by(*order_clauses)

    rows = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedTeamExpenseResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total,
        data=rows,
    )


def bulk_delete_expenses_by_ids(
    user_expense_ids: list[int],
    session: Session,
    current_user: User,
) -> BulkDeleteResponse:
    """Bulk delete user expenses one by one using single-delete service."""
    deleted_ids: list[int] = []
    failed_ids: list[int] = []

    for ue_id in user_expense_ids:
        try:
            delete_expense_by_id(
                user_expense_id=ue_id,
                session=session,
                current_user=current_user,
            )
            deleted_ids.append(ue_id)

        except HTTPException:
            failed_ids.append(ue_id)

        except Exception:
            logger.exception("Unexpected error deleting user expense %s", ue_id)
            failed_ids.append(ue_id)

    return BulkDeleteResponse(
        deleted_ids=deleted_ids,
        failed_ids=failed_ids,
    )


def get_financer_expenses(
    db_session: Session,
    org_id: int,
    page: int,
    per_page: int,
    sorting: FinancerSortParams,
    filters: FinancerExpenseFilters,
) -> PaginatedFinancerExpensesResponse:
    """Get Expenses for financer."""
    stmt = (
        select(
            UserExpense.id.label("user_expense_id"),
            EMPLOYEE_NAME_COL.label("employee_name"),
            User.id.label("user_id"),
            UserExpense.amount,
            Expense.category,
            Expense.id.label("expense_id"),
            UserExpense.submitted_at,
            UserExpense.status,
        )
        .join(UserExpense.user)
        .join(UserExpense.expense)
        .where(
            Expense.organization_id == org_id,
            UserExpense.status.in_(
                [
                    ExpenseStatus.PENDING,
                    ExpenseStatus.APPROVED,
                    ExpenseStatus.REJECTED,
                ]
            ),
        )
    )

    filters_list = []

    if filters.search and (search := filters.search.strip()):
        pattern = f"%{search}%"
        filters_list.append(EMPLOYEE_NAME_COL.ilike(pattern))

    for field, builder in FINANCER_FILTER_MAP.items():
        value = getattr(filters, field)
        if value is not None:
            filters_list.append(builder(value))

    if filters_list:
        stmt = stmt.where(and_(*filters_list))

    total = db_session.exec(select(func.count()).select_from(stmt.subquery())).one()

    order_clauses = []

    for column, direction in sorting.pairs():
        sort_column = FINANCER_SORT_MAP.get(column)
        if not sort_column:
            continue

        order_clauses.append(
            sort_column.asc() if direction == SortDirection.ASC else sort_column.desc()
        )

    if order_clauses:
        stmt = stmt.order_by(*order_clauses)

    results = db_session.exec(stmt.offset((page - 1) * per_page).limit(per_page)).all()

    return PaginatedFinancerExpensesResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total,
        user_expenses=results,
    )


def get_expense_detail_financer_service(
    session: Session,
    user_expense_id: int,
    current_user: User,
) -> FinancerExpenseDetailResponse:
    """Get expense details for financer."""
    stmt = (
        select(UserExpense)
        .where(
            UserExpense.id == user_expense_id,
            UserExpense.status.in_(
                [
                    ExpenseStatus.PENDING,
                    ExpenseStatus.APPROVED,
                    ExpenseStatus.REJECTED,
                ]
            ),
            UserExpense.expense.has(
                Expense.organization_id == current_user.organization_id
            ),
        )
        .options(
            joinedload(UserExpense.user).load_only(
                User.first_name,
                User.last_name,
                User.email,
                User.code,
            ),
            joinedload(UserExpense.expense)
            .load_only(
                Expense.id,
                Expense.category,
                Expense.name,
                Expense.format,
            )
            .joinedload(Expense.extracted_expense)
            .load_only(
                ExtractedExpense.note,
            ),
            selectinload(UserExpense.approvals)
            .joinedload(UserExpenseApproval.approver)
            .load_only(User.first_name, User.last_name),
            with_loader_criteria(
                UserExpenseApproval,
                UserExpenseApproval.status == ApprovalStatus.APPROVED,
                include_aliases=True,
            ),
        )
    )

    user_expense = session.exec(stmt).one_or_none()

    if not user_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found"
        )

    user = user_expense.user
    expense = user_expense.expense
    extracted = expense.extracted_expense

    approvals = [
        {
            "approved_by": f"{a.approver.first_name} {a.approver.last_name}",
            "approved_at": a.updated_at,
        }
        for a in user_expense.approvals
    ]

    url_response = get_presigned_link_by_id(
        expense_id=expense.id,
        session=session,
        current_user=current_user,
    )

    return FinancerExpenseDetailResponse(
        employee=EmployeeInfo(
            name=f"{user.first_name} {user.last_name}",
            email=user.email,
            code=user.code,
        ),
        amount=user_expense.amount,
        submitted_at=user_expense.submitted_at,
        uploaded_at=user_expense.created_at,
        status=user_expense.status,
        user_expense_id=user_expense.id,
        category=expense.category,
        name=expense.name,
        format=expense.format,
        note=extracted.note,
        url=url_response.url,
        approvers=approvals,
    )
