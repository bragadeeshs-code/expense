import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
  setSorting,
} from "../helpers/state-management/features/teamTripsControllerSlice";
import { getTeamTripsTableColumns } from "../helpers/table-columns/TeamTripsTableColumn";
import DataTableLayout from "@/components/common/Table/DataTableLayout";
import useTeamTripsList from "../helpers/hooks/useTeamTripsList";
import useStatusTrip from "../helpers/hooks/useStatusTrip";
import {
  TEAM_TRIPS_QUERY_KEY,
  TRIP_STATUS_ENUM,
} from "../helpers/constants/trips";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import type { TripStatusUpdateParams } from "../helpers/types/trips.type";

const TeamTrips = () => {
  const filters = useAppSelector(
    (state: RootState) => state.teamTripsController,
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] =
    useState<TripStatusUpdateParams | null>(null);

  const queryClient = useQueryClient();

  const { tripsList, isTripsListLoading, pagination } =
    useTeamTripsList(filters);

  const dispatch = useAppDispatch();
  const handleStatusTripSuccess = () => {
    setIsStatusDialogOpen(false);
    setSelectedTrip(null);
    queryClient.invalidateQueries({
      queryKey: [TEAM_TRIPS_QUERY_KEY],
    });
  };
  const { isTripStatusLoading, mutateTripStatus } = useStatusTrip({
    onSuccess: handleStatusTripSuccess,
  });
  const columns = getTeamTripsTableColumns({
    onApprove: (trip) => {
      setIsStatusDialogOpen(true);
      setSelectedTrip({ id: trip.id, status: TRIP_STATUS_ENUM.APPROVED });
    },
    onReject: (trip) => {
      setIsStatusDialogOpen(true);
      setSelectedTrip({ id: trip.id, status: TRIP_STATUS_ENUM.REJECTED });
    },
  });

  return (
    <DataTableLayout
      title="Team travel requests"
      isLoading={isTripsListLoading}
      search={filters.search}
      onSearch={(search) => dispatch(setSearchTextFilter(search))}
      tableProps={{
        data: tripsList,
        columns: columns,
        pagination,
        isLoading: isTripsListLoading,
        loadingMessage: "Team travel requests loading...",
        onPrevious: () => dispatch(setPage(pagination.page - 1)),
        onNext: () => dispatch(setPage(pagination.page + 1)),
        paginationLabel: "Team travel requests",
        getTableRowClassName: () => "cursor-pointer",
        emptyState: "no-trip",
        handlePerPage: (perPage) => dispatch(setPerPage(perPage)),
        sorting: filters.sorting,
        onSortingChange: (sorting) => dispatch(setSorting(sorting)),
      }}
    >
      <ConfirmAlertDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        title={`${selectedTrip?.status === TRIP_STATUS_ENUM.APPROVED ? "Approve" : "Reject"} selected travel request?`}
        content={`You're about to ${selectedTrip?.status === TRIP_STATUS_ENUM.APPROVED ? "approve" : "reject"} selected travel request. This action cannot be undone.`}
        onConfirm={() => {
          if (selectedTrip) {
            mutateTripStatus(selectedTrip);
          }
        }}
        cancelText="Cancel"
        confirmText={
          selectedTrip?.status === TRIP_STATUS_ENUM.APPROVED
            ? isTripStatusLoading
              ? "Approving..."
              : "Approve"
            : isTripStatusLoading
              ? "Rejecting..."
              : "Reject"
        }
        confirmVariant="destructive"
        disabled={isTripStatusLoading}
        onCancel={() => setIsStatusDialogOpen(false)}
        isApiResponseLoading={isTripStatusLoading}
      />
    </DataTableLayout>
  );
};

export default TeamTrips;
