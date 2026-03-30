import { useEffect } from "react";
import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { formatApiError, notifyError } from "@/lib/utils";
import { getFinanceExpenseDetails } from "@/services/reimbursements.service";
import type { FinanceExpenseDetails } from "../types/finance-dashboard.types";

const useFinanceExpenseDetails = (id: number) => {
  const { data, isFetching, error } = useQuery<
    FinanceExpenseDetails,
    AxiosError<APIErrorResponse>
  >({
    queryKey: ["finance-expense-details", id],
    queryFn: () => getFinanceExpenseDetails(id),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!error) return;
    notifyError("Expense Details Fetching Failed", formatApiError(error));
  }, [error]);

  return { expenseDetails: data, isExpenseDetailsLoading: isFetching };
};

export default useFinanceExpenseDetails;
