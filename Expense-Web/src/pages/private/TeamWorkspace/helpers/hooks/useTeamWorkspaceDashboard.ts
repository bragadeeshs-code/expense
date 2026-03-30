import { useQuery } from "@tanstack/react-query";

import { getTeamWorkspaceDashboard } from "@/services/dashboard.service";
import { TEAM_WORKSPACE_DASHBOARD_API_QUERY_KEY } from "../constants/team-workspace";

const useTeamWorkspaceDashboard = () => {
  const { isFetching, data } = useQuery<
    TeamWorkspaceDashboardResponse,
    APIErrorResponse
  >({
    queryKey: [TEAM_WORKSPACE_DASHBOARD_API_QUERY_KEY],
    queryFn: getTeamWorkspaceDashboard,
  });

  return {
    isTeamWorkspaceDashboardStatsLoading: isFetching,
    teamWorksSpaceDashboardData: data,
  };
};

export default useTeamWorkspaceDashboard;
