import { startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import type { GradeItem } from "@/types/grades.types";

import TableActions from "../Table/TableActions";
import TruncatedTextWithTooltip from "../TruncatedTextWithTooltip";

interface getGradesTableColumnsProps {
  onEdit: (grade: GradeItem) => void;
  onDelete: (grade: GradeItem) => void;
}

export const getGradesTableColumns = ({
  onEdit,
  onDelete,
}: getGradesTableColumnsProps): ColumnDef<GradeItem>[] => [
  {
    accessorKey: "name",
    header: "Grade",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip text={row.original.name} className="max-w-50" />
    ),
  },
  {
    accessorKey: "daily_limit",
    header: "Daily limit",
    cell: ({ row }) => <p>{`₹ ${row.original.daily_limit}`}</p>,
  },
  {
    accessorKey: "monthly_limit",
    header: "Monthly limit",
    cell: ({ row }) => <p>{`₹ ${row.original.monthly_limit}`}</p>,
  },
  {
    accessorKey: "auto_approval_threshold_type",
    header: () => (
      <div className="leading-tight">
        Auto-approval
        <br />
        threshold
      </div>
    ),
    cell: ({ row }) => (
      <p>{startCase(row.original.auto_approval_threshold_type)}</p>
    ),
  },
  {
    accessorKey: "train_class",
    header: "Train class",
    cell: ({ row }) => <p>{startCase(row.original.train_class)}</p>,
  },
  {
    accessorKey: "flight_class",
    header: "Flight class",
    cell: ({ row }) => <p>{startCase(row.original.flight_class)}</p>,
  },
  {
    accessorKey: "domestic_accommodation_limit",
    header: () => (
      <div className="leading-tight">
        Domestic
        <br />
        accommodation limit
      </div>
    ),
    cell: ({ row }) => (
      <p>{`₹ ${row.original.domestic_accommodation_limit}`}</p>
    ),
  },
  {
    accessorKey: "international_accommodation_limit",
    header: () => (
      <div className="leading-tight whitespace-normal">
        International
        <br />
        accommodation limit
      </div>
    ),
    cell: ({ row }) => (
      <p>{`₹ ${row.original.international_accommodation_limit}`}</p>
    ),
  },
  {
    accessorKey: "food_daily_limit",
    header: "Food daily limit",
    cell: ({ row }) => <p>{`₹ ${row.original.food_daily_limit}`}</p>,
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
