import type { Pagination } from "@/types/common.types";
import type { ProjectInfo } from "@/types/projects.types";
import type { MODE_OF_TRAVEL_ENUM, TRIP_STATUS_ENUM } from "../constants/trips";

export interface TripBase {
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  hotel_accommodation_needed: boolean;
  mode_of_travel: MODE_OF_TRAVEL_ENUM;
  vehicle_needed: boolean;
  advance_needed: boolean;
  advance_amount: string | null;
  project_id: number;
}

export interface TripResponse extends TripBase {
  id: number;
  status: TRIP_STATUS_ENUM;
  created_at: string;
  updated_at: string;
}

export interface TripItem extends Omit<TripResponse, "project_id"> {
  project: ProjectInfo;
}

export interface TripsListResponse extends Pagination {
  data: TripItem[];
}
export interface TeamTripItem extends Omit<TripItem, "project"> {
  project_code: string;
  submitted_by: string;
  status: TRIP_STATUS_ENUM;
}

export interface TeamTripsListResponse extends Pagination {
  data: TeamTripItem[];
}

export interface TripUpdateParams {
  id: number;
  data: TripBase;
}

export interface DeleteTripResponse {
  id: number;
}

export interface TripStatusUpdateParams {
  id: number;
  status: TRIP_STATUS_ENUM;
}

export interface TripInfo {
  id: number;
  destination: string;
}

export type TripOptions = TripInfo[];
