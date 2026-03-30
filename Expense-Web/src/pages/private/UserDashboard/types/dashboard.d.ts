interface ExpenseChartItem {
  name: string;
  amount: number;
  color: string;
}

type ExpenseChartList = ExpenseChartItem[];

type ExpenseBadgeStatus = Extract<
  ReimbursementStatus,
  "Approved" | "Pending" | "Rejected"
>;

interface ExpenseLinkResponse {
  url: string;
}

type DashboardStats = {
  approved_count: number;
  approved_amount_sum: number;
  pending_count: number;
  pending_amount_sum: number;
};

type DashboardExpenseSummary = {
  total_spent: number;
  by_category: Record<string, number>;
  daily_limit: number;
  monthly_limit: number;
};

type Frequency = (typeof FREQUENCY)[keyof typeof FREQUENCY];
