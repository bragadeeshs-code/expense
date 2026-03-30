"""Dashboard Schemas."""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Dict, List

from pydantic import BaseModel

from app.schemas.asset import AssetOverview
from app.schemas.project import ProjectOverviewEntry


class DateFilter(str, Enum):
    """Enum for date filter options."""

    TODAY = "today"
    THIS_WEEK = "this_week"
    THIS_MONTH = "this_month"
    THIS_YEAR = "this_year"
    ALL = "all"


class CategorySummaryResponse(BaseModel):
    """Response model for category-wise spending summary."""

    total_spent: float
    by_category: Dict[str, float]
    daily_limit: Decimal | None
    monthly_limit: Decimal | None


class DashboardSummary(BaseModel):
    """Response model for dashboard expense summary."""

    approved_count: int
    approved_amount_sum: float
    pending_count: int
    pending_amount_sum: float


class EmployeeDashboardResponse(BaseModel):
    """Schema for employee dashboard response."""

    total_employees: int
    active_employees: int
    pending_setup_employees: int


class TeamDashboardResponse(BaseModel):
    """Schema for team dashboard response."""

    total_team_members: int
    approved_expense_count: int
    pending_expense_count: int
    approved_total_amount: Decimal
    pending_total_amount: Decimal


class AdminDashboardSummary(BaseModel):
    """Admin dashboard metrics summary response model."""

    total_assets: int
    total_projects: int
    company_assets: list[AssetOverview]
    total_employees: int
    total_connections: int
    pending_invitations: list[str]


class ManagerDashboardResponse(BaseModel):
    """Schema for manager dashboard response."""

    active_projects: int
    total_approved_expenses_amount: Decimal
    total_pending_expenses: int

    manager_daily_spent: Dict[datetime, Decimal]
    team_members_daily_spent: Dict[datetime, Decimal]

    projects_table: List[ProjectOverviewEntry]


class FinancerDashboardResponse(BaseModel):
    """Schema for financer dashboard response."""

    total_expenses: int
    pending_expenses: int
    approved_expenses: int
    approved_expenses_total_amount: Decimal
