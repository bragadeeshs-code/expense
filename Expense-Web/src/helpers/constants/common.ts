import {
  Files,
  FileSearchIcon,
  HandCoins,
  FileText,
  Users,
  CircleStar,
  BellOff,
  Backpack,
  Wallet,
} from "lucide-react";

import FuelPump from "/assets/icons/fuel_pump.svg";
import ReportsIcon from "/assets/icons/analysis-text-link.svg";
import CompanyIcon from "/assets/icons/building.svg";
import InvoiceIcon from "/assets/icons/invoice-icon.svg";
import ProjectsIcon from "/assets/icons/property-new.svg";
import DashboardIcon from "/assets/icons/dashboard-icon.svg";
import ApprovalsIcon from "/assets/icons/checkmark_square_icon.svg";
import FuelPumpActive from "/assets/icons/fuel_pump_active.svg";
import ReportsActiveIcon from "/assets/icons/analysis-text-link-active-icon.svg";
import CompanyActiveIcon from "/assets/icons/building-active.svg";
import InvoiceActiveIcon from "/assets/icons/invoice-active-icon.svg";
import TeamWorkSpaceIcon from "/assets/icons/multiple_user_icon.svg";
import UserManagementIcon from "/assets/icons/user_management_icon.svg";
import ProjectsActiveIcon from "/assets/icons/property-new-active.svg";
import DashboardActiveIcon from "/assets/icons/dashboard-active-icon.svg";
import ApprovalsActiveIcon from "/assets/icons/checkmark_square_active_icon.svg";
import TeamWorkSpaceActiveIcon from "/assets/icons/multiple_user_active_icon.svg";
import UserManagementActiveIcon from "/assets/icons/user_management_active_icon.svg";
import PlaneIcon from "/assets/icons/plane_icon.svg";
import PlaneIconActive from "/assets/icons/plane_icon_active.svg";
import AdvancesIcon from "/assets/icons/advances.svg";
import AdvancesIconActive from "/assets/icons/advances_active.svg";

import {
  CATEGORY,
  SUB_CATEGORY,
} from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import type { ChartConfig } from "@/components/ui/chart";
import type { SelectOption } from "@/types/common.types";
import type { ReimbursementColumnFilters } from "@/types/expense.types";

export enum RoleEnum {
  ADMIN = "Admin",
  USER = "User",
  MANAGER = "Manager",
  FINANCER = "Financer",
}

export const navbarItems: NavbarItem[] = [
  {
    href: "/",
    icon: DashboardIcon,
    label: "Dashboard",
    activeIcon: DashboardActiveIcon,
  },
  {
    href: "/trip",
    icon: PlaneIcon,
    label: "Travel request",
    activeIcon: PlaneIconActive,
    access: [RoleEnum.USER, RoleEnum.MANAGER],
  },
  {
    href: "/advances",
    icon: AdvancesIcon,
    label: "Advances",
    activeIcon: AdvancesIconActive,
    access: [RoleEnum.FINANCER],
  },
  {
    href: "/my_expenses",
    icon: InvoiceIcon,
    label: "My Expense",
    activeIcon: InvoiceActiveIcon,
    access: [RoleEnum.USER, RoleEnum.MANAGER],
  },
  {
    href: "/user_management",
    icon: UserManagementIcon,
    label: "User Management",
    activeIcon: UserManagementActiveIcon,
    access: [RoleEnum.ADMIN],
  },
  {
    href: "/company",
    icon: CompanyIcon,
    label: "Organization",
    activeIcon: CompanyActiveIcon,
    access: [RoleEnum.ADMIN],
  },
  {
    href: "/projects",
    icon: ProjectsIcon,
    label: "Projects",
    activeIcon: ProjectsActiveIcon,
    access: [RoleEnum.ADMIN],
  },
  {
    href: "/team_workspace",
    icon: TeamWorkSpaceIcon,
    label: "Team Workspace",
    activeIcon: TeamWorkSpaceActiveIcon,
    access: [RoleEnum.MANAGER],
  },
  {
    href: "/approvals",
    icon: ApprovalsIcon,
    label: "Approvals",
    activeIcon: ApprovalsActiveIcon,
    access: [RoleEnum.MANAGER],
  },
  {
    href: "/reports",
    icon: ReportsIcon,
    label: "Reports",
    activeIcon: ReportsActiveIcon,
    access: [RoleEnum.USER, RoleEnum.MANAGER],
  },

  {
    href: "/mileage",
    icon: FuelPump,
    label: "Mileage Calculator",
    activeIcon: FuelPumpActive,
    access: [RoleEnum.USER, RoleEnum.MANAGER],
  },
];

