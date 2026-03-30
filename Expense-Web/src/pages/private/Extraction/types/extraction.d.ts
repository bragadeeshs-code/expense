type EmptyStateType =
  | "no-documents"
  | "no-selection"
  | "no-document"
  | "no-data"
  | "Approved"
  | "Pending"
  | "Rejected"
  | "no-chart-data"
  | "no-extracted-document-data"
  | "no-employees"
  | "no-projects"
  | "no-grades"
  | "no-company-assets"
  | "no-cost-centers"
  | "no-project-overviews"
  | "no-departments"
  | "no-notification"
  | (typeof ApprovalStatusEnum)[keyof typeof ApprovalStatusEnum]
  | "no-cost-center-overviews";

type ExpenseApprovalStatus = "Approved" | "Pending";

interface ExpenseBadge {
  name: string;
  amount: number;
  className?: string;
  currency?: string;
}

interface ExtractionOutletContext {
  templateControllerRef: Ref<(() => Record<string, unknown>) | null>;
}

interface ExpenseSubmitResponse extends ExpenseSubmitRequestParams {
  id: number;
  status: ExpenseApprovalStatus;
  overall_document_confidence: number;
}

interface ExpenseSubmitRequestParams {
  flight_class?: string;
  train_class?: string;
  accommodation_type?: string;
  project_id?: number;
  note: string;
  data: Record<string, unknown>;
}

type ExceedLimitSubmitType =
  (typeof EXCEED_LIMIT_SUBMIT_TYPE_ENUM)[keyof typeof EXCEED_LIMIT_SUBMIT_TYPE_ENUM];

interface DeleteExpenseResponse {
  id: number;
  name: string;
}
