import type { ApprovalStatusEnum } from "../../Extraction/helpers/constants/extraction";
import type { FuelGasResponseData } from "@/types/document-response.types";
import type { CATEGORY, SUB_CATEGORY } from "../helpers/constants/expenseView";
import type { ReimbursementStatusEnum } from "@/helpers/constants/common";
import type { CurrentUserProject } from "@/types/common.types";
import type { TripInfo } from "../../Trip/helpers/types/trips.type";

export interface ExpenseDetailUser {
  id: number;
  email: string;
  amount: number;
  status: ReimbursementStatusEnum;
}

export type ExpenseData =
  | AutoBikeTaxiResponseData
  | BusResponseData
  | TrainResponseData
  | MealFoodResponseData
  | HotelInvoiceResponseData
  | HotelReceiptResponseData
  | StationeryResponseData
  | FlightInvoiceResponseData
  | FlightReceiptResponseData
  | FuelGasResponseData
  | GeneralResponseData;

type FlightClass = "economy" | "premium_economy" | "business";

type TrainClass = "tier_3" | "tier_2" | "tier_1";

type AccommodationType = "domestic" | "international";

export interface ExpenseApprover {
  id: number;
  status: ApprovalStatusEnum;
  last_name: string;
  first_name: string;
  approval_level: number;
}

interface ExpenseDetailsBase {
  id: number;
  name: string;
  url: string;
  status: ReimbursementStatusEnum;
  format: string;
  category: CATEGORY;
  sub_category: SUB_CATEGORY | null;
  total_amount: string;
  currency: string;
  scope: string;
  users: ExpenseDetailUser[];
  created_at: string;
  updated_at: string;
  data: ExpenseData;
  note: string | null;
  overall_document_confidence: number;
  verifiability_message: string;
  approvers: ExpenseApprover[];
  next_id: number | null;
  prev_id: number | null;
  bill_date: string;
  project: CurrentUserProject | null;
  trip: TripInfo | null;
  train_class?: TrainClass;
  flight_class?: FlightClass;
  accommodation_type?: AccommodationType;
  user_expense_id: number;
}

export type ExpenseDetails =
  | MealsFoodExpense
  | StationeryExpense
  | TrainExpense
  | FlightInvoiceExpense
  | FlightReceiptExpense
  | TravelOtherExpense
  | BusExpense
  | AutoBikeTaxiExpense
  | HotelInvoiceExpense
  | HotelOtherExpense
  | HotelReceiptExpense
  | GeneralExpense
  | FuelGasExpense;

export interface ApproverInfoItem {
  status: ApprovalStatusEnum;
  first_name: string;
  approval_level: number;
}

export type ApproverInfoList = ApproverInfoItem[];

// Meals Food Category

interface MealsFoodExpense extends ExpenseDetailsBase {
  category: CATEGORY.MEALS_FOOD;
  data: MealFoodResponseData;
}

// Stationery Category

interface StationeryExpense extends ExpenseDetailsBase {
  category: CATEGORY.STATIONERY;
  data: StationeryResponseData;
}

// Travel Category

interface TrainExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: SUB_CATEGORY.TRAIN;
  data: TrainResponseData;
}

interface FlightInvoiceExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: SUB_CATEGORY.FLIGHT_INVOICE;
  data: FlightInvoiceResponseData;
}

interface FlightReceiptExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: SUB_CATEGORY.FLIGHT_RECEIPT;
  data: FlightReceiptResponseData;
}

interface BusExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: SUB_CATEGORY.BUS;
  data: BusResponseData;
}

interface AutoBikeTaxiExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: SUB_CATEGORY.AUTO_BIKE_TAXI;
  data: AutoBikeTaxiResponseData;
}

interface TravelOtherExpense extends ExpenseDetailsBase {
  category: CATEGORY.TRAVEL;
  sub_category: null;
  data: GeneralResponseData;
}
// Hotel Accommodation Category

interface HotelInvoiceExpense extends ExpenseDetailsBase {
  category: CATEGORY.HOTEL_ACCOMMODATION;
  sub_category: SUB_CATEGORY.INVOICE;
  data: HotelInvoiceResponseData;
}

interface HotelReceiptExpense extends ExpenseDetailsBase {
  category: CATEGORY.HOTEL_ACCOMMODATION;
  sub_category: SUB_CATEGORY.RECEIPT;
  data: HotelReceiptResponseData;
}

interface HotelOtherExpense extends ExpenseDetailsBase {
  category: CATEGORY.HOTEL_ACCOMMODATION;
  sub_category: null;
  data: GeneralResponseData;
}

// Fuel Gas Category

interface FuelGasExpense extends ExpenseDetailsBase {
  category: CATEGORY.FUEL_GAS;
  sub_category: null;
  data: FuelGasResponseData;
}

// Others Category

interface GeneralExpense extends ExpenseDetailsBase {
  category: CATEGORY.OTHERS;
  data: GeneralResponseData;
}
