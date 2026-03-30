import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import AppBadge from "@/components/common/AppBadge";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import type { AdvanceItem } from "../types/advances.type";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";
import { formatToINR } from "@/lib/utils";

export const getAdvancesTableColumn = (): ColumnDef<AdvanceItem>[] => [
  {
    accessorKey: "id",
    header: "Trip ID",
    cell: ({ row }) => {
      const year = new Date(row.original.trip_created_at).getFullYear();
      return (
        <AppBadge type={"BASIC"}>{`TRIP-${year}-${row.original.id}`}</AppBadge>
      );
    },
  },
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={
            row.original.employee ? row.original.employee : EMPTY_PLACEHOLDER
          }
          className="max-w-50"
        />
      );
    },
  },
  {
    header: "Advance Issued",
    accessorKey: "advance_issued",
    cell: ({ row }) => (
      <>₹ {formatToINR(Number(row.original.advance_issued))}</>
    ),
  },
  {
    header: "Balance",
    accessorKey: "balance_amount",
    cell: ({ row }) => (
      <>₹ {formatToINR(Number(row.original.balance_amount))}</>
    ),
  },

  {
    header: "Issued Date",
    accessorKey: "issued_date",
    cell: ({ row }) => <>{format(row.original.issued_date, "MMM d, yyyy")}</>,
  },
];
