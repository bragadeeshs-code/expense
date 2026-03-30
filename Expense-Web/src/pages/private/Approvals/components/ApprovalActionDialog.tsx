import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ASSET_PATH,
  EXPENSE_DETAILS_QUERY_KEY,
  TEAM_EXPENSES_LIST_QUERY_KEY,
} from "@/helpers/constants/common";
import { ApprovalStatusEnum } from "../../Extraction/helpers/constants/extraction";

import AppDialog from "@/components/common/AppDialog";
import useUserExpenseStatus from "../helpers/hooks/useUserExpenseStatus";
import { queryClient } from "@/lib/queryClient";
import type { ApprovalStatusType } from "../types/approvals.types";

interface ApprovalActionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userExpenseId: number;
  approvalActionDialogType: ApprovalStatusType;
  setApproveSuccessDialogVisibility: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

const ApprovalActionDialog: React.FC<ApprovalActionDialogProps> = ({
  isOpen,
  setIsOpen,
  userExpenseId,
  approvalActionDialogType,
  setApproveSuccessDialogVisibility,
}) => {
  const isApprovalActionDialogTypeApprove =
    approvalActionDialogType === ApprovalStatusEnum.APPROVED;

  const { mutateUserExpenseStatus, isUserExpenseStatusPending } =
    useUserExpenseStatus({
      onSuccess: (status: ApprovalStatusType) => {
        setIsOpen(false);
        if (status === ApprovalStatusEnum.APPROVED) {
          setApproveSuccessDialogVisibility(true);
        } else {
          queryClient.invalidateQueries({
            queryKey: [EXPENSE_DETAILS_QUERY_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [TEAM_EXPENSES_LIST_QUERY_KEY],
          });
        }
      },
    });

  const handleApproval = () => {
    mutateUserExpenseStatus({
      status: approvalActionDialogType,
      userExpenseId,
    });
  };

  return (
    <AppDialog
      dialogInnerContainerClassName="sm:p-6"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isWrapperDivAvailable
      shouldShowDialogClose={false}
      dialogHeaderImage={
        <img
          src={`${ASSET_PATH}/icons/warning.svg`}
          alt="icon"
          className="h-10 w-10"
        />
      }
      dialogHeaderClassName="sm:text-left "
      dialogTitleClassName="mt-5 "
      dialogHeader={
        isApprovalActionDialogTypeApprove
          ? "Approve Expense ?"
          : "Do you want to reject this expense ?"
      }
      description={
        isApprovalActionDialogTypeApprove
          ? "This expense exceeds the allowed limit. Do you want to proceed with approval?"
          : "You're about to reject the expense. This action cannot be undone."
      }
      className="sm:min-w-[560px]"
    >
      <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          type="button"
          className="border-vivid-violet text-vivid-violet hover:bg-frosted-lavender hover:text-vivid-violet w-full bg-transparent px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%] sm:w-33"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>

        <Button
          type="button"
          className={cn(
            isApprovalActionDialogTypeApprove
              ? "border-vivid-violet w-full [background-image:var(--gradient-primary)] px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%] sm:w-33"
              : "bg-coral-red hover:bg-coral-red px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%] text-white lg:w-30",
          )}
          disabled={isUserExpenseStatusPending}
          onClick={handleApproval}
        >
          {isApprovalActionDialogTypeApprove
            ? isUserExpenseStatusPending
              ? "Approving..."
              : "Approve"
            : isUserExpenseStatusPending
              ? "Rejecting..."
              : "Reject"}
        </Button>
      </div>
    </AppDialog>
  );
};

export default ApprovalActionDialog;
