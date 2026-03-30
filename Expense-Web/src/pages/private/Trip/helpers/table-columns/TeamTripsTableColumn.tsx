import { format } from "date-fns";
import { startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import type { TeamTripItem } from "../types/trips.type";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

import AppBadge from "@/components/common/AppBadge";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import { Button } from "@/components/ui/button";
import { TRIP_STATUS_ENUM } from "../constants/trips";

interface GetTeamTripsTableColumnsProps {
  onApprove: (trip: TeamTripItem) => void;
  onReject: (trip: TeamTripItem) => void;
}

export const getTeamTripsTableColumns = ({
  onApprove,
  onReject,
}: GetTeamTripsTableColumnsProps): ColumnDef<TeamTripItem>[] => [
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
    accessorKey: "project_code",
    header: "Project ID",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={row.original.project_code}
          className="max-w-50"
        />
      );
    },
  },
  {
    accessorKey: "submitted_by",
    header: "Submitted by",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={row.original.submitted_by}
          className="max-w-60"
        />
      );
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
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
    header: "Advance Needed",
    cell: ({ row }) => <p>{row.original.advance_needed ? "Yes" : "No"}</p>,
  },
  {
    accessorKey: "advance_amount",
    header: "Amount",
    enableSorting: true,
    cell: ({ row }) => (
      <p>
        {row.original.advance_amount
          ? row.original.advance_amount
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
        <>
          {row.original.status === TRIP_STATUS_ENUM.SUBMITTED ? (
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onApprove(row.original)}
                className="border-spring-green text-spring-green rounded-md border text-xs font-medium"
                size="sm"
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-coral-red text-coral-red rounded-md border text-xs font-medium"
                size="sm"
                onClick={() => onReject(row.original)}
              >
                Reject
              </Button>
            </div>
          ) : (
            EMPTY_PLACEHOLDER
          )}
        </>
      );
    },
  },
];
