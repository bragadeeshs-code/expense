import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getEmployees } from "@/services/employee.service";
import { EMPLOYEES_LIST_API_QUERY_KEY, PER_PAGE } from "../constants/common";
import type { EmployeeListFilters } from "@/types/employees.types";

const useEmployeeList = (filters: EmployeeListFilters) => {
  const { page, perPage } = filters;

  const { data, isFetching } = useQuery({
    queryKey: [EMPLOYEES_LIST_API_QUERY_KEY, filters],
    queryFn: () => getEmployees(filters),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage ?? PER_PAGE,
    total: data?.total ?? 0,
  };

  return { data, isFetching, pagination };
};

export default useEmployeeList;
