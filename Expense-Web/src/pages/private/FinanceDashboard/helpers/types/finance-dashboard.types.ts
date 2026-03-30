import type { CATEGORY } from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import type { ReimbursementStatusEnum } from "@/helpers/constants/common";
import type { UserInfo } from "@/types/user.types";
import type { WORKFLOW_PROGRESS_STATUS_ENUM } from "../constants/finance-dashboard";
import type { Pagination } from "@/types/common.types";

export interface FinanceExpense {
  employee_name: string;
  amount: string;
  user_expense_id: number;
  expense_id: number;
  user_id: number;
  category: CATEGORY;
  submitted_at: string;
  status: ReimbursementStatusEnum;
}

export interface FinanceExpenses extends Pagination {
  data: FinanceExpense[];
}

export interface FinanceExpenseDetails {
  id: number;
  employee: UserInfo;
  amount: number;
  submitted_at: string;
  uploaded_at: string;
  status: WORKFLOW_PROGRESS_STATUS_ENUM;
  category: CATEGORY;
  name: string;
  format: string;
  note: string;
  url: string;
}

export interface FinanceExpenseWorkflowStep {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}
