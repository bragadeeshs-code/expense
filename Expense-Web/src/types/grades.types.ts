import type {
  TRAIN_CLASS_ENUM,
  FLIGHT_CLASS_ENUM,
} from "@/helpers/constants/common";
import type { Pagination } from "./common.types";

export interface GradeBase {
  name: string;
  train_class: TRAIN_CLASS_ENUM;
  flight_class: FLIGHT_CLASS_ENUM;
  auto_approval_threshold_type: string;
}

export interface GradeItem extends GradeBase {
  id: number;
  daily_limit: string;
  monthly_limit: string;
  domestic_accommodation_limit: string;
  international_accommodation_limit: string;
  food_daily_limit: string;
  car_mileage_rate: string;
  bike_mileage_rate: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface GradesListResponse extends Pagination {
  data: GradeItem[];
}

export interface DeleteGradeResponse {
  id: number;
}

export interface GradeParams extends GradeBase {
  daily_limit: number;
  monthly_limit: number;
  domestic_accommodation_limit: number;
  international_accommodation_limit: number;
  food_daily_limit: number;
  car_mileage_rate: number;
  bike_mileage_rate: number;
}

export interface UpdateNewGradeParams {
  gradeId: number;
  gradeParams: GradeParams;
}
