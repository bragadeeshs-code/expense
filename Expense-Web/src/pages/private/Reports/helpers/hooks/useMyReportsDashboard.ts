import { useQuery } from "@tanstack/react-query";

import { MY_REPORTS_DASHBOARD_API_QUERY_KEY } from "../constants/reports";
import { getMyReportsDashboard } from "@/services/reports.service";

interface UseMyReportsDashboardProps {
  selectedYearMonth: string;
}

const useMyReportsDashboard = ({
  selectedYearMonth,
}: UseMyReportsDashboardProps) => {
  const { isFetching, data } = useQuery<
    MyReportsDashboardResponse,
    APIErrorResponse
  >({
    queryKey: [MY_REPORTS_DASHBOARD_API_QUERY_KEY, selectedYearMonth],
    queryFn: () => getMyReportsDashboard(selectedYearMonth),
    refetchOnWindowFocus: false,
  });

  return {
    isMyReportsDashboardStatsLoading: isFetching,
    myReportsDashboardData: data,
  };
};

export default useMyReportsDashboard;
