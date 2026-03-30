"""Service for Project."""

from datetime import datetime

import sqlalchemy as sa
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from psycopg2.errors import ForeignKeyViolation
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload, selectinload
from sqlmodel import Session, and_, case, delete, exists, func, or_, select, update

from app.constants.project import REQUIRED_COLUMNS
from app.models.expense import Expense
from app.models.project import Project
from app.models.project_approval_matrix import ProjectApprovalMatrix
from app.models.project_member import ProjectMember
from app.models.role import Role
from app.models.user import User
from app.models.user_expense import UserExpense
from app.models.user_expense_approval import UserExpenseApproval
from app.schemas.dashboard import DateFilter
from app.schemas.notification import NotificationType
from app.schemas.project import (
    ApproverInput,
    MyProjectsResponse,
    PaginatedProjectResponse,
    ProjectDeleteResponse,
    ProjectDetailApproverResponse,
    ProjectDetailResponse,
    ProjectListItem,
    ProjectMemberUser,
    ProjectOverviewEntry,
    ProjectResponse,
    ProjectStakeHolderResponse,
    ProjectUploadResponse,
    ProjectUpsertRequest,
)
from app.schemas.role import UserRole
from app.schemas.user_expense import ExpenseStatus
from app.schemas.user_expense_approval import ApprovalStatus
from app.services.connection import post_to_webhook_connections
from app.services.expense_tracking import (
    check_project_budget_threshold,
    update_user_totals,
)
from app.services.notification import create_notification
from app.services.user_expense import (
    resolve_user_expense_status,
)
from app.utils.datetime import get_date_range
from app.utils.file import generate_sample_excel, read_upload_file, required_cell


def create_project_service(
    data: ProjectUpsertRequest, session: Session, org_id: int
) -> ProjectResponse:
    """Create a new project along with its members and approvers."""
    validate_project_uniques(session, org_id, data.name, data.code)

    validate_project_users(
        session, org_id, data.manager_id, data.member_ids, data.approvers
    )

    try:
        project = Project(
            name=data.name,
            description=data.description,
            code=data.code,
            manager_id=data.manager_id,
            monthly_budget=data.monthly_budget,
            total_budget=data.total_budget,
            organization_id=org_id,
        )

        session.add(project)
        session.flush()

        if data.member_ids:
            session.add_all(
                [
                    ProjectMember(project_id=project.id, user_id=member_id)
                    for member_id in data.member_ids
                ]
            )

        if data.approvers:
            session.add_all(
                [
                    ProjectApprovalMatrix(
                        project_id=project.id,
                        approver_id=approver.approver_id,
                        approval_level=approver.approval_level,
                    )
                    for approver in data.approvers
                ]
            )

        session.commit()

        return project

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}",
        )


