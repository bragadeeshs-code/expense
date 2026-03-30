import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { updateStatusTrip } from "@/services/trips.service";
import type { TripResponse, TripStatusUpdateParams } from "../types/trips.type";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

interface useUpdateTripStatusProps {
  onSuccess: () => void;
}

const useUpdateTripStatus = ({ onSuccess }: useUpdateTripStatusProps) => {
  const { isPending, mutate } = useMutation<
    TripResponse,
    AxiosError<APIErrorResponse>,
    TripStatusUpdateParams
  >({
    mutationFn: ({ id, status }) => updateStatusTrip({ id, status }),
    onSuccess: ({ status }) => {
      notifySuccess(
        "Trip status update successful",
        `The trip has been ${status} successfully.`,
      );
      onSuccess();
    },
    onError: (error) => {
      notifyError("Failed to update trip status", formatApiError(error));
    },
  });

  return {
    isTripStatusLoading: isPending,
    mutateTripStatus: mutate,
  };
};

export default useUpdateTripStatus;
