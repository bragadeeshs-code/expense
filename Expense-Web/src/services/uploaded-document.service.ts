import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import { UPLOADED_DOCUMENTS_STATUS_FILTERS } from "@/helpers/constants/common";
import { SORTING_ORDER_ENUM } from "@/helpers/constants/common";
import type {
  ExpensesDeleteAllResponse,
  UploadedDocumentFilters,
  UploadedDocumentListResponse,
} from "@/pages/private/Extraction/types/extraction.types";

export const getDocuments = async (
  filters: UploadedDocumentFilters,
): Promise<UploadedDocumentListResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.perPage) params.append("per_page", filters.perPage.toString());
  UPLOADED_DOCUMENTS_STATUS_FILTERS.forEach((documentStatus) => {
    params.append("status", documentStatus);
  });

  filters.sorting.forEach((sort) => {
    params.append("sort_by", sort.id);
    params.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });
  const { data } = await axiosInstance.get<UploadedDocumentListResponse>(
    `${ENDPOINTS.EXPENSES.LIST}?${params}`,
  );

  return data;
};

export const deleteExpense = async (id: number) => {
  const response = await axiosInstance.delete<DeleteExpenseResponse>(
    ENDPOINTS.EXPENSES.DELETE(id),
  );
  return response.data;
};

export const deleteAllExpenses = async (ids: number[]) => {
  const response = await axiosInstance.post<ExpensesDeleteAllResponse>(
    ENDPOINTS.EXPENSES.DELETE_ALL,
    { ids },
  );
  return response.data;
};
