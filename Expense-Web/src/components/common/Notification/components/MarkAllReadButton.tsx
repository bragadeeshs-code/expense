import React from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";
import { cn, formatApiError, notifyError } from "@/lib/utils";
import { markAllNotificationsAsRead } from "@/services/notification.service";
import { NOTIFICATION_QUERY_KEY } from "@/helpers/constants/notification";

interface MarkAllReadButtonProps {
  className?: string;
  textClassName?: string;
}

const MarkAllReadButton: React.FC<MarkAllReadButtonProps> = ({
  className,
  textClassName,
}) => {
  const queryClient = useQueryClient();

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Failed to mark all as read", formatApiError(error));
    },
  });

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!markAllReadMutation.isPending) {
      markAllReadMutation.mutate();
    }
  };

  return (
    <Button
      variant={"ghost"}
      onClick={handleMarkAllRead}
      disabled={markAllReadMutation.isPending}
      className={cn(
        "text-indigo-violet flex items-center gap-2 p-0 hover:bg-transparent disabled:opacity-50",
        className,
      )}
    >
      <img src={`${ASSET_PATH}/icons/tick-double.svg`} alt="all-read" />
      <span
        className={cn(
          "bg-clip-text font-medium text-transparent",
          !markAllReadMutation.isPending
            ? "[background-image:var(--gradient-primary)]"
            : "bg-slate-400",
          textClassName,
        )}
      >
        {markAllReadMutation.isPending ? "Marking all..." : "Mark all as read"}
      </span>
    </Button>
  );
};

export default MarkAllReadButton;
