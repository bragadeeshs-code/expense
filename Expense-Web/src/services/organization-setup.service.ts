import axiosInstance from "@/lib/axios";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import type {
  AddCompanyAssetPayload,
  AddCompanyAssetResponse,
  CompanyAssetsListFilter,
  CompanyAssetsListResponse,
  DeleteCompanyAssetResponse,
} from "@/pages/private/Onboarding/types/onboarding.types";

export const getCompanyAssets = async (filters: CompanyAssetsListFilter) => {
  const { page, perPage, search } = filters;
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (perPage) params.append("per_page", perPage.toString());
  if (search) params.append("search", search);

  const response = await axiosInstance.get<CompanyAssetsListResponse>(
    ENDPOINTS.ASSETS.LIST,
    {
      params,
    },
  );
  return response.data;
};

export const addCompanyAsset = async (data: AddCompanyAssetPayload) => {
  const response = await axiosInstance.post<AddCompanyAssetResponse>(
    ENDPOINTS.ASSETS.ADD,
    data,
  );
  return response.data;
};

export const deleteCompanyAsset = async (id: number) => {
  const response = await axiosInstance.delete<DeleteCompanyAssetResponse>(
    ENDPOINTS.ASSETS.DELETE(id),
  );
  return response.data;
};

export const updateCompanyAsset = async (
  id: number,
  data: AddCompanyAssetPayload,
) => {
  const response = await axiosInstance.put<AddCompanyAssetResponse>(
    ENDPOINTS.ASSETS.UPDATE(id),
    data,
  );
  return response.data;
};
