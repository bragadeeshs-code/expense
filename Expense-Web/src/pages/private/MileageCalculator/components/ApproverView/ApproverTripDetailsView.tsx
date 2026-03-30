import React, { useState } from "react";
import { useNavigate } from "react-router";
import { PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { MileageExpenseResponse } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import type {
  MileageProject,
  TravelExpenseListItem,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import MapFallback from "@/components/mileage/MapFallback";
import ApproverSidebar from "@/pages/private/MileageCalculator/components/ApproverView/ApproverSidebar";
import ApproverDetailCard from "@/pages/private/MileageCalculator/components/ApproverView/ApproverDetailCard";

interface ApproverTripDetailsViewProps {
  trip: TravelExpenseListItem;
  projects: MileageProject[];
  isUpdating: boolean;
  onApprove: UseMutateFunction<MileageExpenseResponse, Error, void, unknown>;
  onReject: UseMutateFunction<MileageExpenseResponse, Error, string, unknown>;
  mapError?: boolean;
}

const ApproverTripDetailsView: React.FC<ApproverTripDetailsViewProps> = ({
  trip,
  projects,
  mapError,
  isUpdating,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Trigger map resize smoothly during the transition
  React.useEffect(() => {
    // Immediate resize
    window.dispatchEvent(new Event("resize"));

    // Continuous resize during the 300ms transition for smoothness
    const interval = setInterval(() => {
      window.dispatchEvent(new Event("resize"));
    }, 16); // ~60fps

    const timer = setTimeout(() => {
      clearInterval(interval);
      window.dispatchEvent(new Event("resize"));
    }, 350); // Slightly longer than transition

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-misty-snow relative flex h-full w-full">
      {/* Main Content Area (Left) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Map Section (Top 40%) */}
        <div className="border-platinum-edge relative h-[350px] w-full shrink-0 border-b">
          {mapError ? (
            <MapFallback />
          ) : (
            <div id="trip-detail-map" className="h-full w-full" />
          )}
        </div>

        {/* Scrollable Details Area (Bottom 60%) */}
        <div className="scrollbar-hide scrollbar-thin flex-1 overflow-y-auto">
          <ApproverDetailCard
            trip={trip}
            projects={projects}
            isUpdating={isUpdating}
            onApprove={() => {
              onApprove(undefined, {
                onSuccess: () => navigate("/mileage"),
              });
            }}
            onReject={(rejectReason: string) => {
              onReject(rejectReason, {
                onSuccess: () => navigate("/mileage"),
              });
            }}
          />
        </div>
      </div>

      {/* Trip Summary Sidebar (Right on desktop, Overlay on mobile) */}
      <ApproverSidebar
        trip={trip}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Desktop Sidebar Open Toggle (when closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-vivid-violet absolute top-[370px] right-0 z-20 hidden h-14 w-10 items-center justify-center rounded-l-2xl border border-r-0 border-gray-200 bg-white shadow-2xl transition-all hover:w-12 lg:flex"
        >
          <PanelLeftOpen className="h-6 w-6 rotate-180 opacity-80" />
        </button>
      )}

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "bg-vivid-violet fixed right-6 bottom-32 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 lg:hidden",
          !isSidebarOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0",
        )}
      >
        <PanelLeftOpen className="h-6 w-6 rotate-180" />
      </button>
    </div>
  );
};

export default ApproverTripDetailsView;
