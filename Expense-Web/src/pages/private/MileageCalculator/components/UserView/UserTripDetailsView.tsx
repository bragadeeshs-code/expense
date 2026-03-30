import { Info } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useTripComments } from "@/pages/private/MileageCalculator/helpers/hooks/useTripComments";
import { STATIC_COST_CENTERS } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import type {
  MileageProject,
  TravelExpenseListItem,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import TripNotes from "@/pages/private/MileageCalculator/components/TripDetails/TripNotes";
import TripTimeline from "@/pages/private/MileageCalculator/components/TripDetails/TripTimeline";
import TripInfoSection from "@/pages/private/MileageCalculator/components/TripDetails/TripInfoSection";
import TripDetailHeader from "@/pages/private/MileageCalculator/components/TripDetails/TripDetailHeader";
import TripDetailFooter from "@/pages/private/MileageCalculator/components/TripDetails/TripDetailFooter";

interface ProjectFormValues {
  project: MileageProject | null;
  cost_center: string | null;
}

interface UserTripDetailsViewProps {
  trip: TravelExpenseListItem;
  search: string;
  projects: { data: MileageProject[] } | undefined;
  isUpdating: boolean;
  isProjectsFetching: boolean;
  handleSearch: (value: string) => void;
  handleUpdateExpense: (
    projectId: number,
    options?: { onSuccess?: () => void },
  ) => void;
}

const UserTripDetailsView: React.FC<UserTripDetailsViewProps> = ({
  trip,
  search,
  projects,
  isUpdating,
  isProjectsFetching,
  handleSearch,
  handleUpdateExpense,
}) => {
  const navigate = useNavigate();
  const [isCardVisible, setIsCardVisible] = useState<boolean>(true);

  const {
    comments,
    inputRef,
    isLoading,
    isSending,
    newComment,
    chatContainerRef,
    pendingFile,
    setNewComment,
    handleSendComment,
    handleUploadFile,
    removePendingFile,
  } = useTripComments(trip.id);

  const { control, setValue } = useForm<ProjectFormValues>({
    defaultValues: {
      project: null,
      cost_center: STATIC_COST_CENTERS[0].value,
    },
  });

  // Set default project when trip and projects are loaded
  useEffect(() => {
    if (trip?.project_id && projects?.data) {
      const matchingProject = projects.data.find(
        (p) => p.id === trip.project_id,
      );
      if (matchingProject) {
        setValue("project", matchingProject);
      }
    }
  }, [trip?.project_id, projects?.data, setValue]);

  const selectedProject = useWatch({
    control,
    name: "project",
  });

  const status =
    (trip.status as TRAVEL_EXPENSE_STATUS) || TRAVEL_EXPENSE_STATUS.DRAFTED;

  return (
    <>
      <div
        className={cn(
          "fixed inset-4 z-10 flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-sm transition-all duration-500",
          "sm:absolute sm:inset-auto sm:top-5 sm:right-auto sm:bottom-5 sm:left-5 sm:w-full sm:max-w-[400px]",
          isCardVisible
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-[120%] opacity-0",
        )}
      >
        <TripDetailHeader
          tripId={trip.id}
          status={status}
          setIsCardVisible={setIsCardVisible}
          control={control}
          projects={projects?.data || []}
          isProjectsFetching={isProjectsFetching}
          search={search}
          handleSearch={handleSearch}
        />

        <hr className="mx-6 border-gray-100" />

        <div className="scrollbar-hide scrollbar-thin flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <TripInfoSection trip={trip} />
            <TripTimeline
              fromAddress={trip.from_location.name || "N/A"}
              toAddress={trip.to_location.name || "N/A"}
              activityTime={trip?.activity_time}
            />

            <h2 className="text-deep-charcoal text-sm font-semibold">Notes</h2>
            <TripNotes
              comments={comments}
              newComment={newComment}
              pendingFile={pendingFile}
              setNewComment={setNewComment}
              chatContainerRef={chatContainerRef}
              inputRef={inputRef}
              handleSendComment={handleSendComment}
              handleFileUpload={handleUploadFile}
              removePendingFile={removePendingFile}
              isLoading={isLoading}
              isSending={isSending}
            />
          </div>
        </div>

        <TripDetailFooter
          onCancel={() => navigate("/mileage")}
          onUpdate={(projectId) => {
            handleUpdateExpense(projectId, {
              onSuccess: () => {
                navigate("/mileage");
              },
            });
          }}
          isUpdating={isUpdating}
          selectedProject={selectedProject}
          status={status}
        />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCardVisible(true)}
        className={cn(
          "bg-vivid-violet fixed bottom-6 left-6 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 sm:bottom-10 sm:left-10",
          !isCardVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-20 scale-50 opacity-0",
        )}
      >
        <Info className="h-6 w-6" />
      </button>
    </>
  );
};

export default UserTripDetailsView;
