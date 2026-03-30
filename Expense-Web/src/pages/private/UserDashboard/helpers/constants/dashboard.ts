import type { ChartConfig } from "@/components/ui/chart";
import type { CostCenterOverview } from "@/pages/private/ManagerDashboard/types/manager-dashboard.types";

export const expenseChartData = [
  { name: "Train / Bus / Flight Ticket", amount: 3800, color: "#D79FF9" },
  { name: "Meals & Food", amount: 1250, color: "#F5F6F7" },
  { name: "fuel", amount: 1100, color: "#F5E8FB" },
  { name: "Fuel / Gas", amount: 1100, color: "#CE7DFF" },
  { name: "Stationeries", amount: 600, color: "#E4C5F7" },
];

export const expenseChartConfig = {
  value: {
    label: "Expense",
  },
  transportation: {
    label: "Train / Bus / Flight Ticket",
    color: "#D79FF9",
  },
  food: {
    label: "Meals & Food",
    color: "#F5F6F7",
  },
  fuel: {
    label: "Fuel / Gas",
    color: "#F5E8FB",
  },
  accommodation: {
    label: "Accommodation",
    color: "#CE7DFF",
  },
  stationeries: {
    label: "Stationeries",
    color: "#E4C5F7",
  },
} satisfies ChartConfig;

export const FREQUENCY = {
  TODAY: "today",
  THIS_MONTH: "this_month",
} as const;

export const frequencyOptions = [
  { label: "Daily", value: FREQUENCY.TODAY },
  { label: "Monthly", value: FREQUENCY.THIS_MONTH },
];

export const COLORS = [
  "#D79FF9",
  "#F5F6F7",
  "#F5E8FB",
  "#CE7DFF",
  "#E4C5F7",
  "#C2A0FF",
  "#EFD8FA",
  "#FFE6FF",
];

export const COST_CENTER_OVERVIEW_MOCK: CostCenterOverview[] = [
  {
    code: "Research",
    allocated: "₹25,000",
    used: "₹2,000",
    balance: "₹2,000",
  },
  {
    code: "Customer Support",
    allocated: "₹15,800",
    used: "₹1,200",
    balance: "₹1,200",
  },
  {
    code: "IT Services",
    allocated: "₹22,600",
    used: "₹1,800",
    balance: "₹1,800",
  },
  {
    code: "Finance",
    allocated: "₹19,200",
    used: "₹1,600",
    balance: "₹1,600",
  },
  {
    code: "Human Resources",
    allocated: "₹12,300",
    used: "₹1,000",
    balance: "₹1,000",
  },
];
