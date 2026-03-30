import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { deleteTrip } from "@/services/trips.service";
import type { DeleteTripResponse } from "../types/trips.type";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

interface useDeleteTripProps {
  onSuccess: () => void;
}

const useDeleteTrip = ({ onSuccess }: useDeleteTripProps) => {
  const { isPending, mutate } = useMutation<
    DeleteTripResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteTrip(id),
    onSuccess: () => {
      notifySuccess(
        "Trip deleted",
        `The selected trip has been deleted successfully.`,
      );
      onSuccess();
    },
    onError: (error) => {
      notifyError("Failed to delete trip", formatApiError(error));
    },
  });

  return {
    isTripDeleteLoading: isPending,
    mutateTripDelete: mutate,
  };
};

export default useDeleteTrip;
