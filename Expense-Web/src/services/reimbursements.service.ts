import { isEmpty } from "lodash";
import { format } from "date-fns";
import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import {
  ReimbursementStatusEnum,
  SORTING_ORDER_ENUM,
} from "@/helpers/constants/common";

import axiosInstance from "@/lib/axios";
import type { ExpenseDetails } from "@/pages/private/ExpenseView/types/expense-view.types";
import type {
  ExpenseExtractRequest,
  ExpenseExtractResponse,
  UserExpenseStatusParams,
  UserExpenseStatusResponse,
} from "@/pages/private/Approvals/types/approvals.types";
import type {
  ListFilters,
  ReimbursementListFilters,
  ReimbursementsList,
} from "@/types/common.types";
import { REIMBURSEMENTS_LIST_TAB_FILTERS } from "@/pages/private/UserDashboard/helpers/constants/reimbursements";
import type {
  TeamsExpensesListFilters,
  TeamsExpensesListResponse,
} from "@/types/expense.types";
import { APPROVALS_LIST_TAB_FILTERS } from "@/pages/private/Approvals/helpers/hooks/constants/approvals";
import { CATEGORY } from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import { WORKFLOW_PROGRESS_STATUS_ENUM } from "@/pages/private/FinanceDashboard/helpers/constants/finance-dashboard";

