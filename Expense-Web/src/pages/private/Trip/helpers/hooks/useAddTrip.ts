import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { createTrip } from "@/services/trips.service";
import type { TripBase, TripResponse } from "../types/trips.type";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

interface useAddTripProps {
  onSuccess: () => void;
}

const useAddTrip = ({ onSuccess }: useAddTripProps) => {
  const { mutate, isPending } = useMutation<
    TripResponse,
    AxiosError<APIErrorResponse>,
    TripBase
  >({
    mutationFn: createTrip,
    onSuccess: () => {
      notifySuccess(
        "Travel request Added",
        "The travel request has been added successfully.",
      );
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Add new travel request failed", formatApiError(error));
    },
  });

  return { mutateAddTrip: mutate, isAddTripLoading: isPending };
};

export default useAddTrip;
