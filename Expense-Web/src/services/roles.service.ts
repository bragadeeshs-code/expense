import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance from "@/lib/axios";

export const getRoles = async () => {
  const response = await axiosInstance.get<RolesResponse>(ENDPOINTS.ROLES.LIST);
  return response.data;
};
