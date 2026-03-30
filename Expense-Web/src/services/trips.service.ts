import axiosInstance from "@/lib/axios";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import type { ListFilters } from "@/types/common.types";
import { SORTING_ORDER_ENUM } from "@/helpers/constants/common";
import type {
  DeleteTripResponse,
  TeamTripsListResponse,
  TripBase,
  TripOptions,
  TripResponse,
  TripsListResponse,
  TripStatusUpdateParams,
  TripUpdateParams,
} from "@/pages/private/Trip/helpers/types/trips.type";

export const createTrip = async (tripParams: TripBase) => {
  const response = await axiosInstance.post<TripResponse>(
    ENDPOINTS.TRIPS.ADD,
    tripParams,
  );
  return response.data;
};

export const getTrips = async (filters: ListFilters) => {
  const { page, perPage, search, sorting } = filters;
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  sorting?.forEach((sort) => {
    queryParams.append("sort_by", sort.id);
    queryParams.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });
  const response = await axiosInstance.get<TripsListResponse>(
    ENDPOINTS.TRIPS.LIST,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getTeamTripsList = async (filters: ListFilters) => {
  const { page, perPage, search, sorting } = filters;
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  sorting?.forEach((sort) => {
    queryParams.append("sort_by", sort.id);
    queryParams.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });
  const response = await axiosInstance.get<TeamTripsListResponse>(
    ENDPOINTS.TRIPS.TEAM,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getTripsOptions = async (search?: string) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  const response = await axiosInstance.get<TripOptions>(
    ENDPOINTS.TRIPS.OPTIONS,
    { params: queryParams },
  );
  return response.data;
};

export const updateTrip = async ({ id, data }: TripUpdateParams) => {
  const response = await axiosInstance.put<TripResponse>(
    ENDPOINTS.TRIPS.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteTrip = async (id: number) => {
  const response = await axiosInstance.delete<DeleteTripResponse>(
    ENDPOINTS.TRIPS.DELETE(id),
  );
  return response.data;
};

export const updateStatusTrip = async ({
  id,
  status,
}: TripStatusUpdateParams) => {
  const response = await axiosInstance.patch<TripResponse>(
    ENDPOINTS.TRIPS.STATUS(id),
    {
      status,
    },
  );
  return response.data;
};
