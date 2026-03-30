import CarIcon from "/assets/icons/car.svg";
import FuelIcon from "/assets/icons/fuel.svg";
import CreditCardIcon from "/assets/icons/credit-card.svg";
import AutomotiveBatteryIcon from "/assets/icons/automotive-battery-small.svg";
import AlertIcon from "/assets/icons/alert-outline.svg";
import CashIcon from "/assets/icons/cash-gradient.svg";
import CheckmarkBadgeIcon from "/assets/icons/checkmark-badge-outline.svg";
import type { ChartConfig } from "@/components/ui/chart";

export const quickActions: QuickActionsItem[] = [
  {
    href: "",
    icon: CreditCardIcon,
    label: "Credit card",
  },
  {
    href: "",
    icon: FuelIcon,
    label: "Fuel card",
  },
  {
    href: "",
    icon: CarIcon,
    label: "Company car",
  },
  {
    href: "",
    icon: AutomotiveBatteryIcon,
    label: "Generator",
  },
];

export const alerts: AlertItem[] = [
  {
    imgSrc: AlertIcon,
    message: "2 fuel card transactions exceeded the daily limit.",
    type: "warning",
  },
  {
    imgSrc: CashIcon,
    message: "7 reimbursement requests are awaiting your approval.",
    type: "normal",
  },
  {
    imgSrc: AlertIcon,
    message: "4 newly added employees do not have grades assigned.",
    type: "warning",
  },
  {
    imgSrc: CreditCardIcon,
    message:
      "Corporate Card Usage Policy (POL-003) is due for review next month.",
    type: "normal",
  },
  {
    imgSrc: CheckmarkBadgeIcon,
    message: "Project PC-2097 was successfully created.",
    type: "normal",
  },
  {
    imgSrc: CheckmarkBadgeIcon,
    message: "Latest corporate card transactions synced successfully.",
    type: "normal",
  },
  {
    imgSrc: FuelIcon,
    message: "Fuel limit revised for Company Car (TN05 BB 8821).",
    type: "normal",
  },
  {
    imgSrc: AlertIcon,
    message: "Generator GEN-04 has crossed the monthly fuel allocation.",
    type: "warning",
  },
  {
    imgSrc: CreditCardIcon,
    message:
      "New corporate card transactions from Innova Solutions are now available.",
    type: "normal",
  },
];

export enum COMPANY_ASSET_CATEGORY {
  VEHICLE = "vehicle",
  GENERATOR = "generator",
}

export const companyAssetChartConfig = {
  [COMPANY_ASSET_CATEGORY.VEHICLE]: {
    label: "Vehicle",
  },
  [COMPANY_ASSET_CATEGORY.GENERATOR]: {
    label: "Generator",
  },
} satisfies ChartConfig;

export const COMPANY_ASSET_COLORS = [
  "#D1A1F0",
  "#F6E6FF",
  "#D080FF",
  "#E4C5F7",
];
