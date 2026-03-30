import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getReimbursements } from "@/services/reimbursements.service";
import { REIMBURSEMENTS_LIST_QUERY_KEY } from "@/pages/private/Extraction/helpers/constants/extraction";
import type { ReimbursementListFilters } from "@/types/common.types";

const useReimbursementList = (filters: ReimbursementListFilters) => {
  const { page, perPage } = filters;

  const { isFetching, data } = useQuery({
    queryKey: [REIMBURSEMENTS_LIST_QUERY_KEY, filters],
    queryFn: () => getReimbursements(filters),
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
    isFetching,
    reimbursements: data?.data || [],
    pagination,
  };
};

export default useReimbursementList;
