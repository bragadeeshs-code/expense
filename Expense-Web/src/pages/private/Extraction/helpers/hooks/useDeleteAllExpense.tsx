import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import { deleteAllExpenses } from "@/services/uploaded-document.service";
import type { ExpensesDeleteAllResponse } from "../../types/extraction.types";

interface useDeleteAllExpenseProps {
  onSuccess: () => void;
}

const useDeleteAllExpense = ({ onSuccess }: useDeleteAllExpenseProps) => {
  const { isPending, mutate } = useMutation<
    ExpensesDeleteAllResponse,
    AxiosError<APIErrorResponse>,
    { ids: number[] }
  >({
    mutationFn: ({ ids }) => deleteAllExpenses(ids),
    onSuccess: (response) => {
      onSuccess();
      notifySuccess(
        "Expenses Delete Done",
        `${response.deleted_ids.length} expenses got deleted successfully`,
      );
    },
    onError: (error) => {
      notifyError("Failed to delete expenses", formatApiError(error));
    },
  });

  return {
    isDeleteAllExpenseLoading: isPending,
    mutateDeleteAllExpense: mutate,
  };
};

export default useDeleteAllExpense;
