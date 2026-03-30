import { ReimbursementStatusEnum } from "@/helpers/constants/common";

export const REIMBURSEMENTS_LIST_TAB_FILTERS: TabItem<ReimbursementStatusEnum>[] =
  [
    {
      label: "Pending",
      value: ReimbursementStatusEnum.PENDING,
    },
    {
      label: "Approved",
      value: ReimbursementStatusEnum.APPROVED,
    },
    {
      label: "Rejected",
      value: ReimbursementStatusEnum.REJECTED,
    },
  ];
