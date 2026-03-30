import AppDialog from "@/components/common/AppDialog";
import { ASSET_PATH } from "@/helpers/constants/common";

interface ApprovalSubmissionSuccessDialogProps {
  isOpen: boolean;
  setApproveSuccessDialogVisibility: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

const ApprovalSubmissionSuccessDialog: React.FC<
  ApprovalSubmissionSuccessDialogProps
> = ({ isOpen, setApproveSuccessDialogVisibility }) => {
  return (
    <AppDialog
      dialogHeader="Expense approved"
      dialogHeaderImage={
        <img
          src={`${ASSET_PATH}/icons/approval_submission_success_tick.svg`}
          alt="Tick icon"
          className="mb-8"
        />
      }
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) setApproveSuccessDialogVisibility(false);
      }}
      isWrapperDivAvailable
      dialogTitleClassName="mb-3"
      dialogHeaderClassName="items-center gap-0"
      description="The full amount has been approved successfully. This request is now complete."
      className="min-w-[560px]"
    />
  );
};

export default ApprovalSubmissionSuccessDialog;