export const PER_PAGE_OPTIONS = ["5", "10", "15", "20"];
export const PROJECTS_LIST_PER_PAGE_OPTIONS = ["6", "12", "18", "24"];

const normalizedBasePath =
  import.meta.env.VITE_BASE_URL === "/"
    ? ""
    : import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

export const ASSET_PATH = `${normalizedBasePath}/assets`;
export const CLIENT_LOGO = `${ASSET_PATH}/icons/yavar.svg`;
export const APP_LOGO = `${ASSET_PATH}/icons/z-logo.svg`;

export const ALLOWED_FILE_TYPES = [
  ".pdf",
  // ".doc",
  // ".docx",
  // ".xls",
  // ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  // ".bmp",
  // ".heic",
  // ".txt",
  // ".csv",
];

export const TRANSACT_PROJECT_KEY = "transact";

export const DocumentStatus = {
  UPLOADED: "Uploaded",
  EXTRACTING: "Extracting",
  EXTRACTED: "Extracted",
  SPLITTING: "Splitting",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DEBOUNCED_SEARCH_DELAY_TIME = 1000;

export const PROJECTS_LIST_API_QUERY_KEY = "projects";

export const CURRENT_USER_PROJECTS_LIST_API_QUERY_KEY = "my-projects";

export const PROJECT_FORM_DEFAULTS = {
  name: "",
  description: "",
  code: "",
  manager: null,
  monthly_budget: 0,
  total_budget: 0,
  members: [],
  approvers: [],
};

export const supportedFormats = [
  "pdf",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "txt",
  "png",
];

export const EMPTY_PLACEHOLDER = "--";

export const ALLOWED_KEYS_NUMBERS_ONLY_INPUT = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
  "Home",
  "End",
];

export const CURRENT_USER_QUERY = "currentUser";

export enum FLIGHT_CLASS_ENUM {
  ECONOMY = "economy",
  PREMIUM_ECONOMY = "premium_economy",
  BUSINESS = "business",
}

export enum TRAIN_CLASS_ENUM {
  TIER_3 = "tier_3",
  TIER_2 = "tier_2",
  TIER_1 = "tier_1",
}

export const FLIGHT_CLASS_ALLOWANCE_OPTIONS = [
  {
    label: "Economy",
    value: FLIGHT_CLASS_ENUM.ECONOMY,
  },
  {
    label: "Premium Economy",
    value: FLIGHT_CLASS_ENUM.PREMIUM_ECONOMY,
  },
  { label: "Business", value: FLIGHT_CLASS_ENUM.BUSINESS },
];

export const TRAIN_CLASS_ALLOWANCE_OPTIONS = [
  { label: "Tier 3", value: TRAIN_CLASS_ENUM.TIER_3 },
  { label: "Tier 2", value: TRAIN_CLASS_ENUM.TIER_2 },
  { label: "Tier 1", value: TRAIN_CLASS_ENUM.TIER_1 },
];

export const AUTO_APPROVAL_THRESHOLD_TYPE_OPTIONS = [
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Daily",
    value: "daily",
  },
];

export const GRADE_FORM_DEFAULT_VALUES = {
  name: "",
  expense_max_daily_limit: 0,
  expense_max_monthly_limit: 0,
  auto_approval_threshold_type: AUTO_APPROVAL_THRESHOLD_TYPE_OPTIONS[0],
  flight_class_allowance: FLIGHT_CLASS_ALLOWANCE_OPTIONS[0],
  train_class_allowance: TRAIN_CLASS_ALLOWANCE_OPTIONS[0],
  domestic_limit: 0,
  international_limit: 0,
  food_max_daily_limit: 0,
  car_mileage_rate: 0,
  bike_mileage_rate: 0,
};

export const GRADS_LIST_API_QUERY_KEY = "grades";
export const EXPENSE_DETAILS_QUERY_KEY = "expense-details";

