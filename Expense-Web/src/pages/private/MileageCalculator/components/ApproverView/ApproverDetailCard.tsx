import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Textarea } from "@/components/ui/textarea";
import { notifyError, notifySuccess } from "@/lib/utils";
import { useTripComments } from "@/pages/private/MileageCalculator/helpers/hooks/useTripComments";
import { addTravelExpenseNote } from "@/services/mileage.service";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";

import type {
  MileageProject,
  TravelExpenseListItem,
  TravelExpenseModalType,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import ApproverDetailHeader from "@/pages/private/MileageCalculator/components/ApproverView/sub-components/ApproverDetailHeader";
import ApproverTripInfoCard from "@/pages/private/MileageCalculator/components/ApproverView/sub-components/ApproverTripInfoCard";
import ApproverNotesSection from "@/pages/private/MileageCalculator/components/ApproverView/sub-components/ApproverNotesSection";
import ApproverActionModals from "@/pages/private/MileageCalculator/components/ApproverView/sub-components/ApproverActionModals";
import ApproverFooterActions from "@/pages/private/MileageCalculator/components/ApproverView/sub-components/ApproverFooterActions";

interface ApproverDetailCardProps {
  trip: TravelExpenseListItem;
  projects: MileageProject[];
  isUpdating: boolean;
  onReject: (rejectReason: string) => void;
  onApprove: () => void;
}

const ApproverDetailCard: React.FC<ApproverDetailCardProps> = ({
  trip,
  projects,
  isUpdating,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const isActionable =
    trip.status !== TRAVEL_EXPENSE_STATUS.APPROVED &&
    trip.status !== TRAVEL_EXPENSE_STATUS.REJECTED;
  const matchingProject = projects.find((p) => p.id === trip.project_id);
  const [activeModal, setActiveModal] = useState<TravelExpenseModalType>(null);

  const {
    comments,
    newComment,
    pendingFile,
    setNewComment,
    handleSendComment,
    handleUploadFile,
    removePendingFile,
    isSending,
  } = useTripComments(trip.id);

  const handleActionOpen = (type: TravelExpenseModalType) => {
    setActiveModal(type);
  };

  const handleModalConfirm = async () => {
    if (activeModal === "request") {
      setActiveModal(null);
      try {
        await addTravelExpenseNote({
          notes: comment,
          expense_id: trip.id,
        });
        queryClient.invalidateQueries({
          queryKey: ["travel-expense-notes", trip.id],
        });
        notifySuccess(
          "Success",
          "Request Information has been sent successfully",
        );
        navigate("/mileage");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        notifyError("Failed", "Failed to add note");
      }
    } else if (activeModal === "reject") {
      setActiveModal(null);
      onReject(comment);
    } else if (activeModal === "approve") {
      setActiveModal(null);
      onApprove();
    }
  };

  return (
    <div className="font-inter mx-auto w-full max-w-[1150px] space-y-8 px-6 py-8">
      <ApproverDetailHeader trip={trip} matchingProject={matchingProject} />

      {/* Large Lilac Container Wrapper */}
      <div className="bg-light-pink border-powdered-orchid/12 rounded-2xl border p-6 shadow-sm">
        <div className="space-y-6">
          <ApproverTripInfoCard trip={trip} />
          <ApproverNotesSection
            comments={comments}
            newComment={newComment}
            pendingFile={pendingFile}
            setNewComment={setNewComment}
            handleSendComment={handleSendComment}
            handleFileUpload={handleUploadFile}
            removePendingFile={removePendingFile}
            isSending={isSending}
          />
        </div>
      </div>

      {/* Floating Comment Textarea — only shown when action is possible */}
      {isActionable && (
        <div className="w-full">
          <Textarea
            placeholder="Please add a comment before you proceed to reject or request info..."
            className="bg-soft-gray-bg/30 min-h-[100px] w-full rounded-[24px] border border-gray-100 p-6 text-[13px] font-medium text-gray-400 italic shadow-sm focus-visible:ring-1 focus-visible:ring-purple-100"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      )}

      <ApproverFooterActions
        isActionable={isActionable}
        isUpdating={isUpdating}
        onGoBack={() => navigate("/mileage")}
        onActionOpen={handleActionOpen}
      />

      <ApproverActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onConfirm={handleModalConfirm}
        comment={comment}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ApproverDetailCard;
