import React from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cn,
  notifyError,
  formatApiError,
  formatNotificationDate,
} from "@/lib/utils";
import type { NotificationItemProps } from "../types/notification.types";
import { markNotificationAsRead } from "@/services/notification.service";
import {
  NOTIFICATION_ICON_MAP,
  NOTIFICATION_QUERY_KEY,
} from "@/helpers/constants/notification";

const NotificationItem: React.FC<NotificationItemProps> = ({
  truncate = false,
  notification,
}) => {
  const queryClient = useQueryClient();

  const { mutate: markAsReadMutation, isPending: isMarkingPending } =
    useMutation({
      mutationFn: () => markNotificationAsRead(notification.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError(
          "Failed to mark notification as read",
          formatApiError(error),
        );
      },
    });

  const handleRead = () => {
    if (!notification.is_read && !isMarkingPending) {
      markAsReadMutation();
    }
  };
  const { icon, title } = NOTIFICATION_ICON_MAP[notification.type];

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl px-3 py-5",
        !notification.is_read && "bg-arctic-mist cursor-pointer",
        notification.is_read && "rounded-none border-b",
        isMarkingPending && "animate-pulse",
      )}
      onClick={handleRead}
    >
      <div className="bg-light-pink flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <img src={icon} alt="icon" />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-black">{title}</p>
          <p className="text-ash-gray text-[10px] font-medium">
            {formatNotificationDate(notification.created_at)}
          </p>
        </div>
        <p
          className={cn(
            "text-sm text-black",
            truncate ? "line-clamp-2" : "wrap-break-word",
          )}
        >
          {notification.message}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
