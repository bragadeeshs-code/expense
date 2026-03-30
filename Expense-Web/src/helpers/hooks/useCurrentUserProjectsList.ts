import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProjects } from "@/services/project.service";
import {
  CURRENT_USER_PROJECTS_LIST_API_QUERY_KEY,
  PER_PAGE,
} from "../constants/common";
import type { CurrentUserProjectsResponse } from "@/types/common.types";

interface UseCurrentUserProjectsListProps {
  search: string;
  page?: number;
  perPage?: number;
  isEnabled?: boolean;
}

const useCurrentUserProjectsList = ({
  search,
  page = 1,
  perPage = PER_PAGE,
  isEnabled = true,
}: UseCurrentUserProjectsListProps) => {
  const { data, isFetching } = useQuery<CurrentUserProjectsResponse>({
    queryFn: () => getCurrentUserProjects(search, page, perPage),
    queryKey: [CURRENT_USER_PROJECTS_LIST_API_QUERY_KEY, search, page, perPage],
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isEnabled,
  });

  return {
    projects: data?.data ?? [],
    isProjectsFetching: isFetching,
    pagination: {
      page: data?.page ?? 1,
      total: data?.total ?? 0,
      per_page: data?.per_page ?? perPage,
      has_next_page: data?.has_next_page ?? false,
    },
  };
};

export default useCurrentUserProjectsList;
