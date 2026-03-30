import { useQuery } from "@tanstack/react-query";

import { getTeamReportsDashboard } from "@/services/reports.service";
import { TEAM_REPORTS_DASHBOARD_API_QUERY_KEY } from "../constants/reports";

interface UseTeamReportsDashboardProps {
  selectedYearMonth: string;
}

const useTeamReportsDashboard = ({
  selectedYearMonth,
}: UseTeamReportsDashboardProps) => {
  const { isFetching, data } = useQuery<
    TeamReportsDashboardResponse,
    APIErrorResponse
  >({
    queryKey: [TEAM_REPORTS_DASHBOARD_API_QUERY_KEY, selectedYearMonth],
    queryFn: () => getTeamReportsDashboard(selectedYearMonth),
    refetchOnWindowFocus: false,
  });

  return {
    isTeamReportsDashboardStatsLoading: isFetching,
    teamReportsDashboardData: data,
  };
};

export default useTeamReportsDashboard;
