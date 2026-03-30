import axios, { AxiosError } from "axios";
import { STORAGE_KEYS } from "@/helpers/constants/storage-keys";
import { getAuthRedirectUrl, isLocalAuthDisabled } from "./utils";
import { queryClient } from "./queryClient";
import { CURRENT_USER_QUERY } from "@/helpers/constants/common";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const axiosAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
});

export const axiosConnectorsInstance = axios.create({
  baseURL: import.meta.env.VITE_CONNECTORS_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response?.status === 401) {
      if (isLocalAuthDisabled()) {
        return Promise.reject(error);
      }

      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      queryClient.removeQueries({ queryKey: [CURRENT_USER_QUERY] });
      const redirectURI = getAuthRedirectUrl();
      window.location.replace(redirectURI);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
