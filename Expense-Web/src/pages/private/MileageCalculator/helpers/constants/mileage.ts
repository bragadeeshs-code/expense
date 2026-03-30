import type { SelectOption } from "@/types/common.types";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";
import type {
  MileageColumnFilters,
  TravelExpenseStatusFilter,
} from "../types/mileage.types";

export enum EXPENSE_TRAVEL_ENUM {
  MY_TRAVEL = "my_travel",
  TEAM_TRAVEL = "team_travel",
}

export const VEHICLES: SelectOption[] = [
  { label: "CAR", value: "CAR" },
  { label: "BIKE", value: "BIKE" },
];

export const VEHICLE_TYPES: SelectOption[] = [
  { label: "PERSONAL", value: "PERSONAL" },
  { label: "COMPANY", value: "COMPANY" },
];

export const MILEAGE_FORM_DEFAULTS: MileageExpenseFormValues = {
  customer_name: "",
  project: null,
  from_date: null,
  to_date: null,
  from_location: null,
  to_location: null,
  vehicle_type: null,
  vehicle: null,
  distance: 0,
  amount: 0,
  duration_seconds: 0,
};

export const MileageExpenseTabs: TabItem<TravelExpenseStatusFilter>[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: TRAVEL_EXPENSE_STATUS.DRAFTED },
  { label: "Pending", value: TRAVEL_EXPENSE_STATUS.SUBMITTED },
  { label: "Approved", value: TRAVEL_EXPENSE_STATUS.APPROVED },
  { label: "Rejected", value: TRAVEL_EXPENSE_STATUS.REJECTED },
];

export const MILEAGE_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { label: "Draft", value: TRAVEL_EXPENSE_STATUS.DRAFTED },
  { label: "Pending", value: TRAVEL_EXPENSE_STATUS.SUBMITTED },
  { label: "Approved", value: TRAVEL_EXPENSE_STATUS.APPROVED },
  { label: "Rejected", value: TRAVEL_EXPENSE_STATUS.REJECTED },
];

export const MILEAGE_TOP_TABS: TabItem<EXPENSE_TRAVEL_ENUM>[] = [
  { label: "My Travel", value: EXPENSE_TRAVEL_ENUM.MY_TRAVEL },
  { label: "Team Travel", value: EXPENSE_TRAVEL_ENUM.TEAM_TRAVEL },
];

export const STATIC_COST_CENTERS = [
  { label: "CC-1784", value: "CC-1784" },
  { label: "CC-1785", value: "CC-1785" },
  { label: "CC-1786", value: "CC-1786" },
];

export const MILEAGE_STATUS_STYLES: Record<TRAVEL_EXPENSE_STATUS, string> = {
  [TRAVEL_EXPENSE_STATUS.DRAFTED]: "bg-light-golden-yellow text-chestnut-brown",
  [TRAVEL_EXPENSE_STATUS.SUBMITTED]: "bg-pale-aqua text-deep-indigo-gray",
  [TRAVEL_EXPENSE_STATUS.APPROVED]: "bg-mint-frost text-forest-fern",
  [TRAVEL_EXPENSE_STATUS.REJECTED]: "bg-soft-coral-cream text-cherry-red",
};

export const MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE: MileageColumnFilters = {
  status: [],
  fromDate: "",
  projects: [],
};
