import { ASSET_PATH } from "./common";
import type { NotificationIconMap } from "@/components/common/Notification/types/notification.types";

export enum NotificationTypeEnum {
  INFO = "Info",
  SUBMIT_FOR_APPROVAL = "submit_for_approval",
}

export const NOTIFICATION_ICON_MAP: Record<
  NotificationTypeEnum,
  NotificationIconMap
> = {
  [NotificationTypeEnum.INFO]: {
    icon: `${ASSET_PATH}/icons/fuel_pump_outline.svg`,
    title: "New Mileage Claim Submitted",
  },
  [NotificationTypeEnum.SUBMIT_FOR_APPROVAL]: {
    icon: `${ASSET_PATH}/icons/invoice.svg`,
    title: "Submit for Approval",
  },
};

export const NOTIFICATION_QUERY_KEY = "notifications";