def get_projects_service(
    session: Session, org_id: int, page: int, per_page: int, search: str | None
) -> PaginatedProjectResponse:
    """Fetch all organization projects with search and pagination."""
    query = select(Project).where(Project.organization_id == org_id)

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Project.name.ilike(search_term),
                Project.code.ilike(search_term),
                Project.description.ilike(search_term),
            )
        )

    total_projects = (
        session.exec(select(func.count()).select_from(query.subquery())).first() or 0
    )

    offset = (page - 1) * per_page

    projects = session.exec(
        query.options(selectinload(Project.members).selectinload(ProjectMember.user))
        .order_by(Project.created_at.desc())
        .offset(offset)
        .limit(per_page)
    ).all()

    project_ids = [p.id for p in projects]

    month_start, now = get_date_range(DateFilter.THIS_MONTH)

    spend_stmt = (
        select(
            UserExpense.project_id,
            func.coalesce(func.sum(UserExpense.amount), 0).label("total_spent"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            Expense.bill_date.between(month_start.date(), now.date()),
                            UserExpense.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("current_month_spent"),
        )
        .join(Expense, Expense.id == UserExpense.expense_id)
        .where(
            UserExpense.project_id.in_(project_ids),
            UserExpense.status == ExpenseStatus.APPROVED,
            Expense.organization_id == org_id,
        )
        .group_by(UserExpense.project_id)
    )

    spend_rows = session.exec(spend_stmt).all()

    spend_map = {row.project_id: row for row in spend_rows}

    result = []
    for project in projects:
        spend = spend_map.get(project.id)

        members = [
            ProjectMemberUser(
                id=member.user.id,
                first_name=member.user.first_name,
                last_name=member.user.last_name,
            )
            for member in project.members
        ]

        result.append(
            ProjectListItem(
                id=project.id,
                code=project.code,
                name=project.name,
                description=project.description,
                created_at=project.created_at,
                members=members,
                monthly_budget=project.monthly_budget,
                total_budget=project.total_budget,
                total_spent=spend.total_spent if spend else 0,
                current_month_spent=spend.current_month_spent if spend else 0,
            )
        )

    return PaginatedProjectResponse(
        total=total_projects,
        page=page,
        per_page=per_page,
        has_next_page=(page * per_page) < total_projects,
        data=result,
    )


async def update_project_service(
    project_id: int, data: ProjectUpsertRequest, session: Session, org_id: int
) -> ProjectResponse:
    """Update project and reconcile approval workflow."""
    project = session.exec(
        select(Project).where(
            Project.id == project_id, Project.organization_id == org_id
        )
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    validate_project_uniques(
        session, org_id, data.name, data.code, exclude_id=project_id
    )

    validate_project_users(
        session, org_id, data.manager_id, data.member_ids, data.approvers
    )

    try:
        project.name = data.name
        project.description = data.description
        project.code = data.code
        project.manager_id = data.manager_id
        project.monthly_budget = data.monthly_budget
        project.total_budget = data.total_budget

        existing_members = set(
            session.exec(
                select(ProjectMember.user_id).where(
                    ProjectMember.project_id == project.id
                )
            ).all()
        )

        new_members = set(data.member_ids)

        members_to_add = new_members - existing_members
        members_to_remove = existing_members - new_members

        if members_to_add:
            session.add_all(
                [
                    ProjectMember(project_id=project.id, user_id=u)
                    for u in members_to_add
                ]
            )

        if members_to_remove:
            session.exec(
                delete(ProjectMember).where(
                    ProjectMember.project_id == project.id,
                    ProjectMember.user_id.in_(members_to_remove),
                )
            )

        old_matrix = dict(
            session.exec(
                select(
                    ProjectApprovalMatrix.approval_level,
                    ProjectApprovalMatrix.approver_id,
                ).where(ProjectApprovalMatrix.project_id == project.id)
            ).all()
        )

        new_matrix = {a.approval_level: a.approver_id for a in data.approvers}

        if old_matrix == new_matrix:
            session.commit()
            return project

        session.exec(
            delete(ProjectApprovalMatrix).where(
                ProjectApprovalMatrix.project_id == project.id
            )
        )

        if data.approvers:
            session.add_all(
                [
                    ProjectApprovalMatrix(
                        project_id=project.id,
                        approver_id=a.approver_id,
                        approval_level=a.approval_level,
                    )
                    for a in data.approvers
                ]
            )
            session.flush()

        levels = sorted(set(old_matrix) | set(new_matrix))

        for level in levels:
            old_id = old_matrix.get(level)
            new_id = new_matrix.get(level)

            if old_id == new_id:
                continue

            if new_id is None:
                pending_expenses_for_old_approver = session.exec(
                    select(UserExpense)
                    .join(
                        UserExpenseApproval,
                        UserExpenseApproval.user_expense_id == UserExpense.id,
                    )
                    .where(
                        UserExpense.project_id == project.id,
                        UserExpense.status == ExpenseStatus.PENDING,
                        UserExpenseApproval.status == ApprovalStatus.PENDING,
                        UserExpenseApproval.approval_level == level,
                        UserExpenseApproval.approver_id == old_id,
                    )
                    .options(
                        joinedload(UserExpense.expense).joinedload(
                            Expense.extracted_expense
                        )
                    )
                ).all()

                session.exec(
                    delete(UserExpenseApproval).where(
                        UserExpenseApproval.status == ApprovalStatus.PENDING,
                        UserExpenseApproval.approval_level == level,
                        UserExpenseApproval.approver_id == old_id,
                        exists().where(
                            UserExpense.id == UserExpenseApproval.user_expense_id,
                            UserExpense.project_id == project.id,
                            UserExpense.status == ExpenseStatus.PENDING,
                        ),
                    )
                )

                for ue in pending_expenses_for_old_approver:
                    resolve_user_expense_status(session, ue, project)

                    if ue.status == ExpenseStatus.APPROVED:
                        bill_date = ue.expense.bill_date

                        update_user_totals(
                            session=session,
                            amount=ue.amount,
                            user_id=ue.user_id,
                            bill_date=bill_date,
                        )

                        await post_to_webhook_connections(
                            data=ue.expense.extracted_expense.processed_data_updated,
                            organization_id=org_id,
                            category=ue.expense.category,
                            sub_category=ue.expense.sub_category,
                        )

                        check_project_budget_threshold(
                            session=session,
                            project_id=project.id,
                            org_id=project.organization_id,
                            bill_date=bill_date,
                            new_expense_amount=ue.amount,
                            ignore_user_expense_id=ue.id,
                        )

                continue

            session.exec(
                update(UserExpenseApproval)
                .where(
                    UserExpenseApproval.status == ApprovalStatus.PENDING,
                    UserExpenseApproval.approval_level == level,
                    UserExpenseApproval.approver_id == old_id,
                    exists().where(
                        UserExpense.id == UserExpenseApproval.user_expense_id,
                        UserExpense.project_id == project.id,
                        UserExpense.status == ExpenseStatus.PENDING,
                    ),
                )
                .values(
                    approver_id=new_id,
                    created_at=func.now(),
                )
            )

        session.commit()
        return project

    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error while updating project: {exc}",
        )


def get_project_by_id_service(
    project_id: int, session: Session, org_id: int
) -> ProjectDetailResponse:
    """Fetch a single project with members and approvers."""
    project = session.exec(
        select(Project)
        .where(Project.id == project_id, Project.organization_id == org_id)
        .options(
            selectinload(Project.members).selectinload(ProjectMember.user),
            selectinload(Project.approval_matrix).selectinload(
                ProjectApprovalMatrix.approver
            ),
        )
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    return ProjectDetailResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        code=project.code,
        manager=ProjectMemberUser.model_validate(project.manager),
        monthly_budget=project.monthly_budget,
        total_budget=project.total_budget,
        organization_id=project.organization_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        members=[
            ProjectMemberUser.model_validate(member.user) for member in project.members
        ],
        approvers=[
            ProjectDetailApproverResponse.model_validate(approver)
            for approver in project.approval_matrix
        ],
    )


def validate_project_uniques(
    session: Session, org_id: int, name: str, code: str, exclude_id: int | None = None
):
    """Validate project name and code uniqueness (case-insensitive)."""
    name_val = name.lower()
    code_val = code.lower()

    query = select(Project).where(
        Project.organization_id == org_id,
        or_(
            func.lower(Project.name) == name_val,
            func.lower(Project.code) == code_val,
        ),
    )

    if exclude_id:
        query = query.where(Project.id != exclude_id)

    duplicates = session.exec(query).all()

    for project in duplicates:
        if project.name.lower() == name_val:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, f"Project name '{name}' already exists."
            )
        if project.code.lower() == code_val:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, f"Project code '{code}' already exists."
            )


