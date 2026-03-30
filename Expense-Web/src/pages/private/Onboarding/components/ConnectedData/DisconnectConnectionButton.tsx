import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Loader, Unplug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { notifySuccess, notifyError, formatApiError } from "@/lib/utils";
import { disconnectConnection } from "@/services/connection.service";

type DisconnectConnectionButtonProps = {
  connectionId: number;
  onSuccess: () => void;
};

const DisconnectConnectionButton: React.FC<DisconnectConnectionButtonProps> = ({
  onSuccess,
  connectionId,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => disconnectConnection(connectionId),
    onSuccess: () => {
      notifySuccess(
        "Connection",
        "Your connection have been successfully disconnected.",
      );
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Connection", formatApiError(error));
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      title="Disconnect"
      disabled={isPending}
      className="flex items-center justify-center rounded-[8px] border-red-600 text-xs font-medium tracking-[0%] text-red-600 hover:bg-red-50 hover:text-red-600"
      onClick={() => mutate()}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Unplug className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DisconnectConnectionButton;
