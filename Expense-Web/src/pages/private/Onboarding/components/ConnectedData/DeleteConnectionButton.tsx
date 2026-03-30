import { Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { deleteConnection } from "@/services/connection.service";

interface DeleteConnectionButtonProps {
  connectionId: number;
  onSuccess: () => void;
}

const DeleteConnectionButton: React.FC<DeleteConnectionButtonProps> = ({
  connectionId,
  onSuccess,
}) => {
  const { mutate } = useMutation({
    mutationFn: (connectionId: number) => deleteConnection(connectionId),
    onSuccess() {
      onSuccess();
      notifySuccess(
        "Connection",
        "Your connection have been successfully deleted.",
      );
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Connection", formatApiError(error));
    },
  });
  return (
    <Button
      variant="outline"
      size="sm"
      title="Delete"
      onClick={() => mutate(connectionId)}
      className="flex items-center justify-center rounded-[8px] border-red-400 text-xs font-medium tracking-[0%] text-red-400 hover:bg-red-50 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

export default DeleteConnectionButton;
