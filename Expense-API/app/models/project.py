"""Project model."""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Numeric,
    Relationship,
    SQLModel,
    String,
    UniqueConstraint,
    func,
)

if TYPE_CHECKING:
    from project_approval_matrix import ProjectApprovalMatrix
    from project_member import ProjectMember
    from user import User
    from user_expense import UserExpense


class Project(SQLModel, table=True):
    """Represents a project within an organization."""

    __tablename__ = "projects"

    __table_args__ = (
        UniqueConstraint("code", "organization_id", name="uq_project_code_org"),
        UniqueConstraint("name", "organization_id", name="uq_project_name_org"),
    )

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    name: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(
        default=None, sa_column=Column(String(50), nullable=True)
    )

    code: str = Field(sa_column=Column(String, nullable=False, index=True))

    manager_id: int = Field(
        sa_column=Column(
            ForeignKey("users.id", name="fk_projects_manager_id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    monthly_budget: Decimal = Field(sa_column=Column(Numeric(12, 2), nullable=False))

    total_budget: Decimal = Field(sa_column=Column(Numeric(12, 2), nullable=False))

    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id",
                name="fk_projects_organization_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
    )

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )

    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )

    manager: Optional["User"] = Relationship()
    members: list["ProjectMember"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    approval_matrix: list["ProjectApprovalMatrix"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"passive_deletes": True},
    )

    user_expenses: list["UserExpense"] = Relationship(back_populates="project")