def validate_project_users(
    session: Session,
    org_id: int,
    manager_id: int,
    member_ids: list[int],
    approvers: list[ApproverInput],
):
    """Validate manager, members, and approvers using a single SELECT that fetches only user IDs."""
    member_ids = member_ids or []
    approver_ids = [a.approver_id for a in approvers] if approvers else []

    all_ids = {manager_id, *member_ids, *approver_ids}

    result = session.exec(
        select(User.id, Role.name)
        .join(Role, User.role_id == Role.id)
        .where(
            User.id.in_(all_ids),
            User.organization_id == org_id,
        )
    ).all()

    users_by_id = {user_id: role_name for user_id, role_name in result}

    user_ids = users_by_id.keys()

    missing_members = set(member_ids) - user_ids
    if missing_members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid member IDs: {list(missing_members)}",
        )

    missing_approvers = set(approver_ids) - user_ids
    if missing_approvers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid approver IDs: {list(missing_approvers)}",
        )

    invalid_approvers = [
        approver_id
        for approver_id in approver_ids
        if users_by_id.get(approver_id) not in [UserRole.MANAGER, UserRole.ADMIN]
    ]
    if invalid_approvers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Approvers must be a Admin, or Manager: {invalid_approvers}",
        )

    if manager_id not in users_by_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected manager does not exist.",
        )

    if users_by_id[manager_id] not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected manager must be a Admin, or Manager.",
        )


