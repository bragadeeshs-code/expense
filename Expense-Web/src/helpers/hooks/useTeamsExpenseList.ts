import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTeamsExpensesList } from "@/services/reimbursements.service";
import { TEAM_EXPENSES_LIST_QUERY_KEY } from "../constants/common";
import type {
  TeamsExpensesListFilters,
  TeamsExpensesListResponse,
} from "@/types/expense.types";

const useTeamsExpenseList = (filters: TeamsExpensesListFilters) => {
  const { page, perPage } = filters;

  const { isFetching, data } = useQuery<TeamsExpensesListResponse>({
    queryKey: [TEAM_EXPENSES_LIST_QUERY_KEY, filters],
    queryFn: () => getTeamsExpensesList(filters),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage,
    total: data?.total ?? 0,
  };

  return {
    isTeamsExpenseListLoading: isFetching,
    teamsExpensesData: data?.data || [],
    teamsExpensesPagination: pagination,
  };
};
export default useTeamsExpenseList;
