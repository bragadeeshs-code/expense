import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { updateTrip } from "@/services/trips.service";
import type { TripResponse, TripUpdateParams } from "../types/trips.type";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

interface useUpdateTripProps {
  onSuccess: () => void;
}

const useUpdateTrip = ({ onSuccess }: useUpdateTripProps) => {
  const { mutate, isPending } = useMutation<
    TripResponse,
    AxiosError<APIErrorResponse>,
    TripUpdateParams
  >({
    mutationFn: updateTrip,
    onSuccess: () => {
      notifySuccess(
        "Travel request Updated",
        "The travel request has been updated successfully.",
      );
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Update travel request failed", formatApiError(error));
    },
  });

  return { mutateUpdateTrip: mutate, isUpdateTripLoading: isPending };
};

export default useUpdateTrip;
