"""Router for Project."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import (
    require_admin_permission,
    require_user_permission,
)
from app.models.user import User
from app.schemas.project import (
    MyProjectsResponse,
    PaginatedProjectResponse,
    ProjectDeleteResponse,
    ProjectDetailResponse,
    ProjectResponse,
    ProjectUploadResponse,
    ProjectUpsertRequest,
)
from app.services.project import (
    create_project_service,
    delete_project_service,
    get_project_by_id_service,
    get_projects_for_member,
    get_projects_service,
    get_sample_template,
    update_project_service,
    upload_and_read_project_file,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=PaginatedProjectResponse)
def get_projects(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    search: str | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> PaginatedProjectResponse:
    """Get all projects for this organization."""
    return get_projects_service(
        session=session,
        org_id=current_user.organization_id,
        page=page,
        per_page=per_page,
        search=search,
    )


@router.get("/my", response_model=MyProjectsResponse)
def get_my_projects(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    search: str | None = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_permission),
) -> MyProjectsResponse:
    """Get all projects for the current user."""
    return get_projects_for_member(
        session=session,
        current_user=current_user,
        page=page,
        per_page=per_page,
        search=search,
    )


@router.get("/template", response_class=StreamingResponse)
def project_template(
    _: Annotated[User, Depends(require_admin_permission)],
) -> StreamingResponse:
    """Get project sample template."""
    return get_sample_template()


@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project_by_id(
    project_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> ProjectDetailResponse:
    """Get project by id."""
    return get_project_by_id_service(
        project_id=project_id,
        session=session,
        org_id=current_user.organization_id,
    )


@router.post("", response_model=ProjectResponse)
def create_project(
    project: ProjectUpsertRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> ProjectResponse:
    """Create a new project."""
    return create_project_service(project, session, current_user.organization_id)


@router.post("/upload", response_model=ProjectUploadResponse)
async def upload_project_file(
    file: Annotated[UploadFile, File(...)],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_admin_permission)],
) -> ProjectUploadResponse:
    """Upload file and read projects from it."""
    return await upload_and_read_project_file(file, session, current_user)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpsertRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> ProjectResponse:
    """Update an existing project."""
    return await update_project_service(
        project_id=project_id,
        data=project_data,
        session=session,
        org_id=current_user.organization_id,
    )


@router.delete("/{project_id}", response_model=ProjectDeleteResponse)
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_permission),
) -> ProjectDeleteResponse:
    """Delete an existing project."""
    return delete_project_service(
        session=session,
        organization_id=current_user.organization_id,
        project_id=project_id,
    )
