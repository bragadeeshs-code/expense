import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { notifyError } from "@/lib/utils";
import { submitExpense } from "@/services/reimbursements.service";

interface ExpenseMutationParams {
  id: number;
  data: ExpenseSubmitRequestParams;
}

const useSubmitExpense = () => {
  const navigate = useNavigate();
  return useMutation<
    ExpenseSubmitResponse,
    AxiosError<ExpenseSubmitErrorResponse>,
    ExpenseMutationParams
  >({
    mutationFn: ({ id, data }: ExpenseMutationParams) =>
      submitExpense(id, data),
    onSuccess: () => {
      navigate("/my_expenses");
    },
    onError: (error: AxiosError<ExpenseSubmitErrorResponse>) => {
      if (error.status != 422) {
        notifyError(
          "Expense submission failed",
          error?.response?.data.detail.message ?? error?.message,
        );
      }
    },
  });
};

export default useSubmitExpense;
