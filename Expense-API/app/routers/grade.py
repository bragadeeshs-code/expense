"""API routes for managing grades."""

from datetime import datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_admin_permission
from app.models.user import User
from app.schemas.grade import (
    CreateGradeRequest,
    DeleteGradeResponse,
    GradeOptionResponse,
    GradeResponse,
    GradeSortColumn,
    GradeUploadResponse,
    PaginatedGradesResponse,
    UpdateGradeRequest,
)
from app.schemas.shared import SortDirection
from app.services.grade import (
    create_grade,
    delete_grade,
    get_grade_options_service,
    get_grades,
    get_sample_template,
    update_grade,
    upload_and_read_grade_file,
)

router = APIRouter(prefix="/grades", tags=["Grades"])


@router.post(
    "/",
    summary="Create Grade",
    response_model=GradeResponse,
)
def create_grade_route(
    request: CreateGradeRequest,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> GradeResponse:
    """Create a new grade for the authenticated user's organization."""
    return create_grade(
        db_session=db_session,
        data=request,
        organization_id=current_user.organization_id,
    )


@router.post("/upload", response_model=GradeUploadResponse)
async def upload_grade_file(
    file: Annotated[UploadFile, File(...)],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> GradeUploadResponse:
    """Upload file and read grades from it."""
    return await upload_and_read_grade_file(file, session, current_user)


@router.patch(
    "/{grade_id}",
    summary="Update Grade",
    response_model=GradeResponse,
)
def update_grade_route(
    grade_id: int,
    request: UpdateGradeRequest,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> GradeResponse:
    """Update a grade for the current user's organization."""
    return update_grade(
        data=request,
        grade_id=grade_id,
        db_session=db_session,
        organization_id=current_user.organization_id,
    )


@router.get(
    "/",
    summary="Get Grades",
    response_model=PaginatedGradesResponse,
)
def get_grades_route(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    ids: list[int] | None = Query(None),
    search: str | None = Query(None),
    name: str | None = Query(None),
    daily_limit: Decimal | None = Query(None),
    monthly_limit: Decimal | None = Query(None),
    auto_approval_threshold: Decimal | None = Query(None),
    created_at: datetime | None = Query(None),
    updated_at: datetime | None = Query(None),
    sort_by: GradeSortColumn = Query(GradeSortColumn.UPDATED_AT),
    sort_dir: SortDirection = Query(SortDirection.DESC),
    session: Session = Depends(get_session),
    current_user=Depends(require_admin_permission),
) -> PaginatedGradesResponse:
    """Get grades for organization with pagination, filter, search and sorting."""
    return get_grades(
        session=session,
        organization_id=current_user.organization_id,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_dir=sort_dir,
        ids=ids,
        search=search,
        name=name,
        daily_limit=daily_limit,
        monthly_limit=monthly_limit,
        auto_approval_threshold=auto_approval_threshold,
        created_at=created_at,
        updated_at=updated_at,
    )


@router.get("/options", response_model=list[GradeOptionResponse])
def get_grade_options(
    limit: int = Query(5, le=100),
    search: str | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> list[GradeOptionResponse]:
    """Get Grades with id and name for dropdown."""
    return get_grade_options_service(
        session=session,
        organization_id=current_user.organization_id,
        limit=limit,
        search=search,
    )


@router.delete(
    "/{grade_id}",
    summary="Delete Grade",
    response_model=DeleteGradeResponse,
)
def delete_grade_route(
    grade_id: int,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> DeleteGradeResponse:
    """Delete grade for the specified ID."""
    return delete_grade(
        grade_id,
        current_user.organization_id,
        db_session,
    )


@router.get("/template", response_class=StreamingResponse)
def grade_template(
    _: Annotated[User, Depends(require_admin_permission)],
) -> StreamingResponse:
    """Get grade sample template."""
    return get_sample_template()
