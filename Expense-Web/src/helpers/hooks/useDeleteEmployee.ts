import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteEmployee } from "@/services/employee.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import {
  EMPLOYEE_DASHBOARD_API_QUERY_KEY,
  EMPLOYEES_LIST_API_QUERY_KEY,
} from "../constants/common";
import type { DeleteEmployeeResponse } from "@/types/employees.types";

interface useDeleteEmployeeProps {
  setEmployeeIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useDeleteEmployee = ({
  setEmployeeIdToDelete,
  setIsDeleteDialogOpen,
}: useDeleteEmployeeProps) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation<
    DeleteEmployeeResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteEmployee(id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      notifySuccess(
        "Employee deleted",
        `The selected employee has been deleted successfully.`,
      );
      setEmployeeIdToDelete(null);
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEES_LIST_API_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEE_DASHBOARD_API_QUERY_KEY],
      });
    },
    onError: (error) => {
      notifyError("Failed to delete employee", formatApiError(error));
    },
  });

  return {
    isEmployeeDeleteLoading: isPending,
    mutateEmployeeDelete: mutate,
  };
};

export default useDeleteEmployee;
