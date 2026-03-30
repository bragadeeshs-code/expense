import { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";

export const APPROVALS_LIST_TAB_FILTERS: TabItem<ApprovalStatusEnum>[] = [
  {
    label: "Pending",
    value: ApprovalStatusEnum.PENDING,
  },
  {
    label: "Approved",
    value: ApprovalStatusEnum.APPROVED,
  },
  {
    label: "Rejected",
    value: ApprovalStatusEnum.REJECTED,
  },
];
