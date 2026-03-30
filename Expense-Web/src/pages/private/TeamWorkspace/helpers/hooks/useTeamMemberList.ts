import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { TEAM_MEMBERS_LIST_API_QUERY_KEY } from "@/helpers/constants/common";
import { getTeamMembers } from "@/services/employee.service";
import type { EmployeeListFilters } from "@/types/employees.types";

const useTeamMemberList = (filters: EmployeeListFilters) => {
  const { page, perPage } = filters;

  const { data, isFetching } = useQuery({
    queryKey: [TEAM_MEMBERS_LIST_API_QUERY_KEY, filters],
    queryFn: () => getTeamMembers(filters),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage,
    total: data?.total ?? 0,
  };

  return { data, isFetching, pagination };
};

export default useTeamMemberList;
