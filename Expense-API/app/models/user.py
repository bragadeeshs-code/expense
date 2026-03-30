"""User model."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, ForeignKey, String, func
from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from asset import Asset
    from cost_center import CostCenter
    from department import Department
    from grade import Grade
    from organization import Organization
    from role import Role
    from user_expense import UserExpense


class User(SQLModel, table=True):
    """Represents an application user."""

    __tablename__ = "users"

    __table_args__ = (
        UniqueConstraint(
            "code",
            "organization_id",
            name="uq_users_code_organization_id",
        ),
        UniqueConstraint(
            "mobile_number",
            "organization_id",
            name="uq_users_mobile_number_organization_id",
        ),
    )

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    email: str = Field(sa_column=Column(String, unique=True, nullable=False))

    first_name: str = Field(sa_column=Column(String, nullable=False))
    last_name: str = Field(sa_column=Column(String, nullable=False))

    code: str = Field(sa_column=Column(String, nullable=False))

    mobile_number: Optional[str] = Field(
        default=None, sa_column=Column(String, nullable=True)
    )

    status: str = Field(sa_column=Column(String, nullable=False))

    organization_id: int = Field(
        sa_column=Column(
            ForeignKey(
                "organizations.id", name="fk_users_organization_id", ondelete="RESTRICT"
            ),
            nullable=False,
        )
    )

    grade_id: int = Field(
        sa_column=Column(
            ForeignKey("grades.id", name="fk_users_grade_id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    role_id: int = Field(
        sa_column=Column(
            ForeignKey("roles.id", name="fk_users_role_id", ondelete="RESTRICT"),
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

    cost_center_id: Optional[int] = Field(
        default=None,
        sa_column=Column(
            ForeignKey(
                "cost_centers.id",
                name="fk_users_cost_center_id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
    )

    department_id: Optional[int] = Field(
        default=None,
        sa_column=Column(
            ForeignKey(
                "departments.id",
                name="fk_users_department_id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
    )

    department: Optional["Department"] = Relationship(
        back_populates="users",
    )

    cost_center: Optional["CostCenter"] = Relationship(
        back_populates="users",
    )

    organization: Optional["Organization"] = Relationship(back_populates="users")

    user_expenses: list["UserExpense"] = Relationship(
        back_populates="user",
        passive_deletes="all",
    )

    operated_assets: list["Asset"] = Relationship(back_populates="operator")

    role: "Role" = Relationship(back_populates="users")
    grade: "Grade" = Relationship(back_populates="users")

    reporting_manager_id: Optional[int] = Field(
        default=None,
        sa_column=Column(
            ForeignKey(
                "users.id", name="fk_users_reporting_manager_id", ondelete="SET NULL"
            ),
            nullable=True,
        ),
    )

    reporting_manager: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "remote_side": "User.id",
        }
    )
