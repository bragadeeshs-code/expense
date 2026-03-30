import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance from "@/lib/axios";
import type {
  AddProjectPayload,
  AddProjectResponse,
  CurrentUserProjectsResponse,
  DeleteProjectResponse,
  FileUploadResponse,
  ProjectDetailResponse,
  ProjectListFilters,
  ProjectsResponse,
} from "@/types/common.types";

export const getProjectList = async (filters: ProjectListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.per_page)
    queryParams.append("per_page", filters.per_page.toString());
  const response = await axiosInstance.get<ProjectsResponse>(
    ENDPOINTS.PROJECT.LIST,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getProjectDetail = async (id: number) => {
  const response = await axiosInstance.get<ProjectDetailResponse>(
    ENDPOINTS.PROJECT.GET(id),
  );
  return response.data;
};

export const addProject = async (data: AddProjectPayload) => {
  const response = await axiosInstance.post<AddProjectResponse>(
    ENDPOINTS.PROJECT.ADD,
    data,
  );
  return response.data;
};

export const updateProject = async (id: number, data: AddProjectPayload) => {
  const response = await axiosInstance.put<AddProjectResponse>(
    ENDPOINTS.PROJECT.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteProject = async (projectId: number) => {
  const response = await axiosInstance.delete<DeleteProjectResponse>(
    ENDPOINTS.PROJECT.DELETE(projectId),
  );
  return response.data;
};

export const getCurrentUserProjects = async (
  search: string,
  page?: number,
  per_page?: number,
) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (per_page) queryParams.append("per_page", per_page.toString());
  const response = await axiosInstance.get<CurrentUserProjectsResponse>(
    ENDPOINTS.PROJECT.MY,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const uploadProjectsFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<FileUploadResponse>(
    ENDPOINTS.PROJECT.UPLOAD,
    formData,
  );
  return response.data;
};