def check_project_exists(
    project_id: int, session: Session, org_id: int, user_id: int | None = None
) -> Project:
    """Check if project exists, optionally validating user membership."""
    conditions = [
        Project.id == project_id,
        Project.organization_id == org_id,
    ]

    if user_id is not None:
        conditions.append(
            exists().where(
                ProjectMember.project_id == Project.id,
                ProjectMember.user_id == user_id,
            )
        )

    project = session.exec(select(Project).where(*conditions)).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


def delete_project_service(
    project_id: int, organization_id: int, session: Session
) -> ProjectDeleteResponse:
    """Delete project by id."""
    try:
        db_project = check_project_exists(
            project_id=project_id, session=session, org_id=organization_id
        )
        session.delete(db_project)
        session.commit()
        return ProjectDeleteResponse(id=project_id)
    except IntegrityError as e:
        session.rollback()

        if isinstance(e.orig, ForeignKeyViolation):
            constraint = e.orig.diag.constraint_name

            if constraint == "fk_travel_expenses_project_id":
                msg = (
                    "Project cannot be deleted because related travel expense(s) exist."
                )
            elif constraint == "fk_user_expenses_project_id":
                msg = "Project cannot be deleted because related user expense(s) exist."

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=msg,
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {e}",
        )
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {e}",
        )


async def notify_project_stakeholders(
    session: Session,
    project_id: int,
    expense: Expense,
    user_expense: UserExpense,
    actor: User,
):
    """Notify project manager and approvers when an expense is submitted for approval."""
    stmt = (
        select(Project)
        .where(Project.id == project_id)
        .options(selectinload(Project.approval_matrix))
    )

    project = session.exec(stmt).one_or_none()
    if not project:
        return

    recipient_ids: set[int] = {project.manager_id}
    recipient_ids.update(approver.approver_id for approver in project.approval_matrix)
    recipient_ids.discard(actor.id)

    if not recipient_ids:
        return

    actor_name = (
        f"{actor.first_name} {actor.last_name}"
        if actor.first_name and actor.last_name
        else actor.email
    )

    expense_name = expense.name or "an expense"

    metadata = {
        "expense_id": expense.id,
        "user_expense_id": user_expense.id,
        "project_id": project.id,
        "actor_id": actor.id,
        "actor_email": actor.email,
        "actor_name": actor_name,
    }

    for user_id in recipient_ids:
        await create_notification(
            session,
            user_id,
            (f"{actor_name} submitted {expense_name} for project '{project.name}'."),
            NotificationType.SUBMIT_FOR_APPROVAL,
            meta_data=metadata,
        )


def get_user_expense_approvers(
    session: Session,
    user_expense_id: int,
    highest_approved_level: int,
    project_id: int,
) -> list[ProjectStakeHolderResponse]:
    """Return full approval chain for a user expense."""
    stmt = (
        select(
            ProjectApprovalMatrix.approver_id.label("id"),
            case(
                (
                    UserExpenseApproval.status.is_not(None),
                    UserExpenseApproval.status,
                ),
                (
                    ProjectApprovalMatrix.approval_level <= highest_approved_level,
                    sa.literal(ApprovalStatus.APPROVED),
                ),
                else_=sa.literal(ApprovalStatus.PENDING),
            ).label("status"),
            User.first_name,
            User.last_name,
            ProjectApprovalMatrix.approval_level,
        )
        .select_from(ProjectApprovalMatrix)
        .join(User, User.id == ProjectApprovalMatrix.approver_id)
        .outerjoin(
            UserExpenseApproval,
            and_(
                UserExpenseApproval.approver_id == ProjectApprovalMatrix.approver_id,
                UserExpenseApproval.user_expense_id == user_expense_id,
            ),
        )
        .where(ProjectApprovalMatrix.project_id == project_id)
        .order_by(ProjectApprovalMatrix.approval_level)
    )

    return session.exec(stmt).all()


def get_total_projects(session: Session, organization_id: int) -> int:
    """Return total number of projects for an organization."""
    total_projects_stmt = select(func.count(Project.id)).where(
        Project.organization_id == organization_id
    )
    return session.scalar(total_projects_stmt) or 0


def get_project_count_for_manager(
    session: Session,
    current_user: User,
) -> int:
    """Return total projects managed by the current user."""
    project_scope = and_(
        Project.organization_id == current_user.organization_id,
        or_(
            Project.manager_id == current_user.id,
            exists(
                select(1).where(
                    ProjectApprovalMatrix.project_id == Project.id,
                    ProjectApprovalMatrix.approver_id == current_user.id,
                )
            ),
        ),
    )

    return (
        session.scalar(select(func.count()).select_from(Project).where(project_scope))
        or 0
    )


