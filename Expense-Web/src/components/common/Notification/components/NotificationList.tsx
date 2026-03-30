import type { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { getNotifications } from "@/services/notification.service";
import { NOTIFICATION_QUERY_KEY } from "@/helpers/constants/notification";
import type { NotificationResponse } from "../types/notification.types";
import { cn, formatApiError, notifyError } from "@/lib/utils";

import EmptyState from "@/pages/private/Extraction/components/EmptyState";
import NotificationItem from "./NotificationItem";

interface Props {
  perPage?: number;
  truncateItems?: boolean;
  loadingText?: string;
  className?: string;
  listWrapperClassName?: string;
  onViewMoreClick?: () => void;
}

const NotificationList: React.FC<Props> = ({
  perPage = 100,
  className,
  loadingText = "Checking for new messages...",
  truncateItems = false,
  listWrapperClassName,
  onViewMoreClick,
}) => {
  const {
    data: notifications,
    isLoading: isNotificationLoading,
    error: notificationError,
  } = useQuery<NotificationResponse, AxiosError<APIErrorResponse>>({
    queryKey: [NOTIFICATION_QUERY_KEY, perPage],
    queryFn: () => getNotifications({ perPage }),
  });

  useEffect(() => {
    if (notificationError) {
      notifyError(
        "Failed to fetch notifications",
        formatApiError(notificationError),
      );
    }
  }, [notificationError]);

  const total = notifications?.total || 0;

  if (isNotificationLoading) {
    return (
      <p
        className={cn(
          "text-ash-gray mx-auto flex h-full w-full animate-pulse items-center justify-center py-8 text-center text-sm font-medium",
          className,
        )}
      >
        {loadingText}
      </p>
    );
  }

  if (!notifications || notifications.notifications.length === 0) {
    return (
      <div className="mx-auto flex h-full w-fit items-center justify-center">
        <EmptyState type="no-notification" />
      </div>
    );
  }

  return (
    <div className={cn("mx-auto h-full transition-all", className)}>
      <div
        className={cn(
          "space-y-1 overflow-hidden rounded-2xl",
          listWrapperClassName,
        )}
      >
        {notifications.notifications.map((notification) => {
          return (
            <NotificationItem
              key={notification.id}
              notification={notification}
              truncate={truncateItems}
            />
          );
        })}
      </div>
      {onViewMoreClick && total > perPage && (
        <div className="border-porcelain border-t p-3">
          <Button
            variant="ghost"
            onClick={onViewMoreClick}
            className="text-indigo-violet w-full text-sm font-bold hover:bg-slate-50"
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
