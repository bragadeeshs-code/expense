import type { ChartConfig } from "@/components/ui/chart";
import { RoleEnum } from "@/helpers/constants/common";

export enum REPORTS {
  MY_REPORTS = "my_reports",
  TEAM_REPORTS = "team_reports",
}

export const ReportsTabs: TabItem<REPORTS>[] = [
  {
    label: "My reports",
    value: REPORTS.MY_REPORTS,
  },
  {
    label: "Team reports",
    value: REPORTS.TEAM_REPORTS,
    access: [RoleEnum.MANAGER],
  },
];

export const FREQUENCY = {
  CURRENT_MONTH: "current_month",
} as const;

export const frequencyOptions = [
  { label: "Current month", value: FREQUENCY.CURRENT_MONTH },
];

export const TEAM_REPORTS_DASHBOARD_API_QUERY_KEY = "team-reports-dashboard";

export const MY_REPORTS_DASHBOARD_API_QUERY_KEY = "my-reports-dashboard";

export const categoryBreakdownChartConfig = {
  expense: {
    label: "Count",
    color: "#773DD0",
  },
} satisfies ChartConfig;

export const pendingEmployeeChartConfig = {
  pending_amount: {
    label: "Pending amount",
    color: "#773DD0",
  },
} satisfies ChartConfig;

export const userExpenseTrendChartConfig = {
  approved_amount: {
    label: "Approved",
    color: "#773DD0",
  },
  pending_amount: {
    label: "Pending",
    color: "#D6B1FF",
  },
  cumulative_amount: {
    label: "Month to date",
    color: "#2B6EF2",
  },
} satisfies ChartConfig;

export const teamApprovalTrendChartConfig = {
  approved_amount: {
    label: "Approved amount",
    color: "#773DD0",
  },
  rejected_amount: {
    label: "Rejected amount",
    color: "#F17C67",
  },
  open_pending_count: {
    label: "Open pending queue",
    color: "#2B6EF2",
  },
} satisfies ChartConfig;
