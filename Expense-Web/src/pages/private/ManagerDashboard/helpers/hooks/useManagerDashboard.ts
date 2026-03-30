import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AxiosError } from "axios";

import { formatApiError, notifyError } from "@/lib/utils";
import { getManagerDashboard } from "@/services/dashboard.service";
import type { ManagerDashboardStats } from "../../types/manager-dashboard.types";

interface UseManagerDashboardProps {
  selectedYearMonth: string;
}
const useManagerDashboard = ({
  selectedYearMonth,
}: UseManagerDashboardProps) => {
  const { data, isError, error, isFetching } = useQuery<
    ManagerDashboardStats,
    AxiosError<APIErrorResponse>
  >({
    queryKey: ["manager-dashboard", selectedYearMonth],
    queryFn: () => getManagerDashboard(selectedYearMonth),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      notifyError("Manager dashboard data load fails", formatApiError(error));
    }
  }, [isError, error]);

  return { managerDashboardData: data, isManagerDashboardLoading: isFetching };
};

export default useManagerDashboard;
