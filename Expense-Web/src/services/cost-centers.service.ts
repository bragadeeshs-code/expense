import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import type { ListFilters } from "@/types/common.types";
import type {
  CostCenterBase,
  CostCenterDeleteResponse,
  CostCenterResponse,
  CostCenterUpdateParams,
  CostCentersListResponse,
} from "@/types/cost-center.types";

import axiosInstance from "@/lib/axios";

export const createCostCenter = async (costCenterParams: CostCenterBase) => {
  const response = await axiosInstance.post<CostCenterResponse>(
    ENDPOINTS.COST_CENTERS.ADD,
    costCenterParams,
  );
  return response.data;
};

export const deleteCostCenter = async (id: number) => {
  const response = await axiosInstance.delete<CostCenterDeleteResponse>(
    ENDPOINTS.COST_CENTERS.DELETE(id),
  );
  return response.data;
};

export const getCostCenters = async (filters: ListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.perPage)
    queryParams.append("per_page", filters.perPage.toString());

  const response = await axiosInstance.get<CostCentersListResponse>(
    ENDPOINTS.COST_CENTERS.LIST,
    { params: queryParams },
  );
  return response.data;
};

export const updateCostCenter = async ({
  id,
  data,
}: CostCenterUpdateParams) => {
  const response = await axiosInstance.put<CostCenterResponse>(
    ENDPOINTS.COST_CENTERS.UPDATE(id),
    data,
  );
  return response.data;
};
