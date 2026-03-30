import axiosInstance from "@/lib/axios";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import type { FileUploadResponse, ListFilters } from "@/types/common.types";
import type {
  GradeItem,
  GradesListResponse,
  DeleteGradeResponse,
  GradeParams,
} from "@/types/grades.types";

export const addNewGrade = async (newGardeParams: GradeParams) => {
  const response = await axiosInstance.post<GradeItem>(
    ENDPOINTS.GRADES.ADD,
    newGardeParams,
  );
  return response.data;
};

export const getGrades = async (filters: ListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.perPage)
    queryParams.append("per_page", filters.perPage.toString());

  const response = await axiosInstance.get<GradesListResponse>(
    ENDPOINTS.GRADES.LIST,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const updateGrade = async (
  gradeId: number,
  gradeParams: GradeParams,
) => {
  const response = await axiosInstance.patch<GradeItem>(
    ENDPOINTS.GRADES.UPDATE(gradeId),
    gradeParams,
  );
  return response.data;
};

export const uploadGradeFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<FileUploadResponse>(
    ENDPOINTS.GRADES.UPLOAD_FILE,
    formData,
  );
  return response.data;
};

export const deleteGrade = async (id: number) => {
  const response = await axiosInstance.delete<DeleteGradeResponse>(
    ENDPOINTS.GRADES.DELETE(id),
  );
  return response.data;
};
