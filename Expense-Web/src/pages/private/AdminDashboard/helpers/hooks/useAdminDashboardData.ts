import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AxiosError } from "axios";

import { formatApiError, notifyError } from "@/lib/utils";
import { getAdminDashboardData } from "@/services/dashboard.service";

const useAdminDashboardData = () => {
  const { data, isError, error } = useQuery<
    AdminDashboardStats,
    AxiosError<APIErrorResponse>
  >({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboardData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      notifyError("Admin dashboard data load fails", formatApiError(error));
    }
  }, [isError, error]);

  return { adminDashboardData: data };
};

export default useAdminDashboardData;
