import type { TravelExpenseModalType } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import ApproverModal from "@/pages/private/MileageCalculator/components/ApproverView/ApproverModal";

interface ApproverActionModalsProps {
  comment: string;
  isUpdating: boolean;
  activeModal: TravelExpenseModalType;
  onClose: () => void;
  onConfirm: () => void;
}

const ApproverActionModals: React.FC<ApproverActionModalsProps> = ({
  comment,
  isUpdating,
  activeModal,
  onClose,
  onConfirm,
}) => {
  return (
    <>
      {/* Approve Modal */}
      <ApproverModal
        isOpen={activeModal === "approve"}
        onClose={onClose}
        title="Approve Mileage Submission?"
        description="Once approved, this submission will be marked as completed and the employee will be notified."
        confirmLabel="Approve"
        onConfirm={onConfirm}
        isLoading={isUpdating}
      />

      {/* Reject Modal */}
      <ApproverModal
        isOpen={activeModal === "reject"}
        onClose={onClose}
        title={
          !comment.trim() ? "Provide Reason for Rejection" : "Are you sure?"
        }
        description={
          !comment.trim()
            ? "A comment is required to explain why this mileage submission is being rejected. Add your note to proceed."
            : "you want to reject this record?"
        }
        confirmLabel="Reject"
        onConfirm={onConfirm}
        isLoading={isUpdating}
        isConfirmDisabled={!comment.trim()}
        isReject
      >
        {comment.trim() && (
          <div className="rounded-2xl bg-rose-50 p-5 text-center ring-1 ring-rose-200/30">
            <p className="mb-2 text-xs font-bold tracking-wider text-rose-600/60">
              Your comment
            </p>
            <div className="scrollbar-hide max-h-[160px] overflow-y-auto px-2">
              <p className="text-deep-charcoal text-sm leading-relaxed font-bold wrap-break-word italic">
                "{comment}"
              </p>
            </div>
          </div>
        )}
      </ApproverModal>

      {/* Request Info Modal */}
      <ApproverModal
        isOpen={activeModal === "request"}
        onClose={onClose}
        title={
          !comment.trim() ? "Additional Details Required" : "Are you sure?"
        }
        description={
          !comment.trim()
            ? "Please add a comment explaining what information you need from the employee. Your note is required to continue."
            : "you want to request info for this record?"
        }
        confirmLabel="Request Info"
        onConfirm={onConfirm}
        isLoading={isUpdating}
        isConfirmDisabled={!comment.trim()}
      >
        {comment.trim() && (
          <div className="bg-vivid-violet/5 ring-vivid-violet/10 rounded-2xl p-5 text-center ring-1">
            <p className="text-vivid-violet/60 mb-2 text-xs font-bold tracking-wider">
              Your comment
            </p>
            <div className="scrollbar-hide scrollbar-thin max-h-[160px] overflow-y-auto px-2">
              <p className="text-deep-charcoal text-sm leading-relaxed font-bold wrap-break-word italic">
                "{comment}"
              </p>
            </div>
          </div>
        )}
      </ApproverModal>
    </>
  );
};

export default ApproverActionModals;
