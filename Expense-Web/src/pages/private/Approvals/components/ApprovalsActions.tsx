import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import ApprovalActionDialog from "./ApprovalActionDialog";
import { ApprovalStatusEnum } from "../../Extraction/helpers/constants/extraction";
import type { ApprovalStatusType } from "../types/approvals.types";

interface ApprovalsActionsProps {
  userExpenseId: number;
  setApproveSuccessDialogVisibility: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

const ApprovalsActions: React.FC<ApprovalsActionsProps> = ({
  userExpenseId,
  setApproveSuccessDialogVisibility,
}) => {
  const [isApprovalActionDialogOpen, setIsApprovalActionDialogOpen] =
    useState<boolean>(false);
  const [approvalActionDialogType, setApprovalActionDialogType] =
    useState<ApprovalStatusType | null>(null);

  useEffect(() => {
    if (!isApprovalActionDialogOpen) setApprovalActionDialogType(null);
  }, [isApprovalActionDialogOpen]);

  return (
    <>
      <div className="flex justify-end gap-2 px-5">
        <Button
          variant="outline"
          type="button"
          className="border-coral-red text-coral-red hover:text-coral-red hover:bg-crimson-red text-sm leading-5 font-medium tracking-[0%] @min-sm:min-w-30"
          onClick={() => {
            setIsApprovalActionDialogOpen(true);
            setApprovalActionDialogType(ApprovalStatusEnum.REJECTED);
          }}
        >
          Reject
        </Button>
        <Button
          type="button"
          onClick={() => {
            setIsApprovalActionDialogOpen(true);
            setApprovalActionDialogType(ApprovalStatusEnum.APPROVED);
          }}
          variant="default"
          className="rounded-[0.5rem] [background-image:var(--gradient-primary)] px-4 py-2.5 text-sm leading-5 font-medium tracking-[0%] text-white @min-sm:min-w-30"
        >
          Approve
        </Button>
      </div>
      {approvalActionDialogType && (
        <ApprovalActionDialog
          isOpen={isApprovalActionDialogOpen}
          setIsOpen={setIsApprovalActionDialogOpen}
          userExpenseId={userExpenseId}
          approvalActionDialogType={approvalActionDialogType}
          setApproveSuccessDialogVisibility={setApproveSuccessDialogVisibility}
        />
      )}
    </>
  );
};

export default ApprovalsActions;
