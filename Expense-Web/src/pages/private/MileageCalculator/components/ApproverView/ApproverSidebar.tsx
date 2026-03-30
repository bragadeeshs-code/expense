import { Navigation, PanelLeftOpen } from "lucide-react";

import React from "react";

import { cn } from "@/lib/utils";
import { ASSET_PATH } from "@/helpers/constants/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
  TimelinePoint,
  TravelExpenseListItem,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

interface ApproverSidebarProps {
  trip: TravelExpenseListItem;
  isOpen?: boolean;
  className?: string;
  onClose?: () => void;
}

const ApproverSidebar: React.FC<ApproverSidebarProps> = ({
  trip,
  isOpen,
  className,
  onClose,
}) => {
  // Futuristic Dynamic Navigation Points logic
  const timelineItems = React.useMemo<TimelinePoint[]>(() => {
    const items: TimelinePoint[] = [];
    const [startTime, endTime] = trip.activity_time?.split(" - ") || [
      "N/A",
      "N/A",
    ];

    if (trip.from_location) {
      items.push({
        title: `Started from`,
        address: trip.from_location.name,
        time: startTime,
        type: "square",
      });
    }

    if (trip.to_location) {
      items.push({
        title: `Arrived at`,
        address: trip.to_location.name,
        time: endTime,
        type: "navigation",
      });
    }

    return items;
  }, [trip]);

  return (
    <>
      {/* Overlay Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "flex flex-col bg-transparent", // Always transparent container
          // ── Mobile: fixed overlay drawer ──
          "fixed inset-y-0 right-0 z-30 w-[320px] shadow-2xl sm:w-[360px]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          // ── Desktop: in-flow panel ──
          "lg:relative lg:inset-auto lg:z-auto lg:h-full lg:shadow-none",
          "lg:translate-x-0 lg:transition-all lg:duration-300 lg:ease-in-out",
          isOpen
            ? "lg:visible lg:w-[360px] lg:opacity-100"
            : "lg:invisible lg:w-0 lg:min-w-0 lg:flex-none lg:basis-0 lg:overflow-hidden lg:opacity-0",
          className,
        )}
      >
        {/* Inner container wrapper */}
        <div
          className={cn(
            "lg:border-frosted-white-gray flex h-full w-[360px] flex-col bg-white transition-opacity duration-200 lg:border-l",
            isOpen ? "opacity-100" : "opacity-0", // Disappear quickly
          )}
        >
          {/* Title Section matching Image 2 Title Header */}
          <div className="flex shrink-0 items-center gap-2 p-6 pt-24 pb-4 sm:pt-6">
            <button
              onClick={onClose}
              className="text-deep-charcoal flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            >
              <PanelLeftOpen className="h-5 w-5 opacity-70" />
            </button>
            <h3 className="text-deep-charcoal text-base font-black tracking-tight whitespace-nowrap">
              Trip summary
            </h3>
          </div>

          <div className="scrollbar-hide scrollbar-thin flex-1 overflow-y-auto px-6 pb-6">
            {/* User Card - Matching Image 2 precisely: Light Blue rounded container */}
            <div className="bg-periwinkle-card mb-8 flex items-center gap-3 rounded-2xl border border-blue-50/50 p-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage alt={trip?.customer_name || "N/A"} />
                <AvatarFallback className="bg-pale-purple text-vivid-violet text-[10px] font-bold uppercase">
                  {trip?.customer_name?.[0] || "-"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-deep-charcoal truncate text-[13px] leading-tight font-black">
                  {trip?.customer_name || "N/A"}
                  <span className="text-slate-cool ml-2 text-[11px] font-bold">
                    &bull;
                  </span>
                  <span className="ml-2 inline-flex items-center gap-1.5 align-middle">
                    <img
                      src={`${ASSET_PATH}/icons/bike.svg`}
                      className="h-3 w-3 opacity-60"
                      alt="bike"
                    />
                    <span className="text-slate-cool text-[11px] font-bold">
                      {trip?.vehicle || "N/A"}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {/* Timeline Visualization - Perfectly Aligned and Dynamic */}
            <div className="mt-8 space-y-0 pl-1">
              {timelineItems.map((point, idx) => (
                <div key={idx} className="relative flex gap-5 pb-10 last:pb-0">
                  {/* Connector Line - Precise center alignment */}
                  {idx !== timelineItems.length - 1 && (
                    <div className="border-soft-periwinkle absolute top-7 bottom-[-10px] left-2.5 w-0 border-l-2 border-dashed" />
                  )}

                  {/* Left Side: Dynamic Icon */}
                  <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
                    {point.type === "square" ? (
                      <div className="bg-periwinkle-blue h-3.5 w-3.5 rounded-sm" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                        <Navigation className="fill-periwinkle-blue text-periwinkle-blue h-3.5 w-3.5 rotate-135" />
                      </div>
                    )}
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex min-w-0 flex-1 items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-deep-charcoal truncate text-[13px] leading-tight font-black tracking-tight">
                        {point.title}
                      </h4>
                      <p className="text-slate-cool mt-1 truncate text-[11px] leading-relaxed font-bold opacity-90">
                        {point.address}
                      </p>
                    </div>
                    <span className="text-mist-gray mt-0.5 shrink-0 text-[10px] font-black tracking-tight">
                      {point.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApproverSidebar;
