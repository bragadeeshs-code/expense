import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTravelExpenseById,
  updateTravelExpense,
  approveTravelExpense,
  rejectTravelExpense,
} from "@/services/mileage.service";
import { getCurrentUserProjects } from "@/services/project.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { MILEAGE_EXPENSES_LIST_QUERY_KEY } from "@/helpers/constants/common";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import type { AxiosError } from "axios";
import type { MileageProjectsResponse } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

export const useTripDetailsLogic = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const { data: projects, isFetching: isProjectsFetching } =
    useQuery<MileageProjectsResponse>({
      queryFn: () => getCurrentUserProjects(search),
      queryKey: ["my-projects", debouncedSearch],
      refetchOnWindowFocus: false,
      retry: false,
    });

  const { data: trip, isLoading } = useQuery({
    queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY, id],
    queryFn: () => getTravelExpenseById(Number(id)),
    enabled: !!id,
  });

  const { mutate: handleUpdateExpense, isPending: isUpdating } = useMutation({
    mutationFn: (projectId: number) =>
      updateTravelExpense(Number(id), projectId),
    onSuccess: (data) => {
      notifySuccess("Success", data.message);
      queryClient.invalidateQueries({
        queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY],
      });
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError(`Failed to update travel expense`, formatApiError(error));
    },
  });

  const { mutate: handleApprove, isPending: isApproving } = useMutation({
    mutationFn: () => approveTravelExpense(Number(id)),
    onSuccess: (data) => {
      notifySuccess("Success", data.message);
      queryClient.invalidateQueries({
        queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY],
      });
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError(`Failed to approve travel expense`, formatApiError(error));
    },
  });

  const { mutate: handleReject, isPending: isRejecting } = useMutation({
    mutationFn: (rejectReason: string) =>
      rejectTravelExpense(Number(id), rejectReason),
    onSuccess: (data) => {
      notifySuccess("Success", data.message);
      queryClient.invalidateQueries({
        queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY],
      });
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError(`Failed to reject travel expense`, formatApiError(error));
    },
  });

  return {
    id,
    trip,
    isLoading,
    projects,
    isProjectsFetching,
    handleUpdateExpense,
    isUpdating: isUpdating || isApproving || isRejecting,
    handleApprove,
    handleReject,
    search,
    handleSearch,
  };
};
