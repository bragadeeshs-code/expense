export const DEFAULT_SELECT_FIELD_VALUE = {
  name: "",
  value: "",
};

export const UPLOADED_DOCUMENTS_LIST_QUERY_KEY = "uploadedDocumentList";

export const EXTRACTED_DATA_TABLE_ITEM_COLORS = [
  "bg-lavender-veil",
  "bg-porcelain-gray/40",
  "bg-herbal-cream/40",
  "bg-soft-coral-cream/40",
  "bg-powdered-orchid/40",
];

export enum MY_EXPENSES {
  UPLOADED = "uploaded",
  SUBMITTED = "submitted",
}

export const MyExpensesTabs: TabItem<MY_EXPENSES>[] = [
  {
    label: "Drafts",
    value: MY_EXPENSES.UPLOADED,
  },
  {
    label: "Submitted",
    value: MY_EXPENSES.SUBMITTED,
  },
];

export enum EXCEED_LIMIT_SUBMIT_TYPE_ENUM {
  SUBMIT_TO_MANAGER = "submit_to_manager",
  SUBMIT_UPTO_LIMIT = "submit_upto_limit",
}

export enum ApprovalStatusEnum {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

export const REIMBURSEMENTS_LIST_QUERY_KEY = "reimbursements";
