"""Project member model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Column, DateTime, Field, ForeignKey, Relationship, SQLModel, func

if TYPE_CHECKING:
    from project import Project
    from user import User


class ProjectMember(SQLModel, table=True):
    """Represents a user's membership in a project."""

    __tablename__ = "project_members"

    project_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "projects.id", name="fk_project_members_project_id", ondelete="CASCADE"
            ),
            primary_key=True,
        )
    )

    user_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "users.id", name="fk_project_members_user_id", ondelete="RESTRICT"
            ),
            primary_key=True,
        )
    )

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )

    project: Optional["Project"] = Relationship(back_populates="members")
    user: Optional["User"] = Relationship()
