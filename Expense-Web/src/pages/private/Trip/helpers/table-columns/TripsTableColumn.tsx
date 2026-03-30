import { format } from "date-fns";
import { startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import type { TripItem } from "../types/trips.type";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

import AppBadge from "@/components/common/AppBadge";
import TableActions from "@/components/common/Table/TableActions";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";

interface getTripsTableColumnProps {
  onView?: () => void;
  onEdit: (trip: TripItem) => void;
  onDelete: (trip: TripItem) => void;
}

export const getTripsTableColumn = ({
  onEdit,
  onDelete,
}: getTripsTableColumnProps): ColumnDef<TripItem>[] => [
  {
    accessorKey: "id",
    header: "Trip ID",
    size: 40,
    cell: ({ row }) => {
      const year = new Date(row.original.created_at).getFullYear();
      return (
        <AppBadge type={"BASIC"}>{`TRIP-${year}-${row.original.id}`}</AppBadge>
      );
    },
  },
  {
    accessorKey: "project",
    header: "Project ID",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={row.original.project.code}
          className="max-w-50"
        />
      );
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={row.original.destination}
          className="max-w-50"
        />
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    enableSorting: true,
    cell: ({ row }) => (
      <p>
        {row.original.start_date
          ? format(row.original.start_date, "d MMM yyyy")
          : EMPTY_PLACEHOLDER}
      </p>
    ),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    enableSorting: true,
    cell: ({ row }) => (
      <p>
        {row.original.end_date
          ? format(row.original.end_date, "d MMM yyyy")
          : EMPTY_PLACEHOLDER}
      </p>
    ),
  },
  {
    accessorKey: "mode_of_travel",
    header: "Mode of Travel",
    cell({ row }) {
      return <>{startCase(row.original.mode_of_travel)}</>;
    },
  },
  {
    accessorKey: "hotel_accommodation_needed",
    header: "Hotel Accommodation Needed",
    cell: ({ row }) => (
      <p>{row.original.hotel_accommodation_needed ? "Yes" : "No"}</p>
    ),
  },
  {
    accessorKey: "vehicle_needed",
    header: "Vehicle Needed",
    cell: ({ row }) => <p>{row.original.vehicle_needed ? "Yes" : "No"}</p>,
  },
  {
    accessorKey: "advance_needed",
    header: "Adv. Needed",
    cell: ({ row }) => <p>{row.original.advance_needed ? "Yes" : "No"}</p>,
  },
  {
    accessorKey: "advance_amount",
    header: "Adv. Amount",
    enableSorting: true,
    cell: ({ row }) => (
      <p>
        {row.original.advance_amount
          ? `₹ ${row.original.advance_amount}`
          : EMPTY_PLACEHOLDER}
      </p>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <AppBadge type={row.original.status}>
          {startCase(row.original.status)}
        </AppBadge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <TableActions
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      );
    },
  },
];
