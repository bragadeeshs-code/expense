import { useQuery } from "@tanstack/react-query";
import {
  getIndividualDashboardMetrics,
  getTeamDashboardMetrics,
} from "@/services/mileage.service";
import { EXPENSE_TRAVEL_ENUM } from "@/pages/private/MileageCalculator/helpers/constants/mileage";

const MILEAGE_DASHBOARD_METRICS_QUERY_KEY = "mileage-dashboard-metrics";

export const useMileageDashboardMetrics = (activeTab: EXPENSE_TRAVEL_ENUM) => {
  return useQuery({
    queryKey: [MILEAGE_DASHBOARD_METRICS_QUERY_KEY, activeTab],
    queryFn: () => {
      return activeTab === EXPENSE_TRAVEL_ENUM.TEAM_TRAVEL
        ? getTeamDashboardMetrics()
        : getIndividualDashboardMetrics();
    },
    refetchOnWindowFocus: false,
  });
};