export const TEAM_EXPENSES_LIST_QUERY_KEY = "team-expenses-list";

export enum ReimbursementStatusEnum {
  UPLOADED = "Uploaded",
  EXTRACTING = "Extracting",
  EXTRACTED = "Extracted",
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum TRAVEL_EXPENSE_STATUS {
  DRAFTED = "drafted",
  SUBMITTED = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export const MILEAGE_EXPENSES_LIST_QUERY_KEY = "mileage-expenses";
export const EMPLOYEES_LIST_API_QUERY_KEY = "employees";
export const EMPLOYEE_DASHBOARD_API_QUERY_KEY = "employee-dashboard";
export const TEAM_MEMBERS_LIST_API_QUERY_KEY = "teamMembers";
export const PER_PAGE = 10;
export const PROJECTS_LIST_PER_PAGE = 6;

export enum EMPLOYEE_STATUS_ENUM {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
}

export enum ACCOMMODATION_TYPE_ENUM {
  DOMESTIC = "domestic",
  INTERNATIONAL = "international",
}

export const ACCOMMODATION_TYPE_OPTIONS = [
  {
    label: "Domestic",
    value: ACCOMMODATION_TYPE_ENUM.DOMESTIC,
  },
  {
    label: "International",
    value: ACCOMMODATION_TYPE_ENUM.INTERNATIONAL,
  },
];

export const ROLE_PERMISSIONS: Record<RoleEnum, string[]> = {
  [RoleEnum.ADMIN]: [
    "Full Access",
    "Manage Employees",
    "Manage Policies",
    "View Integrations",
    "Add Integration",
    "Access Admin Dashboard",
    "Access Company Assets",
  ],
  [RoleEnum.MANAGER]: [
    "Limited Access",
    "Create Expense",
    "Approve Expense",
    "View Others Expenses",
    "Submit Mileage",
    "Approve Mileage",
    "View Integrations",
  ],
  [RoleEnum.USER]: ["View Only", "Create Expense", "Submit Mileage"],
  [RoleEnum.FINANCER]: [
    "Issue Advances",
    "View Advance Requests",
    "Manage Settlements",
    "View Financial Reports",
  ],
};
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE: ReimbursementColumnFilters =
  {
    status: [],
    categories: [],
    subCategories: [],
    projects: [],
    approvalStatus: [],
  };

export const CATEGORIES_FILTER = [
  {
    label: "Travel",
    value: CATEGORY.TRAVEL,
  },
  {
    label: "Hotel accommodation",
    value: CATEGORY.HOTEL_ACCOMMODATION,
  },
  {
    label: "Meals food",
    value: CATEGORY.MEALS_FOOD,
  },
];

export const TRAVEL_SUB_CATEGORIES_FILTER = [
  {
    label: "Auto bike taxi",
    value: SUB_CATEGORY.AUTO_BIKE_TAXI,
  },
  {
    label: "Bus",
    value: SUB_CATEGORY.BUS,
  },
  {
    label: "Train",
    value: SUB_CATEGORY.TRAIN,
  },
  {
    label: "Flight invoice",
    value: SUB_CATEGORY.FLIGHT_INVOICE,
  },
  {
    label: "Flight receipt",
    value: SUB_CATEGORY.FLIGHT_RECEIPT,
  },
];

export const HOTEL_ACCOMMODATION_SUB_CATEGORIES_FILTER = [
  {
    label: "Invoice",
    value: SUB_CATEGORY.INVOICE,
  },
  {
    label: "Receipt",
    value: SUB_CATEGORY.RECEIPT,
  },
];

export const SUB_CATEGORIES_FILTER: Record<
  string,
  SelectOption<SUB_CATEGORY>[]
> = {
  [CATEGORY.TRAVEL]: TRAVEL_SUB_CATEGORIES_FILTER,
  [CATEGORY.HOTEL_ACCOMMODATION]: HOTEL_ACCOMMODATION_SUB_CATEGORIES_FILTER,
};

export const ROLE_PERMISSIONS_COLORS: Record<string, string> = {
  ["Full Access"]: "bg-mint-frost text-forest-fern",
  ["Limited Access"]: "bg-light-golden-yellow text-chestnut-brown",
  ["View Only"]: "bg-pale-aqua text-deep-indigo-gray",
};

export enum SORTING_ORDER_ENUM {
  ASC = "asc",
  DESC = "desc",
}

export const UPLOADED_DOCUMENTS_STATUS_FILTERS = [
  DocumentStatus.UPLOADED,
  DocumentStatus.EXTRACTED,
  DocumentStatus.EXTRACTING,
];

export const PROJECT_DETAIL_API_QUERY_KEY = "project-detail";

export const combinedSpendingOverviewChartConfig = {
  expense: {
    label: "Expense",
    color: "#773DD0",
  },
} satisfies ChartConfig;

export const EMPTY_STATE_MAP: Record<
  EmptyStateType,
  {
    icon: React.ElementType;
    title: string;
    description: string;
  }
> = {
  "no-documents": {
    icon: Files,
    title: "No expenses uploaded",
    description:
      "You haven't uploaded any expense bills yet. Start by uploading your first file.",
  },
  "no-document": {
    icon: Files,
    title: "Expense not found",
    description: "We couldn't find any expense document for this entry.",
  },
  "no-selection": {
    icon: FileSearchIcon,
    title: "No expense selected",
    description: "Choose an expense from the list to view its details.",
  },
  "no-data": {
    icon: HandCoins,
    title: "No data",
    description: "You haven't spent anything yet",
  },
  "no-chart-data": {
    icon: HandCoins,
    title: "No chart Data",
    description: "You haven't spent anything yet",
  },
  "no-extracted-document-data": {
    icon: HandCoins,
    title: "No extracted document data",
    description: "There is no data in this extracted document",
  },
  Approved: {
    icon: FileText,
    title: "No approved reimbursements yet",
    description: "Once reimbursements are approved, they'll appear here.",
  },
  Pending: {
    icon: FileText,
    title: "No pending reimbursements.",
    description: "Pending reimbursements will show up here.",
  },
  Rejected: {
    icon: FileText,
    title: "No rejected reimbursements",
    description: "Rejected reimbursement will show up here",
  },
  "no-employees": {
    icon: Users,
    title: "No Employees found",
    description: "No employee entries are available for the current filters.",
  },
  "no-grades": {
    icon: CircleStar,
    title: "No Grades Found",
    description: "No grade entries are available for the current filters.",
  },
  "no-projects": {
    icon: Users,
    title: "No Projects created Yet",
    description:
      "Add a new project to begin managing projects, assign owners, set budgets, and define approval flows.",
  },
  "no-company-assets": {
    icon: Users,
    title: "No Company Assets Found",
    description:
      "Nothing has been configured yet. Add your first company card, vehicle, or asset to begin.",
  },
  "no-cost-centers": {
    icon: Users,
    title: "No Cost Centers Found",
    description:
      "Nothing has been configured yet. Add your first cost center to begin.",
  },
  "no-project-overviews": {
    icon: Users,
    title: "No Project overviews created Yet",
    description:
      "Add a new project to begin managing projects, assign owners, set budgets, and define approval flows.",
  },
  "no-departments": {
    icon: Users,
    title: "No Departments Found",
    description:
      "Nothing has been configured yet. Add your first department to begin.",
  },
  "no-notification": {
    icon: BellOff,
    title: "No Notifications",
    description:
      "You're all caught up! There are no notifications to display at the moment.",
  },
  APPROVED: {
    icon: FileText,
    title: "No approved expenses yet",
    description: "Once expenses are approved, they'll appear here.",
  },
  PENDING: {
    icon: FileText,
    title: "No pending expenses.",
    description: "Pending expenses will show up here.",
  },
  REJECTED: {
    icon: FileText,
    title: "No rejected expenses",
    description: "Rejected expenses will show up here",
  },
  "no-cost-center-overviews": {
    icon: Users,
    title: "No Cost Center created Yet",
    description:
      "Add a new cost center to begin managing cost centers, assign allocated budgets, and track expenses against them.",
  },
  "no-trip": {
    icon: Backpack,
    title: "No travel request found",
    description: "No travel request found for the current filters.",
  },
  "no-advance": {
    icon: Wallet,
    title: "No advance found",
    description: "No advance found for the current filters.",
  },
};

export const VIEW_AS_USER_KEY = "view_as_user";
