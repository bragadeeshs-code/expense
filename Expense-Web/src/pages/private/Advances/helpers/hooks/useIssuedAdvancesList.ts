import { useEffect } from "react";
import type { AxiosError } from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { formatApiError, notifyError } from "@/lib/utils";
import type { ListFilters, Pagination } from "@/types/common.types";
import { ISSUED_ADVANCES_QUERY_KEY } from "../constants/advances";
import type { AdvancesListResponse } from "../types/advances.type";
import { getIssuedAdvances } from "@/services/advances.service";

const useIssuedAdvancesList = (filters: ListFilters) => {
  const { page, perPage } = filters;

  const { isFetching, data, error } = useQuery<
    AdvancesListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [ISSUED_ADVANCES_QUERY_KEY, filters],
    queryFn: () => getIssuedAdvances(),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination: Pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage,
    total: data?.total ?? 0,
  };

  useEffect(() => {
    if (!error) return;
    notifyError("Failed to load advances.", formatApiError(error));
  }, [error]);

  return {
    isIssuedAdvancesListLoading: isFetching,
    issuedAdvancesList: data?.data || [],
    pagination,
  };
};

export default useIssuedAdvancesList;
