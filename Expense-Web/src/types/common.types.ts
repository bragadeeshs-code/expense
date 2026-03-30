import type { SortingState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";

import type { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";
import type { ReimbursementColumnFilters } from "./expense.types";
import type { ReimbursementStatusEnum } from "@/helpers/constants/common";

export type Pagination = {
  page: number;
  total: number;
  per_page: number;
  has_next_page: boolean;
};

export interface ReimbursementListFilters extends ListFilters {
  sorting: SortingState;
  columnFilters: ReimbursementColumnFilters;
}

export type SortingStateUpdater =
  | SortingState
  | ((old: SortingState) => SortingState);

interface ReimbursementSplit {
  id: number;
  email: string;
  amount: string;
  status: ReimbursementStatusEnum;
}

export interface Reimbursement {
  id: number;
  name: string;
  format: string;
  category: string;
  sub_category: string | null;
  document_no: string;
  total_amount: number;
  project_code: string;
  scope: string;
  user_amount: string;
  status: ReimbursementStatusEnum;
  split_with: ReimbursementSplit[];
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  vendor_name: string | null;
  bill_date: string | null;
  tat_date: string | null;
  user_expense_id: number;
  approval_statuses: ApprovalStatusEnum[];
}

export interface ReimbursementsList extends Pagination {
  data: Reimbursement[];
}

export interface ReimbursementDocument {
  id: number;
  name: string;
  format: string | null;
}

export interface DatePickerProps {
  value?: Date | null;
  showIcon?: boolean;
  className?: string;
  isInvalid?: boolean;
  placeholder?: string;
  buttonClassName?: string;
  onChange?: (date?: Date) => void;
  disabledDates?: (date: Date) => boolean;
  placeholderClassName?: string;
  disabled?: boolean;
}

export interface ProjectMember {
  id: number;
  first_name: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}
// PROJECTS & APPROVALS

export interface CurrentUserProject {
  id: number;
  name: string;
  code: string;
}

export interface Approver {
  approval_level: number;
  approver_id: number;
}

export interface ProjectBase {
  name: string;
  description: string;
  code: string;
  monthly_budget: string;
  total_budget: string;
}

export interface AddProjectPayload extends Omit<
  ProjectBase,
  "monthly_budget" | "total_budget"
> {
  manager_id: number;
  member_ids: number[];
  approvers: Approver[];
  monthly_budget: number;
  total_budget: number;
}

export interface ProjectDetailResponse extends ProjectBase {
  id: number;
  manager: ProjectMember;
  budget: string;
  members: ProjectMember[];
  approvers: {
    approver: ProjectMember;
    approval_level: number;
  }[];
}

export interface AddProjectResponse extends ProjectBase {
  id: number;
  manager_id: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
  members: {
    user_id: number;
  }[];
  approvers: Approver[];
}
export interface ProjectListFilters {
  search: string;
  page: number;
  per_page: number;
}

export interface ProjectResponseMember {
  first_name: string;
  last_name: string;
}

export interface ProjectResponseData extends ProjectBase {
  id: number;
  created_at: string;
  total_members: number;
  members: ProjectResponseMember[];
  current_month_spent: string;
  total_spent: string;
}

export interface ProjectsResponse extends Pagination {
  data: ProjectResponseData[];
}

export interface CurrentUserProjectsResponse extends Pagination {
  data: CurrentUserProject[];
}

export interface DeleteProjectResponse {
  id: number;
}

export interface ListFilters {
  page: number;
  search: string;
  perPage: number;
  sorting?: SortingState;
}

export interface FileUploadResponse {
  message: string;
}

export interface FileUploadDialogProps {
  headerText: string;
  title: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isFileUploading: boolean;
  onFileSelected: (file: File) => void;
  onSampleTemplateClick: () => void;
}
