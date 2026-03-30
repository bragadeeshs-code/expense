import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectOverview } from "../../types/manager-dashboard.types";

export const getProjectOverviewColumns = (): ColumnDef<ProjectOverview>[] => [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "total_budget",
    header: "Budget",
    cell: ({ row }) => <p>{`₹ ${row.original.total_budget}`}</p>,
  },
  {
    accessorKey: "total_spent",
    header: "Spent",
    cell: ({ row }) => <p>{`₹ ${row.original.total_spent}`}</p>,
  },
];
