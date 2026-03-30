import { Navigation } from "lucide-react";
import { format, parseISO } from "date-fns";

import { ASSET_PATH } from "@/helpers/constants/common";
import {
  formatDuration,
  formatCarbonEmission,
} from "@/pages/private/MileageCalculator/helpers/utils/mileageUtils";
import type { TravelExpenseListItem } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApproverTripInfoCardProps {
  trip: TravelExpenseListItem;
}

const ApproverTripInfoCard: React.FC<ApproverTripInfoCardProps> = ({
  trip,
}) => {
  return (
    <div className="border-frosted-white-gray overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/2">
      {/* Blue Header Row */}
      <div className="bg-frost-azure flex items-center gap-2 px-6 py-4">
        <Avatar className="h-5 w-5 border border-white">
          <AvatarImage src="" alt={trip?.customer_name || "N/A"} />
          <AvatarFallback className="bg-pale-purple text-vivid-violet text-[10px] font-bold uppercase">
            {trip?.customer_name?.[0] || "-"}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <p className="text-deep-charcoal text-xs font-bold">
            {trip?.customer_name || "N/A"}
          </p>
          <span className="text-gray-400">&bull;</span>
          <div className="flex items-center gap-1.5 opacity-60">
            <img
              src={`${ASSET_PATH}/icons/${trip?.vehicle?.toLowerCase() === "car" ? "car_frontage.svg" : "bike.svg"}`}
              className="h-3.5 w-3.5"
              alt={trip?.vehicle || "vehicle"}
            />
            <span className="text-slate-cool text-xs font-medium capitalize">
              {trip?.vehicle || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Distance Boxes Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex min-w-0 items-center gap-4">
            <Navigation className="fill-periwinkle-light text-periwinkle-light h-5 w-5 shrink-0 animate-pulse" />
            <div className="bg-soft-gray-surface flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-xl px-5 py-3">
              <span className="text-slate-cool shrink-0 text-sm font-medium">
                From &middot;
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-deep-charcoal cursor-help truncate text-sm font-bold">
                    {trip?.from_location?.name || "N/A"}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-[300px]">
                    {trip?.from_location?.name || "N/A"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-4">
            <div className="bg-periwinkle-light h-4 w-4 shrink-0 rounded-sm" />
            <div className="bg-soft-gray-surface flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-xl px-5 py-3">
              <span className="text-slate-cool shrink-0 text-sm font-medium">
                To &middot;
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-deep-charcoal cursor-help truncate text-sm font-bold">
                    {trip?.to_location?.name || "N/A"}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-[300px]">
                    {trip?.to_location?.name || "N/A"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-gray-400">
              Trip details:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-deep-charcoal text-sm font-black">
                {formatDuration(trip?.duration_seconds) || "0m"}
              </p>
              <span className="bg-porcelain text-deep-charcoal rounded px-2 py-0.5 text-[11px] font-black">
                {trip?.distance || "0"}km
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-gray-400">
              Date of travel:
            </p>
            <p className="text-deep-charcoal flex items-center gap-1.5 text-sm font-black">
              <span>
                {trip?.from_date
                  ? format(parseISO(trip.from_date), "MMM dd, yyyy")
                  : "N/A"}
              </span>
              <span className="font-normal text-gray-400">→</span>
              <span>
                {trip?.to_date
                  ? format(parseISO(trip.to_date), "MMM dd, yyyy")
                  : "N/A"}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-gray-400">
              Scope &amp; Mileage:
            </p>
            <p className="text-deep-charcoal text-sm font-black">
              {trip?.scope || "N/A"} &bull; {trip?.mileage || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-gray-400">
              Carbon emission:
            </p>
            <p className="text-deep-charcoal text-sm font-black">
              {formatCarbonEmission(trip?.carbon_emission)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproverTripInfoCard;
