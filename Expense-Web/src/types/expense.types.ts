import type { ReimbursementStatusEnum } from "@/helpers/constants/common";
import type {
  CurrentUserProject,
  ListFilters,
  Pagination,
  SelectOption,
} from "./common.types";
import type {
  CATEGORY,
  SUB_CATEGORY,
} from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import type { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";

export interface TeamsExpensesListFilters extends ListFilters {
  columnFilters: ReimbursementColumnFilters;
}

export interface TeamsExpenseItem {
  id: number;
  employee_name: string;
  bill_date: string;
  status: ReimbursementStatusEnum;
  amount: string;
  project_code: string;
  scope: string | null;
  category: CATEGORY;
  sub_category: SUB_CATEGORY;
  user_expense_id: number;
  approval_status: ApprovalStatusEnum;
}

export interface TeamsExpensesListResponse extends Pagination {
  data: TeamsExpenseItem[];
}

export interface ReimbursementColumnFilters {
  status: SelectOption<ReimbursementStatusEnum>[];
  categories: SelectOption<CATEGORY>[];
  subCategories: SelectOption<SUB_CATEGORY>[];
  billDate?: string;
  billMonth?: string;
  approvalStatus: SelectOption<ApprovalStatusEnum>[];
  projects: CurrentUserProject[];
}
