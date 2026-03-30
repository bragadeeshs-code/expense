import { ASSET_PATH, TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import { MILEAGE_STATUS_STYLES } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import type {
  MileageProject,
  TravelExpenseListItem,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { cn } from "@/lib/utils";
import AppBadge from "@/components/common/AppBadge";

interface ApproverDetailHeaderProps {
  trip: TravelExpenseListItem;
  matchingProject?: MileageProject;
}

const ApproverDetailHeader: React.FC<ApproverDetailHeaderProps> = ({
  trip,
  matchingProject,
}) => {
  const status = trip?.status as TRAVEL_EXPENSE_STATUS;

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <h1 className="text-deep-charcoal text-[32px] font-bold">
            Mileage-{trip.id}
          </h1>
          <div className="flex gap-2">
            <span className="bg-iced-lavender border-pale-purple text-dim-gray rounded-2xl border px-4 py-1 text-[10px] font-bold sm:rounded-full sm:text-xs">
              CC-1784
            </span>
            <span className="bg-iced-lavender border-pale-purple text-dim-gray rounded-2xl border px-4 py-1 text-[10px] font-bold sm:rounded-full sm:text-xs">
              {trip?.project_name || matchingProject?.name || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-iced-lavender border-pale-purple flex items-center gap-1.5 rounded-full border px-3 py-1">
            <img
              src={`${ASSET_PATH}/icons/${trip?.vehicle?.toLowerCase() === "car" ? "car_frontage.svg" : "bike.svg"}`}
              className="h-3.5 w-3.5 opacity-70"
              alt={trip?.vehicle || "vehicle"}
            />
            <span className="text-deep-charcoal text-[11px] font-bold capitalize">
              {trip?.vehicle || "N/A"}
            </span>
          </div>

          <AppBadge
            className={cn(
              "rounded-full border-none px-4 py-1 text-[11px] font-bold capitalize",
              status &&
                MILEAGE_STATUS_STYLES[
                  status.toLowerCase() as TRAVEL_EXPENSE_STATUS
                ],
            )}
          >
            {status?.toLowerCase() === TRAVEL_EXPENSE_STATUS.DRAFTED
              ? "Draft"
              : status?.replace(/_/g, " ") || "N/A"}
          </AppBadge>
        </div>
      </div>
    </div>
  );
};

export default ApproverDetailHeader;
