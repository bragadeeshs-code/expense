import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { PER_PAGE } from "@/helpers/constants/common";
import { getGrades } from "@/services/roles-and-grades.service";
import { GRADS_LIST_API_QUERY_KEY } from "@/helpers/constants/common";
import { formatApiError, notifyError } from "@/lib/utils";

import type { ListFilters } from "@/types/common.types";
import type { GradesListResponse } from "@/types/grades.types";

const useGradesList = (filters: ListFilters) => {
  const [total, setTotal] = useState<number>(0);
  const { page, perPage, search } = filters;

  const { isFetching, data, error } = useQuery<
    GradesListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [GRADS_LIST_API_QUERY_KEY, page, perPage, search],
    queryFn: () => getGrades(filters),
    refetchOnWindowFocus: false,
  });

  const pagination = {
    page: data?.page ?? page,
    total: data?.total ?? total,
    per_page: data?.per_page ?? perPage ?? PER_PAGE,
    has_next_page: data?.has_next_page ?? false,
  };

  useEffect(() => {
    if (!data?.total) return;
    setTotal(data?.total);
  }, [data]);

  useEffect(() => {
    if (error) notifyError("Grades List Api Error", formatApiError(error));
  }, [error]);

  return {
    grades: data?.data || [],
    pagination,
    isGradesListLoading: isFetching,
  };
};

export default useGradesList;
