"""Pydantic schemas for report and dashboard summary responses."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.schemas.expense import CategoryType


class WeeklyExpense(BaseModel):
    """Weekly aggregated expense amount for a given week start."""

    total_amount: Decimal
    week_start: datetime

    model_config = ConfigDict(from_attributes=True)


class UserExpenseTrendPoint(BaseModel):
    """Daily user expense trend by bill date."""

    day: date
    approved_amount: Decimal
    pending_amount: Decimal
    cumulative_amount: Decimal

    model_config = ConfigDict(from_attributes=True)


class TeamApprovalTrendPoint(BaseModel):
    """Daily approval activity trend with open pending queue snapshot."""

    day: date
    approved_amount: Decimal
    rejected_amount: Decimal
    open_pending_count: int

    model_config = ConfigDict(from_attributes=True)


class CategoryBreakdown(BaseModel):
    """Category-wise count breakdown for approved expenses."""

    category: CategoryType
    count: int

    model_config = ConfigDict(from_attributes=True)


class PendingEmployeeBreakdown(BaseModel):
    """Pending approvals grouped by employee for the current approver."""

    user_id: int
    user_name: str
    pending_count: int
    pending_amount: Decimal

    model_config = ConfigDict(from_attributes=True)


class TopSpender(BaseModel):
    """Top spenders within an approver's report scope."""

    user_id: int
    user_name: str
    expense_count: int
    total_amount: Decimal

    model_config = ConfigDict(from_attributes=True)


class MyExpenseTotals(BaseModel):
    """Monthly totals for a user's approved and submitted claims."""

    total_claim_count: int
    total_claim_amount: Decimal
    pending_count: int
    pending_amount: Decimal
    rejected_count: int
    rejected_amount: Decimal
    approved_count: int
    approved_reimbursement_total: Decimal
    approved_bill_total: Decimal
    approved_variance_total: Decimal

    model_config = ConfigDict(from_attributes=True)


class TeamApprovalSummary(BaseModel):
    """Monthly workflow metrics for an approver, including total spent and pending approvals count."""

    total_spent: Decimal
    pending_approvals_count: int
    pending_amount: Decimal
    pending_employee_count: int
    average_queue_age_days: float
    oldest_queue_age_days: float
    rejection_rate: float

    model_config = ConfigDict(from_attributes=True)


class ReportBreakdowns(BaseModel):
    """Common breakdown sections used in report summaries."""

    weekly_expenses: list[WeeklyExpense]
    category_breakdown: list[CategoryBreakdown]


class MyReportsSummary(MyExpenseTotals, ReportBreakdowns):
    """Complete monthly report summary for the current user."""

    expense_trend: list[UserExpenseTrendPoint]


class TeamReportsSummary(TeamApprovalSummary, ReportBreakdowns):
    """Complete monthly report summary for the current approver's team scope."""

    approval_activity_trend: list[TeamApprovalTrendPoint]
    pending_employee_breakdown: list[PendingEmployeeBreakdown]
    top_spenders: list[TopSpender]
