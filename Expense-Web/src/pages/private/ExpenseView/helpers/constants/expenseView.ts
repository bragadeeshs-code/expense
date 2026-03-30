import { CheckCircle2, Hourglass, XCircle } from "lucide-react";
import { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";

export const statusConfig = {
  [ApprovalStatusEnum.PENDING]: {
    color: "bg-slate-gray text-white",
    icon: Hourglass,
    label: "Pending",
  },
  [ApprovalStatusEnum.APPROVED]: {
    color: "bg-kelly-green text-white",
    icon: CheckCircle2,
    label: "Approved",
  },
  [ApprovalStatusEnum.REJECTED]: {
    color: "bg-cherry-red text-white",
    icon: XCircle,
    label: "Rejected",
  },
};

export enum CATEGORY {
  TRAVEL = "travel",
  HOTEL_ACCOMMODATION = "hotel_accommodation",
  MEALS_FOOD = "meals_food",
  STATIONERY = "stationery",
  FUEL_GAS = "fuel_gas",
  OTHERS = "others",
}

export enum SUB_CATEGORY {
  GENERAL = "general",
  AUTO_BIKE_TAXI = "auto_bike_taxi",
  BUS = "bus",
  TRAIN = "train",
  FLIGHT_INVOICE = "flight_invoice",
  FLIGHT_RECEIPT = "flight_receipt",
  INVOICE = "invoice",
  RECEIPT = "receipt",
}

export const HIDDEN_SCOPE_CATEGORIES = [CATEGORY.MEALS_FOOD];

export const SUPPORTED_CATEGORIES_FOR_OTHERS_TEMPLATE = [CATEGORY.OTHERS];

export const SUPPORTED_SUB_CATEGORIES_FOR_OTHERS_TEMPLATE = [
  SUB_CATEGORY.GENERAL,
];
