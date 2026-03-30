import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { getProjectList } from "@/services/project.service";
import { formatApiError, notifyError } from "@/lib/utils";
import {
  PER_PAGE,
  PROJECTS_LIST_API_QUERY_KEY,
} from "@/helpers/constants/common";
import type {
  ProjectListFilters,
  ProjectsResponse,
} from "@/types/common.types";

interface useProjectListProps {
  filters: ProjectListFilters;
}

const useProjectList = ({ filters }: useProjectListProps) => {
  const [total, setTotal] = useState<number>(0);
  const { page, per_page, search } = filters;

  const { data, isFetching, error } = useQuery<
    ProjectsResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [PROJECTS_LIST_API_QUERY_KEY, page, per_page, search],
    queryFn: () =>
      getProjectList({
        page,
        per_page,
        search,
      }),
    refetchOnWindowFocus: false,
  });

  const pagination = {
    page: data?.page ?? page,
    total: data?.total ?? total,
    per_page: data?.per_page ?? per_page ?? PER_PAGE,
    has_next_page: data?.has_next_page ?? false,
  };

  useEffect(() => {
    if (!data?.total) return;
    setTotal(data?.total);
  }, [data]);

  useEffect(() => {
    if (error) {
      notifyError("Projects error", formatApiError(error));
    }
  }, [error]);

  return {
    projects: data?.data ?? [],
    pagination,
    isProjectsListLoading: isFetching,
  };
};

export default useProjectList;
