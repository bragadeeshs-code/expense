import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

import { ASSET_PATH } from "@/helpers/constants/common";
import type { TravelExpenseListItem } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import {
  formatDuration,
  formatCarbonEmission,
} from "@/pages/private/MileageCalculator/helpers/utils/mileageUtils";

import TooltipWrapper from "@/components/common/TooltipWrapper";

interface TripInfoSectionProps {
  trip: TravelExpenseListItem;
}

const TripInfoSection = ({ trip }: TripInfoSectionProps) => {
  const displayDuration = formatDuration(trip.duration_seconds) || "N/A";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-deep-charcoal text-sm font-semibold">
          Trip details
        </h2>
        <div className="flex items-center gap-[10px] text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1">
            <p className="text-steel-gray text-xs">Distance</p>
            <p className="text-deep-charcoal text-xs font-semibold">
              {trip.distance}km
            </p>
          </span>
          <p className="text-steel-gray">&bull;</p>
          <span className="flex items-center gap-1">
            <Clock className="text-steel-gray h-3 w-3" />
            <p className="text-deep-charcoal font-semibold">
              {displayDuration}
            </p>
          </span>
        </div>
      </div>

      {/* Intermediate Card (Image 3 style) */}
      <div className="relative rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative pl-8">
          {/* Vertical Dashed Line inside card */}
          <div className="absolute top-7 bottom-1 left-[11px] border-l border-dashed border-gray-200" />

          {/* Box style From */}
          <div className="relative">
            <div className="border-slate-whisper absolute top-1/2 -left-6.5 z-10 flex h-[10px] w-[10px] -translate-y-1/2 items-center justify-center rounded-full border-3" />
            <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3">
              <TooltipWrapper content={trip.from_location.name || "N/A"}>
                <p className="text-deep-charcoal max-w-[150px] space-x-1 truncate text-xs font-semibold">
                  <span className="text-steel-gray text-xs font-semibold">
                    From &bull;
                  </span>
                  <span>{trip.from_location.name || "N/A"}</span>
                </p>
              </TooltipWrapper>
              <img
                src={`${ASSET_PATH}/icons/lock_fill.svg`}
                className="h-4 w-4 shrink-0 opacity-40"
                alt="lock"
              />
            </div>
          </div>

          {/* Details in center */}
          <div className="flex flex-col gap-3 py-4 pr-2">
            {/* <div className="flex justify-between text-xs">
              <p className="text-steel-gray font-medium">Activity:</p>
              <span className="font-medium text-black">-</span>
            </div> */}
            <div className="flex justify-between text-xs">
              <p className="text-steel-gray font-medium">Date of Travel:</p>
              <span className="flex items-center gap-1.5 font-medium text-black">
                <span>{format(parseISO(trip.from_date), "MMM dd, yyyy")}</span>
                <span className="font-normal text-gray-400">→</span>
                <span>{format(parseISO(trip.to_date), "MMM dd, yyyy")}</span>
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <p className="text-steel-gray font-medium">Travel Distance:</p>
              <span className="font-medium text-black">
                {trip?.distance || "N/A"}km
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <p className="text-steel-gray font-medium">Carbon emission:</p>
              <span className="font-medium text-black">
                {formatCarbonEmission(trip?.carbon_emission)}
              </span>
            </div>
          </div>

          {/* Box style To */}
          <div className="relative">
            <div className="border-slate-whisper absolute top-1/2 -left-6.5 z-10 flex h-[10px] w-[10px] -translate-y-1/2 items-center justify-center rounded-full border-3" />
            <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3">
              <TooltipWrapper content={trip.to_location.name || "N/A"}>
                <p className="text-deep-charcoal max-w-[150px] space-x-1 truncate text-xs font-semibold">
                  <span className="text-steel-gray text-xs font-semibold">
                    To &bull;
                  </span>
                  <span>{trip.to_location.name || "N/A"}</span>
                </p>
              </TooltipWrapper>
              <img
                src={`${ASSET_PATH}/icons/lock_fill.svg`}
                className="h-4 w-4 shrink-0 opacity-40"
                alt="lock"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripInfoSection;
