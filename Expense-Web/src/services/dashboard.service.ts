import { ENDPOINTS } from "@/helpers/constants/api-endpoints";

import axiosInstance from "@/lib/axios";
import type { ManagerDashboardStats } from "@/pages/private/ManagerDashboard/types/manager-dashboard.types";

export const getDashboardData = async () => {
  const response = await axiosInstance.get<DashboardStats>(
    ENDPOINTS.DASHBOARD.INFO,
  );
  return response.data;
};

export const getDashboardCategory = async (range: string) => {
  const response = await axiosInstance.get<DashboardExpenseSummary>(
    `${ENDPOINTS.DASHBOARD.CATEGORY}?filter=${range}`,
  );
  return response.data;
};

export const getAdminDashboardData = async () => {
  const response = await axiosInstance.get<AdminDashboardStats>(
    ENDPOINTS.DASHBOARD.ADMIN,
  );
  return response.data;
};

export const getManagerDashboard = async (selectedYearMonth: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("month", selectedYearMonth);
  const response = await axiosInstance.get<ManagerDashboardStats>(
    ENDPOINTS.DASHBOARD.MANAGER,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getTeamWorkspaceDashboard = async () => {
  const response = await axiosInstance.get<TeamWorkspaceDashboardResponse>(
    ENDPOINTS.DASHBOARD.TEAM_EXPENSE,
  );
  return response.data;
};
