import type { SortingState } from "@tanstack/react-table";

import type { Pagination } from "@/types/common.types";
import type { ReimbursementStatusEnum } from "@/helpers/constants/common";

export interface SplitWith {
  id: number;
  email: string;
  amount: string;
  status: string;
}

export interface UploadedDocument {
  id: number;
  name: string;
  vendor_name: string | null;
  project_code: string | null;
  format: string | null;
  category: string | null;
  sub_category: string | null;
  total_amount: string | null;
  bill_date: string | null;
  scope: string | null;
  user_amount: string | null;
  status: ReimbursementStatusEnum;
  split_with: SplitWith[];
  user_expense_id: number;
  created_at: string;
  updated_at: string;
  document_no: string;
}

export type UploadedDocumentList = UploadedDocument[];

export interface UploadedDocumentFilters {
  page: number;
  search: string;
  perPage: number;
  sorting: SortingState;
}

export interface UploadedDocumentListResponse extends Pagination {
  data: UploadedDocumentList;
}

export interface ExpensesDeleteAllResponse {
  deleted_ids: number[];
  failed_ids: number[];
}
