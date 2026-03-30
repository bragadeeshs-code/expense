import { useEffect } from "react";
import type { AxiosError } from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getCostCenters } from "@/services/cost-centers.service";
import { COST_CENTERS_LIST_QUERY_KEY } from "../constants/cost-centers";
import { formatApiError, notifyError } from "@/lib/utils";
import type { ListFilters, Pagination } from "@/types/common.types";
import type { CostCentersListResponse } from "@/types/cost-center.types";

interface useCostCentersListProps {
  filters: ListFilters;
  isEnabled?: boolean;
}

const useCostCentersList = ({
  filters,
  isEnabled = true,
}: useCostCentersListProps) => {
  const { page, perPage, search } = filters;

  const { isFetching, data, error } = useQuery<
    CostCentersListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [COST_CENTERS_LIST_QUERY_KEY, page, perPage, search],
    queryFn: () => getCostCenters(filters),
    refetchOnWindowFocus: false,
    enabled: isEnabled,
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
    notifyError("Failed to load cost centers.", formatApiError(error));
  }, [error]);

  return {
    isCostCentersLoading: isFetching,
    costCenters: data?.data || [],
    pagination,
  };
};

export default useCostCentersList;
