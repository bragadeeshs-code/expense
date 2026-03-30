"""Project approval matrix model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Integer,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)

if TYPE_CHECKING:
    from project import Project
    from user import User


class ProjectApprovalMatrix(SQLModel, table=True):
    """Represents approval hierarchy for a project."""

    __tablename__ = "project_approval_matrix"

    __table_args__ = (
        UniqueConstraint(
            "project_id",
            "approver_id",
            name="uq_project_approval_project_approver",
        ),
        UniqueConstraint(
            "project_id",
            "approval_level",
            name="uq_project_approval_project_approval_level",
        ),
    )

    project_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "projects.id", name="fk_project_approval_project_id", ondelete="CASCADE"
            ),
            primary_key=True,
        )
    )

    approver_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id", name="fk_project_approval_approver_id", ondelete="RESTRICT"
            ),
            primary_key=True,
        )
    )

    approval_level: int = Field(sa_column=Column(Integer, nullable=False))

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )

    project: Optional["Project"] = Relationship(back_populates="approval_matrix")
    approver: Optional["User"] = Relationship()
