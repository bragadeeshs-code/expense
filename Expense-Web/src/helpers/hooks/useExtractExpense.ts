import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { extractExpense } from "@/services/reimbursements.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import type {
  ExpenseExtractRequest,
  ExpenseExtractResponse,
} from "@/pages/private/Approvals/types/approvals.types";

type useExtractExpenseProps = {
  onSuccess: () => void;
};

const useExtractExpense = ({ onSuccess }: useExtractExpenseProps) => {
  const { mutate, isPending } = useMutation<
    ExpenseExtractResponse,
    AxiosError<APIErrorResponse>,
    ExpenseExtractRequest
  >({
    mutationFn: ({ userExpenseID }) =>
      extractExpense({ userExpenseID: userExpenseID }),
    onSuccess: () => {
      notifySuccess(
        "Expense extraction started",
        "We're processing the expense. You'll see the results shortly.",
      );
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Expense extraction failed", formatApiError(error));
    },
  });

  return {
    mutateExpenseExtract: mutate,
    isExpenseExtractPending: isPending,
  };
};

export default useExtractExpense;
