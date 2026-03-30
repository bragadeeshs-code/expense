import type { ApprovalStatusEnum } from "../../Extraction/helpers/constants/extraction";
import type { ReimbursementStatusEnum } from "@/helpers/constants/common";

export type ApprovalStatusType = Exclude<
  ApprovalStatusEnum,
  ApprovalStatusEnum.PENDING
>;

export interface UserExpenseStatusResponse {
  id: number;
  status: ApprovalStatusType;
  created_at: string;
  updated_at: string;
  user_expense_id: number;
}

export interface UserExpenseStatusParams {
  status: ApprovalStatusType;
  userExpenseId: number;
}

export type ExpenseExtractResponse = {
  user_expense_id: number;
  expense_id: number;
  expense_name: string;
  status: ReimbursementStatusEnum;
};

export type ExpenseExtractRequest = {
  userExpenseID: number;
};
