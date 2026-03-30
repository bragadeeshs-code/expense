import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance, { axiosAuthInstance } from "@/lib/axios";
import type { MeResponse } from "@/types/user.types";
import { isLocalAuthDisabled } from "@/lib/utils";

export const AuthService = {
  logout: async () => {
    if (isLocalAuthDisabled()) {
      return;
    }

    const response = await axiosAuthInstance.delete<void>(
      ENDPOINTS.AUTH.LOGOUT,
    );
    return response;
  },
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get<MeResponse>(ENDPOINTS.AUTH.ME);
  return response.data;
};
