import { format } from "date-fns";

import axiosInstance from "@/lib/axios";

import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import { SORTING_ORDER_ENUM } from "@/helpers/constants/common";
import type {
  MileageRateResponse,
  MileageExpensePayload,
  MileageExpenseResponse,
  TravelExpensesResponse,
  TravelExpenseDetailResponse,
  TravelExpenseNote,
  AddTravelExpenseNotePayload,
  AddTravelExpenseNoteResponse,
  IndividualDashboardMetrics,
  TeamDashboardMetrics,
  MileageExpenseListFilters,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

export const getMileageRates = async (): Promise<MileageRateResponse> => {
  const response = await axiosInstance.get<MileageRateResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.MILEAGE_RATE,
  );
  return response.data;
};

export const addTravelExpense = async (
  data: MileageExpensePayload,
): Promise<MileageExpenseResponse> => {
  const response = await axiosInstance.post<MileageExpenseResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.ADD,
    data,
  );
  return response.data;
};

export const getTravelExpenses = async (
  filters: MileageExpenseListFilters,
): Promise<TravelExpensesResponse> => {
  const queryParams = new URLSearchParams();
  const {
    page,
    perPage,
    search,
    status,
    sorting,
    columnFilters: { status: columnStatuses, fromDate, projects },
  } = filters;

  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  if (search) queryParams.append("search", search);

  if (columnStatuses?.length > 0) {
    columnStatuses.forEach((statusItem) =>
      queryParams.append("status", statusItem.value),
    );
  } else if (status && status !== "all") {
    queryParams.append("status", status);
  }

  if (fromDate)
    queryParams.append("from_date", format(new Date(fromDate), "yyyy-MM-dd"));

  if (projects?.length > 0) {
    projects.forEach((project) =>
      queryParams.append("project_ids", project.id.toString()),
    );
  }

  sorting?.forEach((sort) => {
    queryParams.append("sort_by", sort.id);
    queryParams.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });

  const response = await axiosInstance.get<TravelExpensesResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.ADD,
    { params: queryParams },
  );
  return response.data;
};

export const getTeamTravelExpenses = async (
  filters: MileageExpenseListFilters,
): Promise<TravelExpensesResponse> => {
  const queryParams = new URLSearchParams();
  const {
    page,
    perPage,
    search,
    status,
    sorting,
    columnFilters: { status: columnStatuses, fromDate, projects },
  } = filters;

  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  if (search) queryParams.append("search", search);

  if (columnStatuses?.length > 0) {
    columnStatuses.forEach((statusItem) =>
      queryParams.append("status", statusItem.value),
    );
  } else if (status && status !== "all") {
    queryParams.append("status", status);
  }

  if (fromDate)
    queryParams.append("from_date", format(new Date(fromDate), "yyyy-MM-dd"));

  if (projects?.length > 0) {
    projects.forEach((project) =>
      queryParams.append("project_ids", project.id.toString()),
    );
  }

  sorting?.forEach((sort) => {
    queryParams.append("sort_by", sort.id);
    queryParams.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });

  const response = await axiosInstance.get<TravelExpensesResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.TEAM,
    { params: queryParams },
  );
  return response.data;
};

export const getTravelExpenseById = async (
  id: number,
): Promise<TravelExpenseDetailResponse> => {
  const response = await axiosInstance.get<TravelExpenseDetailResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.DETAIL(id),
  );
  return response.data;
};

export const updateTravelExpense = async (
  expenseId: number,
  projectId: number,
): Promise<MileageExpenseResponse> => {
  const response = await axiosInstance.patch<MileageExpenseResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.UPDATE(expenseId),
    { project_id: projectId },
  );
  return response.data;
};

export const approveTravelExpense = async (
  expenseId: number,
): Promise<MileageExpenseResponse> => {
  const response = await axiosInstance.patch<MileageExpenseResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.APPROVE(expenseId),
  );
  return response.data;
};

export const getTravelExpenseNotes = async (
  id: number,
): Promise<TravelExpenseNote[]> => {
  const response = await axiosInstance.get<TravelExpenseNote[]>(
    ENDPOINTS.TRAVEL_EXPENSE.GET_NOTES(id),
  );
  return response.data;
};

export const addTravelExpenseNote = async (
  data: AddTravelExpenseNotePayload,
): Promise<AddTravelExpenseNoteResponse> => {
  const formData = new FormData();
  if (data.notes) {
    formData.append("notes", data.notes);
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  formData.append("expense_id", data.expense_id.toString());

  const response = await axiosInstance.post<AddTravelExpenseNoteResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.NOTES,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const rejectTravelExpense = async (
  expenseId: number,
  rejectReason: string,
): Promise<MileageExpenseResponse> => {
  const response = await axiosInstance.patch<MileageExpenseResponse>(
    ENDPOINTS.TRAVEL_EXPENSE.REJECT(expenseId),
    { reject_reason: rejectReason },
  );
  return response.data;
};

export const getIndividualDashboardMetrics =
  async (): Promise<IndividualDashboardMetrics> => {
    const response = await axiosInstance.get<IndividualDashboardMetrics>(
      ENDPOINTS.TRAVEL_EXPENSE.METRICS,
    );
    return response.data;
  };

export const getTeamDashboardMetrics =
  async (): Promise<TeamDashboardMetrics> => {
    const response = await axiosInstance.get<TeamDashboardMetrics>(
      ENDPOINTS.TRAVEL_EXPENSE.TEAM_METRICS,
    );
    return response.data;
  };
