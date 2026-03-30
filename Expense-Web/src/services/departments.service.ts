import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance from "@/lib/axios";
import type { ListFilters } from "@/types/common.types";
import type {
  DepartmentBase,
  DepartmentDeleteResponse,
  DepartmentResponse,
  DepartmentsListResponse,
  DepartmentUpdateProps,
} from "@/types/departments.types";

export const getDepartments = async (filters: ListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.perPage)
    queryParams.append("per_page", filters.perPage.toString());

  const response = await axiosInstance.get<DepartmentsListResponse>(
    ENDPOINTS.DEPARTMENTS.LIST,
    { params: queryParams },
  );
  return response.data;
};

export const createDepartment = async (departmentParams: DepartmentBase) => {
  const response = await axiosInstance.post<DepartmentResponse>(
    ENDPOINTS.DEPARTMENTS.ADD,
    departmentParams,
  );
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await axiosInstance.delete<DepartmentDeleteResponse>(
    ENDPOINTS.DEPARTMENTS.DELETE(id),
  );
  return response.data;
};

export const updateDepartment = async ({ id, data }: DepartmentUpdateProps) => {
  const response = await axiosInstance.put<DepartmentResponse>(
    ENDPOINTS.DEPARTMENTS.UPDATE(id),
    data,
  );
  return response.data;
};
