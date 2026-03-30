import { useSearchParams } from "react-router";

import { RoleEnum } from "@/helpers/constants/common";
import { useTripMap } from "@/pages/private/MileageCalculator/helpers/hooks/useTripMap";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import { EXPENSE_TRAVEL_ENUM } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import { useTripDetailsLogic } from "@/pages/private/MileageCalculator/helpers/hooks/useTripDetailsLogic";

import MapFallback from "@/components/mileage/MapFallback";
import UserTripDetailsView from "@/pages/private/MileageCalculator/components/UserView/UserTripDetailsView";
import ApproverTripDetailsView from "@/pages/private/MileageCalculator/components/ApproverView/ApproverTripDetailsView";

const MileageTripDetails = () => {
  const [searchParams] = useSearchParams();
  const tabs = searchParams.get("tabs");

  const {
    trip,
    isLoading,
    projects,
    isProjectsFetching,
    handleUpdateExpense,
    handleApprove,
    handleReject,
    isUpdating,
    search,
    handleSearch,
  } = useTripDetailsLogic();

  const { data: userData } = useCurrentuser();

  // Determine view based on role and tab context
  // If it's my_travel, show User view even for admins/managers
  const isApproverView =
    (userData?.role === RoleEnum.ADMIN ||
      userData?.role === RoleEnum.MANAGER) &&
    tabs !== EXPENSE_TRAVEL_ENUM.MY_TRAVEL;

  const { mapError } = useTripMap(trip);

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center font-bold text-gray-500">
        Loading trip details...
      </div>
    );

  if (!trip)
    return (
      <div className="flex h-full items-center justify-center font-bold text-gray-500">
        Trip not found
      </div>
    );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-white">
      {isApproverView ? (
        <ApproverTripDetailsView
          trip={trip}
          projects={projects?.data || []}
          isUpdating={isUpdating}
          onApprove={handleApprove}
          onReject={handleReject}
          mapError={mapError}
        />
      ) : (
        <>
          {/* Map Background for User View */}
          {mapError ? (
            <div className="absolute inset-0 z-9 h-full w-full bg-white">
              <MapFallback />
            </div>
          ) : (
            <div
              id="trip-detail-map"
              className="absolute inset-0 h-full w-full"
            />
          )}
          <UserTripDetailsView
            trip={trip}
            projects={projects}
            isProjectsFetching={isProjectsFetching}
            handleUpdateExpense={handleUpdateExpense}
            isUpdating={isUpdating}
            search={search}
            handleSearch={handleSearch}
          />
        </>
      )}
    </div>
  );
};

export default MileageTripDetails;
