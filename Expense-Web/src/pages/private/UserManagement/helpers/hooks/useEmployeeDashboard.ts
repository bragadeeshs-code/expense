import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AxiosError } from "axios";

import { formatApiError, notifyError } from "@/lib/utils";
import { getEmployeeDashboard } from "@/services/employee.service";
import { EMPLOYEE_DASHBOARD_API_QUERY_KEY } from "@/helpers/constants/common";
import type { EmployeeDashboardResponse } from "../../types/user-management.types";

const useEmployeeDashboard = () => {
  const { data, error } = useQuery<
    EmployeeDashboardResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [EMPLOYEE_DASHBOARD_API_QUERY_KEY],
    queryFn: getEmployeeDashboard,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error)
      notifyError("Employee Dashboard Details Failed", formatApiError(error));
  }, [error]);

  return {
    employeeDashboardDetails: data,
  };
};

export default useEmployeeDashboard;
