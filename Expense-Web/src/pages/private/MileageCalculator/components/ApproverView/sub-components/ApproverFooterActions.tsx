import { Button } from "@/components/ui/button";
import type { TravelExpenseModalType } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

interface ApproverFooterActionsProps {
  isUpdating: boolean;
  isActionable: boolean;
  onGoBack: () => void;
  onActionOpen: (type: TravelExpenseModalType) => void;
}

const ApproverFooterActions: React.FC<ApproverFooterActionsProps> = ({
  isActionable,
  isUpdating,
  onGoBack,
  onActionOpen,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <Button
        variant="outline"
        className="border-fog-gray px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-black"
        onClick={onGoBack}
      >
        Go back
      </Button>
      {isActionable && (
        <div className="order-1 flex flex-col gap-3 sm:order-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="border-fog-gray px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-black"
              onClick={() => onActionOpen("request")}
              disabled={isUpdating}
            >
              Request info
            </Button>
            <Button
              variant="outline"
              className="border-tomato-red text-tomato-red hover:bg-tomato-red px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] hover:text-white"
              onClick={() => onActionOpen("reject")}
              disabled={isUpdating}
            >
              Reject
            </Button>
          </div>
          <Button
            className="[background-image:var(--gradient-primary)] px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-white"
            onClick={() => onActionOpen("approve")}
            disabled={isUpdating}
          >
            Approve reimbursement
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApproverFooterActions;
