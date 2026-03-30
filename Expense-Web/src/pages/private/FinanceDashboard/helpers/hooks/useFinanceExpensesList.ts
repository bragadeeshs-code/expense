import { useEffect } from "react";
import type { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ListFilters } from "@/types/common.types";
import { getFinanceExpensesList } from "@/services/reimbursements.service";
import { formatApiError, notifyError } from "@/lib/utils";
import type { FinanceExpenses } from "../types/finance-dashboard.types";

const useFinanceExpensesList = (filters: ListFilters) => {
  const { page, perPage } = filters;

  const { data, isFetching, error } = useQuery<
    FinanceExpenses,
    AxiosError<APIErrorResponse>
  >({
    queryKey: ["finance-expenses-list", filters],
    queryFn: () => getFinanceExpensesList(filters),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage,
    total: data?.total ?? 0,
  };

  useEffect(() => {
    if (!error) return;
    notifyError("Unable to fetch expenses", formatApiError(error));
  }, [error]);

  return {
    financeExpensesList: data?.data ?? [],
    isFinanceExpensesListLoading: isFetching,
    pagination,
  };
};

export default useFinanceExpensesList;
