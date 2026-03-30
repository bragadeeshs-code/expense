import { format, getWeekOfMonth, parseISO } from "date-fns";
import { ReportsTabs } from "../helpers/constants/reports";
import { hasAccess } from "@/lib/utils";
import type { MeResponse } from "@/types/user.types";

export const transformWeeklyExpenses = (
  data: WeeklyExpense[],
): WeeklyExpenseChartItem[] => {
  return data.map((item) => {
    const date = new Date(item.week_start);
    const weekNumber = getWeekOfMonth(date);
    return {
      week: `W${weekNumber}`,
      expense: Number(item.total_amount),
    };
  });
};

export const transformPendingEmployeeBreakdown = (
  data: PendingEmployeeBreakdownItem[],
): PendingEmployeeBreakdownChartItem[] => {
  return data.map((item) => ({
    employee: item.user_name,
    pending_count: Number(item.pending_count),
    pending_amount: Number(item.pending_amount),
  }));
};

export const transformUserExpenseTrend = (
  data: UserExpenseTrendPoint[],
): UserExpenseTrendChartItem[] => {
  return data.map((item) => ({
    label: format(parseISO(item.day), "MMM dd"),
    approved_amount: Number(item.approved_amount),
    pending_amount: Number(item.pending_amount),
    cumulative_amount: Number(item.cumulative_amount),
  }));
};

export const transformTeamApprovalTrend = (
  data: TeamApprovalTrendPoint[],
): TeamApprovalTrendChartItem[] => {
  return data.map((item) => ({
    label: format(parseISO(item.day), "MMM dd"),
    approved_amount: Number(item.approved_amount),
    rejected_amount: Number(item.rejected_amount),
    open_pending_count: Number(item.open_pending_count),
  }));
};

export const getVisibleReportsTab = (user?: MeResponse) => {
  return user ? ReportsTabs.filter((tab) => hasAccess(user, tab.access)) : [];
};
