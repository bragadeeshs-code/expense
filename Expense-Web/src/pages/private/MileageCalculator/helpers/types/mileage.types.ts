import type { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import type {
  CurrentUserProject,
  ListFilters,
  SelectOption,
} from "@/types/common.types";

export type MapLocationPoint = "from" | "to" | null;

export interface MileageProject {
  id: number;
  name: string;
}

export interface MileageProjectsResponse {
  data: MileageProject[];
}

export interface MileageLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface MileageExpensePayload {
  from_date: string;
  to_date: string;
  from_location: MileageLocation;
  to_location: MileageLocation;
  vehicle: string;
  vehicle_type: string;
  distance: number;
  customer_name: string;
  project_id: number;
  duration_seconds: number;
}

export interface MileageExpenseResponse {
  message: string;
}

export interface TimelinePoint {
  title: string;
  address: string;
  time: string;
  type: "square" | "navigation";
}

export interface TravelExpenseListItem {
  id: number;
  from_location: MileageLocation;
  to_location: MileageLocation;
  from_date: string;
  to_date: string;
  vehicle: string;
  vehicle_type: string;
  status: string;
  amount: string;
  distance: string;
  customer_name: string;
  scope?: string;
  mileage?: string;
  carbon_emission?: string;
  activity_time?: string;
  duration_seconds?: number;
  project_id?: number;
  project_name?: string;
  activity_log?: TimelinePoint[];
  activities?: TimelinePoint[];
}

export interface TravelExpensesResponse {
  total: number;
  page: number;
  per_page: number;
  has_next_page: boolean;
  data: TravelExpenseListItem[];
}

export type TravelExpenseDetailResponse = TravelExpenseListItem;

export interface TripComment {
  id: number;
  text: string;
  userName: string;
  timestamp: string;
  isCurrentUser: boolean;
  fileName?: string | null;
  fileUrl?: string | null;
}

export interface MileageRateResponse {
  car_mileage_rate: string;
  bike_mileage_rate: string;
}

export interface TravelExpenseNote {
  notes: string;
  created_by: string;
  created_at: string;
  created_by_id: number;
  file_name: string | null;
  file_url: string | null;
}

export interface AddTravelExpenseNotePayload {
  notes?: string;
  expense_id: number;
  file?: File;
}

export interface AddTravelExpenseNoteResponse {
  message: string;
}

export interface IndividualDashboardMetrics {
  total_claim_amount: string;
  total_distance: string;
  total_carbon_emission?: string;
}

export interface TeamDashboardMetrics {
  total_distance: string;
  total_claim_amount: string;
  total_approved_amount: string;
  pending_count: number;
  total_carbon_emission?: string;
}

export type TravelExpenseModalType = "approve" | "reject" | "request" | null;

export type TravelExpenseStatusFilter = TRAVEL_EXPENSE_STATUS | "all";

export interface MileageExpenseListFilters extends ListFilters {
  status: TravelExpenseStatusFilter;
  columnFilters: MileageColumnFilters;
}

export interface MileageColumnFilters {
  status: SelectOption<TRAVEL_EXPENSE_STATUS>[];
  fromDate?: string;
  projects: CurrentUserProject[];
}
