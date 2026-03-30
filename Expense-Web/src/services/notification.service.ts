import axiosInstance from "@/lib/axios";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import type {
  AppNotification,
  TotalReadResponse,
  NotificationResponse,
} from "@/components/common/Notification/types/notification.types";

export const getNotifications = async ({ page = 1, perPage = 100 }) => {
  const response = await axiosInstance.get<NotificationResponse>(
    ENDPOINTS.NOTIFICATIONS.LIST,
    {
      params: {
        page,
        per_page: perPage,
      },
    },
  );
  return response.data;
};

export const markNotificationAsRead = async (id: number) => {
  const response = await axiosInstance.patch<AppNotification>(
    ENDPOINTS.NOTIFICATIONS.READ(id),
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch<TotalReadResponse>(
    ENDPOINTS.NOTIFICATIONS.READ_ALL,
  );
  return response.data;
};
