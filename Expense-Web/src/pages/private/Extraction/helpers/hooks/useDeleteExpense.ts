import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import { deleteExpense } from "@/services/uploaded-document.service";

interface useDeleteExpenseProps {
  onSuccess: () => void;
}

const useDeleteExpense = ({ onSuccess }: useDeleteExpenseProps) => {
  const { isPending, mutate } = useMutation<
    DeleteExpenseResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteExpense(id),
    onSuccess: (response) => {
      onSuccess();
      notifySuccess(
        "Expense Delete Done",
        `Expense ${response.name} got deleted successfully`,
      );
    },
    onError: (error) => {
      notifyError("Failed to delete expense", formatApiError(error));
    },
  });

  return {
    isExpenseDeleteLoading: isPending,
    mutateExpenseDelete: mutate,
  };
};

export default useDeleteExpense;
