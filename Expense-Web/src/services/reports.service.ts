import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance from "@/lib/axios";

export const getMyReportsDashboard = async (selectedYearMonth: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("month", selectedYearMonth);

  const response = await axiosInstance.get<MyReportsDashboardResponse>(
    ENDPOINTS.REPORTS.ME,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getTeamReportsDashboard = async (selectedYearMonth: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("month", selectedYearMonth);

  const response = await axiosInstance.get<TeamReportsDashboardResponse>(
    ENDPOINTS.REPORTS.TEAM,
    {
      params: queryParams,
    },
  );
  return response.data;
};