def get_projects_for_member(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
    search: str | None,
) -> MyProjectsResponse:
    """Return paginated projects where current user is a member."""
    query = (
        select(Project)
        .join(ProjectMember, ProjectMember.project_id == Project.id)
        .where(
            ProjectMember.user_id == current_user.id,
            Project.organization_id == current_user.organization_id,
        )
        .order_by(Project.name)
    )

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Project.name.ilike(search_term),
                Project.code.ilike(search_term),
            )
        )

    total = session.exec(select(func.count()).select_from(query.subquery())).one()

    projects = session.exec(query.offset((page - 1) * per_page).limit(per_page)).all()

    return MyProjectsResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=(page * per_page) < total,
        data=projects,
    )


def get_projects_overview_by_date_range(
    session: Session,
    current_user_id: int,
    organization_id: int,
    start_date: datetime,
    end_date: datetime,
) -> list[ProjectOverviewEntry]:
    """Return list of projects with spend overview for the given date range."""
    project_scope = and_(
        Project.organization_id == organization_id,
        or_(
            Project.manager_id == current_user_id,
            exists(
                select(1).where(
                    ProjectApprovalMatrix.project_id == Project.id,
                    ProjectApprovalMatrix.approver_id == current_user_id,
                )
            ),
        ),
    )

    stmt = (
        select(
            Project.name,
            Project.total_budget,
            func.coalesce(func.sum(UserExpense.amount), 0).label("total_spent"),
        )
        .select_from(Project)
        .outerjoin(
            UserExpense,
            and_(
                UserExpense.project_id == Project.id,
                UserExpense.status == ExpenseStatus.APPROVED,
                exists(
                    select(1).where(
                        Expense.id == UserExpense.expense_id,
                        Expense.bill_date.between(start_date.date(), end_date.date()),
                    )
                ),
            ),
        )
        .where(project_scope)
        .group_by(
            Project.id,
            Project.name,
            Project.total_budget,
        )
        .order_by(Project.name)
    )

    return [
        ProjectOverviewEntry.model_validate(row) for row in session.exec(stmt).all()
    ]


async def upload_and_read_project_file(
    file: UploadFile, session: Session, current_user: User
) -> ProjectUploadResponse:
    """Service to read and save projects in bulk, ignoring conflicts."""
    df = read_upload_file(file, REQUIRED_COLUMNS)

    records = []

    manager_codes = set(df["manager code"].dropna().astype(str).tolist())
    managers = session.exec(
        select(User.code, User.id).where(
            User.code.in_(manager_codes),
            User.organization_id == current_user.organization_id,
        )
    ).all()
    manager_map = dict(managers)

    for idx, row in df.iterrows():
        row_no = idx + 1

        name = required_cell(row, "name", row_no)
        code = required_cell(row, "project code", row_no)
        description = required_cell(row, "description", row_no, raise_exc=False)
        monthly_budget = (
            required_cell(row, "monthly budget", row_no, raise_exc=False) or 0
        )
        total_budget = required_cell(row, "total budget", row_no, raise_exc=False) or 0

        manager_code = required_cell(row, "manager code", row_no)
        manager_id = manager_map.get(manager_code)
        if not manager_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Manager with code '{manager_code}' not found.",
            )

        records.append(
            {
                "name": name,
                "description": description,
                "code": code,
                "manager_id": manager_id,
                "monthly_budget": monthly_budget,
                "total_budget": total_budget,
                "organization_id": current_user.organization_id,
            }
        )

    if not records:
        return ProjectUploadResponse(message="No projects to upload")

    stmt = insert(Project).values(records).on_conflict_do_nothing()
    try:
        result = session.exec(stmt)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            detail=f"Failed to upload projects: {e}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    created_projects_count = result.rowcount
    return ProjectUploadResponse(
        message=f"Upload successful: {created_projects_count} project{'s' if created_projects_count != 1 else ''} added."
    )


def get_sample_template():
    """Return a sample project Excel template as a downloadable response."""
    buffer = generate_sample_excel(columns=list(REQUIRED_COLUMNS))
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="Project sample template.xlsx"'
        },
    )
