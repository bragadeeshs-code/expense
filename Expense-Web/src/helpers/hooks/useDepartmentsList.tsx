import { useEffect } from "react";
import type { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getDepartments } from "@/services/departments.service";
import type { ListFilters } from "@/types/common.types";
import { DEPARTMENTS_LIST_QUERY_KEY } from "../constants/departments";
import { formatApiError, notifyError } from "@/lib/utils";
import type { DepartmentsListResponse } from "@/types/departments.types";

interface useDepartmentsListProps {
  filters: ListFilters;
  isEnabled?: boolean;
}

const useDepartmentsList = ({
  filters,
  isEnabled = true,
}: useDepartmentsListProps) => {
  const { page, perPage, search } = filters;

  const { isFetching, data, error } = useQuery<
    DepartmentsListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [DEPARTMENTS_LIST_QUERY_KEY, page, perPage, search],
    queryFn: () => getDepartments(filters),
    refetchOnWindowFocus: false,
    enabled: isEnabled,
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
    notifyError("Failed to load departments.", formatApiError(error));
  }, [error]);

  return {
    isDepartmentsLoading: isFetching,
    departments: data?.data || [],
    pagination,
  };
};

export default useDepartmentsList;
