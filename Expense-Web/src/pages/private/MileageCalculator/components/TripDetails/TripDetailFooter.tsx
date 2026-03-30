import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MileageProject } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";

interface TripDetailFooterProps {
  status: TRAVEL_EXPENSE_STATUS;
  isUpdating: boolean;
  selectedProject: MileageProject | null;
  onCancel: () => void;
  onUpdate: (projectId: number) => void;
}

const TripDetailFooter = ({
  status,
  isUpdating,
  selectedProject,
  onCancel,
  onUpdate,
}: TripDetailFooterProps) => {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 bg-white/50 p-4 pt-2 backdrop-blur-md sm:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 border-gray-200 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {status === TRAVEL_EXPENSE_STATUS.DRAFTED && (
          <Button
            className="flex-1 [background-image:var(--gradient-primary)] px-2 py-2.5 text-xs leading-[100%] font-medium tracking-[0%] text-white sm:px-4 sm:text-sm"
            disabled={!selectedProject || isUpdating}
            onClick={() => selectedProject && onUpdate(selectedProject.id)}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Request reimbursement"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripDetailFooter;
