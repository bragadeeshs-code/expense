import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import useTripsList from "../helpers/hooks/useTripsList";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
  setSorting,
} from "../helpers/state-management/features/tripsControllerSlice";
import { getTripsTableColumn } from "../helpers/table-columns/TripsTableColumn";
import type { TripItem } from "../helpers/types/trips.type";
import { TRIPS_QUERY_KEY } from "../helpers/constants/trips";
import useDeleteTrip from "../helpers/hooks/useDeleteTrip";
import DataTableLayout from "@/components/common/Table/DataTableLayout";
import { Sheet } from "@/components/ui/sheet";
import TripForm from "./TripForm";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

const MyTrips = () => {
  const [isTripFormOpen, setIsTripFormOpen] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const filters = useAppSelector((state: RootState) => state.tripsController);

  const queryClient = useQueryClient();

  const { tripsList, isTripsListLoading, pagination } = useTripsList(filters);
  const dispatch = useAppDispatch();

  const handleDeleteTrip = (trip: TripItem) => {
    setSelectedTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTripSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTrip(null);
    queryClient.invalidateQueries({
      queryKey: [TRIPS_QUERY_KEY],
    });
  };

  const { mutateTripDelete, isTripDeleteLoading } = useDeleteTrip({
    onSuccess: handleDeleteTripSuccess,
  });
  const columns = getTripsTableColumn({
    onEdit: (trip) => {
      setSelectedTrip(trip);
      setIsTripFormOpen(true);
    },
    onDelete: handleDeleteTrip,
  });

  const handleFormSubmitSuccess = () => {
    setIsTripFormOpen(false);
    queryClient.invalidateQueries({
      queryKey: [TRIPS_QUERY_KEY],
    });
  };
  return (
    <DataTableLayout
      title="Travel requests"
      isLoading={isTripsListLoading}
      search={filters.search}
      onSearch={(search) => dispatch(setSearchTextFilter(search))}
      onAddNew={() => {
        setSelectedTrip(null);
        setIsTripFormOpen(true);
      }}
      tableProps={{
        data: tripsList,
        columns,
        pagination,
        isLoading: isTripsListLoading,
        loadingMessage: "Travel requests loading...",
        onPrevious: () => dispatch(setPage(pagination.page - 1)),
        onNext: () => dispatch(setPage(pagination.page + 1)),
        paginationLabel: "Travel requests",
        getTableRowClassName: () => "cursor-pointer",
        emptyState: "no-trip",
        handlePerPage: (perPage) => dispatch(setPerPage(perPage)),
        sorting: filters.sorting,
        onSortingChange: (sorting) => dispatch(setSorting(sorting)),
      }}
    >
      <Sheet open={isTripFormOpen} onOpenChange={setIsTripFormOpen}>
        <TripForm
          onSuccess={handleFormSubmitSuccess}
          selectedTrip={selectedTrip}
          isTripFormOpen={isTripFormOpen}
        />
      </Sheet>
      <ConfirmAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Selected travel request?"
        content="You're about to delete selected travel request. This action cannot be undone."
        onConfirm={() => {
          if (selectedTrip) {
            mutateTripDelete({ id: selectedTrip.id });
          }
        }}
        cancelText="Cancel"
        confirmText={isTripDeleteLoading ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isTripDeleteLoading}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isApiResponseLoading={isTripDeleteLoading}
      />
    </DataTableLayout>
  );
};

export default MyTrips;
