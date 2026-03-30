import type { NotificationTypeEnum } from "@/helpers/constants/notification";

export interface NotificationItemProps {
  truncate: boolean;
  notification: AppNotification;
}

export interface NotificationResponse {
  page: number;
  total: number;
  per_page: number;
  has_next_page: boolean;
  notifications: AppNotification[];
}

export interface TotalReadResponse {
  total_read: number;
}

export type AppNotification = InfoNotification | SubmitForApprovalNotification;

export interface NotificationBase {
  id: number;
  type: NotificationTypeEnum;
  meta_data: NotificationMetaData;
  created_at: string;
  is_read: boolean;
  message: string;
}

export interface InfoNotificationMetaData {
  expense_id: number;
  sender: string;
}

export interface SubmitForApprovalNotificationMetaData {
  user_expense_id: number;
}

export interface InfoNotification extends NotificationBase {
  type: NotificationTypeEnum.INFO;
  meta_data: InfoNotificationMetaData;
}

export interface SubmitForApprovalNotification extends NotificationBase {
  type: NotificationTypeEnum.SUBMIT_FOR_APPROVAL;
  meta_data: SubmitForApprovalNotificationMetaData;
}

export type NotificationMetaData =
  | InfoNotificationMetaData
  | SubmitForApprovalNotificationMetaData;

export interface NotificationIconMap {
  icon: string;
  title: string;
}