export const getReimbursements = async (
  reimbursementListFilters: ReimbursementListFilters,
) => {
  const queryParams = new URLSearchParams();
  const {
    search,
    page,
    perPage,
    sorting,
    columnFilters: {
      status,
      categories,
      subCategories,
      billDate,
      projects,
      billMonth,
    },
  } = reimbursementListFilters;
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  const statusFilter = isEmpty(status)
    ? REIMBURSEMENTS_LIST_TAB_FILTERS
    : status;
  statusFilter.forEach((documentStatus) => {
    queryParams.append("status", documentStatus.value);
  });
  categories.forEach((category) => {
    queryParams.append("category", category.value);
  });
  subCategories.forEach((subCategory) => {
    queryParams.append("sub_category", subCategory.value);
  });
  projects.forEach((project) => {
    queryParams.append("project_ids", project.id.toString());
  });
  if (billDate)
    queryParams.append("bill_date", format(new Date(billDate), "yyyy-MM-dd"));
  if (billMonth) queryParams.append("bill_month", billMonth);

  sorting.forEach((sort) => {
    queryParams.append("sort_by", sort.id);
    queryParams.append(
      "sort_dir",
      sort.desc ? SORTING_ORDER_ENUM.DESC : SORTING_ORDER_ENUM.ASC,
    );
  });
  const response = await axiosInstance.get<ReimbursementsList>(
    ENDPOINTS.EXPENSES.LIST,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const getReimbursementLink = async (reimbursementId: number) => {
  const response = await axiosInstance.get<ExpenseLinkResponse>(
    ENDPOINTS.EXPENSES.LINK(reimbursementId),
  );
  return response.data;
};

export const getExpenseDetail = async (id: number): Promise<ExpenseDetails> => {
  const response = await axiosInstance.get<ExpenseDetails>(
    ENDPOINTS.EXPENSES.DETAIL(id),
  );
  return response.data;
};

export const submitExpense = async (
  id: number,
  params: ExpenseSubmitRequestParams,
): Promise<ExpenseSubmitResponse> => {
  const response = await axiosInstance.patch<ExpenseSubmitResponse>(
    ENDPOINTS.EXPENSES.SUBMIT(id),
    params,
  );

  return response.data;
};

export const updateUserExpenseStatus = async ({
  status,
  userExpenseId,
}: UserExpenseStatusParams) => {
  const response = await axiosInstance.post<UserExpenseStatusResponse>(
    ENDPOINTS.USER_EXPENSE.STATUS(userExpenseId),
    { status },
  );
  return response.data;
};

export const extractExpense = async ({
  userExpenseID,
}: ExpenseExtractRequest) => {
  const response = await axiosInstance.post<ExpenseExtractResponse>(
    ENDPOINTS.EXPENSES.EXTRACT(userExpenseID),
  );
  return response.data;
};

export const getTeamsExpensesList = async (
  filters: TeamsExpensesListFilters,
) => {
  const queryParams = new URLSearchParams();
  const {
    page,
    perPage,
    search,
    columnFilters: {
      billDate,
      categories,
      projects,
      status,
      subCategories,
      approvalStatus,
      billMonth,
    },
  } = filters;
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (perPage) queryParams.append("per_page", perPage.toString());
  status.forEach((documentStatus) => {
    queryParams.append("status", documentStatus.value);
  });
  const approvalStatuses = isEmpty(approvalStatus)
    ? APPROVALS_LIST_TAB_FILTERS
    : approvalStatus;
  approvalStatuses.forEach((approvalStatus) => {
    queryParams.append("approval_status", approvalStatus.value);
  });
  categories.forEach((category) => {
    queryParams.append("category", category.value);
  });
  subCategories.forEach((subCategory) => {
    queryParams.append("sub_category", subCategory.value);
  });
  projects.forEach((project) => {
    queryParams.append("project_ids", project.id.toString());
  });
  if (billDate)
    queryParams.append("bill_date", format(new Date(billDate), "yyyy-MM-dd"));

  if (billMonth) queryParams.append("bill_month", billMonth);
  const response = await axiosInstance.get<TeamsExpensesListResponse>(
    ENDPOINTS.EXPENSES.TEAM,
    {
      params: queryParams,
    },
  );

  return response.data;
};

export const getFinanceExpensesList = async (filters: ListFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.perPage)
    queryParams.append("per_page", filters.perPage.toString());
  const DUMMY_FINANCE_EXPENSES_LIST = [
    {
      employee_name: "Mickey Mouse",
      amount: "999.99",
      user_expense_id: 6,
      expense_id: 106,
      user_id: 16,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-14T10:00:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Donald Duck",
      amount: "2100.00",
      user_expense_id: 7,
      expense_id: 107,
      user_id: 17,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-13T12:20:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Goofy",
      amount: "450.45",
      user_expense_id: 8,
      expense_id: 108,
      user_id: 18,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-12T09:40:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Tom Cat",
      amount: "1320.00",
      user_expense_id: 9,
      expense_id: 109,
      user_id: 19,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-11T15:10:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Jerry Mouse",
      amount: "300.00",
      user_expense_id: 10,
      expense_id: 110,
      user_id: 20,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-10T08:25:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "SpongeBob SquarePants",
      amount: "1750.80",
      user_expense_id: 11,
      expense_id: 111,
      user_id: 21,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-09T13:55:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Patrick Star",
      amount: "600.60",
      user_expense_id: 12,
      expense_id: 112,
      user_id: 22,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-08T17:30:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Bugs Bunny",
      amount: "2200.00",
      user_expense_id: 13,
      expense_id: 113,
      user_id: 23,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-07T11:45:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Daffy Duck",
      amount: "780.25",
      user_expense_id: 14,
      expense_id: 114,
      user_id: 24,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-06T14:05:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
    {
      employee_name: "Scooby-Doo",
      amount: "1340.90",
      user_expense_id: 15,
      expense_id: 115,
      user_id: 25,
      category: CATEGORY.TRAVEL,
      submitted_at: "2026-03-05T10:15:00Z",
      status: ReimbursementStatusEnum.APPROVED,
    },
  ];

  const response = {
    data: DUMMY_FINANCE_EXPENSES_LIST,
    page: 1,
    total: 10,
    per_page: 10,
    has_next_page: true,
  };

  return response;
};

export const getFinanceExpenseDetails = async (id: number) => {
  return {
    id: id,
    employee: {
      name: "Mickey Mouse",
      email: "mickey@company.com",
      code: "YT000",
    },
    amount: 1200,
    submitted_at: "2026-03-20T10:30:00Z",
    uploaded_at: "2026-03-20T11:00:00Z",
    status: WORKFLOW_PROGRESS_STATUS_ENUM.PENDING,
    category: CATEGORY.TRAVEL,
    name: "flight_ticket_mumbai.pdf",
    format: "pdf",
    note: "Flight from Chennai to Mumbai",
    url: "https://example.com/files/flight_ticket_mumbai.pdf",
  };
};
