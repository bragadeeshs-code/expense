import { useEffect } from "react";
import type { AxiosError } from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { TeamTripsListResponse } from "../types/trips.type";
import { formatApiError, notifyError } from "@/lib/utils";
import type { ListFilters, Pagination } from "@/types/common.types";
import { getTeamTripsList } from "@/services/trips.service";
import { TEAM_TRIPS_QUERY_KEY } from "../constants/trips";

const useTeamTripsList = (filters: ListFilters) => {
  const { page, perPage } = filters;

  const { isFetching, data, error } = useQuery<
    TeamTripsListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [TEAM_TRIPS_QUERY_KEY, filters],
    queryFn: () => getTeamTripsList(filters),
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
    notifyError("Failed to load team travel requests.", formatApiError(error));
  }, [error]);

  return {
    isTripsListLoading: isFetching,
    tripsList: data?.data || [],
    pagination,
  };
};

export default useTeamTripsList;
