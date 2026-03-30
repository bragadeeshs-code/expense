interface MyReportsDashboardResponse {
  weekly_expenses: WeeklyExpense[];
  expense_trend: UserExpenseTrendPoint[];
  category_breakdown: CategoryBreakdown[];
  total_claim_count: number;
  total_claim_amount: number;
  pending_count: number;
  pending_amount: number;
  rejected_count: number;
  rejected_amount: number;
  approved_count: number;
  approved_reimbursement_total: number;
  approved_bill_total: number;
  approved_variance_total: number;
}

interface WeeklyExpense {
  total_amount: number;
  week_start: string;
}

interface UserExpenseTrendPoint {
  day: string;
  approved_amount: number;
  pending_amount: number;
  cumulative_amount: number;
}

interface CategoryBreakdown {
  category: string;
  count: number;
}

interface WeeklyExpenseChartItem {
  week: string;
  expense: number;
}

interface UserExpenseTrendChartItem {
  label: string;
  approved_amount: number;
  pending_amount: number;
  cumulative_amount: number;
}

interface CategoryBreakdownChartItem {
  category: string;
  count: number;
}

interface MyExpenseReportListFilters {
  search: string;
  page: number;
  perPage: number;
}

interface TeamReportsDashboardResponse {
  weekly_expenses: WeeklyExpense[];
  approval_activity_trend: TeamApprovalTrendPoint[];
  category_breakdown: CategoryBreakdown[];
  total_spent: number;
  pending_approvals_count: number;
  pending_amount: number;
  pending_employee_count: number;
  average_queue_age_days: number;
  oldest_queue_age_days: number;
  rejection_rate: number;
  pending_employee_breakdown: PendingEmployeeBreakdownItem[];
  top_spenders: TopSpenderItem[];
}

interface PendingEmployeeBreakdownItem {
  user_id: number;
  user_name: string;
  pending_count: number;
  pending_amount: number;
}

interface TeamApprovalTrendPoint {
  day: string;
  approved_amount: number;
  rejected_amount: number;
  open_pending_count: number;
}

interface TeamApprovalTrendChartItem {
  label: string;
  approved_amount: number;
  rejected_amount: number;
  open_pending_count: number;
}

interface PendingEmployeeBreakdownChartItem {
  employee: string;
  pending_count: number;
  pending_amount: number;
}

interface TopSpenderItem {
  user_id: number;
  user_name: string;
  expense_count: number;
  total_amount: number;
}
