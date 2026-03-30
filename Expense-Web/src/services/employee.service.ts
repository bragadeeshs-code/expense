import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";
import axiosInstance from "@/lib/axios";
import type { EmployeeDashboardResponse } from "@/pages/private/UserManagement/types/user-management.types";
import type { FileUploadResponse } from "@/types/common.types";
import type {
  EmployeeListFilters,
  EmployeeResponse,
  MemberRequestPayload,
  AddMemberResponse,
  DeleteEmployeeResponse,
  EmployeeOptions,
} from "@/types/employees.types";

export const getEmployees = async (filters: EmployeeListFilters) => {
  const queryParams = new URLSearchParams();
  const { page, perPage, search } = filters;
  const { costCenters, departments, grades, roles, status } =
    filters.columnFilters ?? EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE;
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());

  status.forEach((status) => {
    queryParams.append("statuses", status.value);
  });
  costCenters.forEach((costCenter) => {
    queryParams.append("cost_center_ids", costCenter.id.toString());
  });
  departments.forEach((department) => {
    queryParams.append("department_ids", department.id.toString());
  });
  grades.forEach((grade) => {
    queryParams.append("grade_ids", grade.id.toString());
  });
  roles.forEach((role) => {
    queryParams.append("role_ids", role.id.toString());
  });

  const response = await axiosInstance.get<EmployeeResponse>(
    ENDPOINTS.EMPLOYEE.LIST,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const addEmployee = async (data: MemberRequestPayload) => {
  const response = await axiosInstance.post<AddMemberResponse>(
    ENDPOINTS.EMPLOYEE.ADD,
    data,
  );
  return response.data;
};

export const updateEmployee = async (
  id: number,
  data: MemberRequestPayload,
) => {
  const response = await axiosInstance.patch<MemberRequestPayload>(
    ENDPOINTS.EMPLOYEE.UPDATE(id),
    data,
  );
  return response.data;
};

export const uploadEmployeeFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<FileUploadResponse>(
    ENDPOINTS.EMPLOYEE.UPLOAD_FILE,
    formData,
  );
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  const response = await axiosInstance.delete<DeleteEmployeeResponse>(
    ENDPOINTS.EMPLOYEE.DELETE(id),
  );
  return response.data;
};

export const getEmployeeDashboard = async () => {
  const response = await axiosInstance.get<EmployeeDashboardResponse>(
    ENDPOINTS.DASHBOARD.EMPLOYEE,
  );
  return response.data;
};

export const getManagers = async ({ search }: { search: string }) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  const response = await axiosInstance.get<EmployeeOptions>(
    ENDPOINTS.EMPLOYEE.MANAGERS,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getEmployeeOptions = async ({ search }: { search: string }) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  const response = await axiosInstance.get<EmployeeOptions>(
    ENDPOINTS.EMPLOYEE.OPTIONS,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getTeamMembers = async (filters: EmployeeListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.perPage)
    queryParams.append("per_page", filters.perPage.toString());
  const response = await axiosInstance.get<EmployeeResponse>(
    ENDPOINTS.EMPLOYEE.TEAM_MEMBERS,
    {
      params: queryParams,
    },
  );
  return response.data;
};
