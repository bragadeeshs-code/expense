import type { ColumnDef } from "@tanstack/react-table";
import type { CostCenterOverview } from "../../types/manager-dashboard.types";

export const getCostCenterOverviewColumns =
  (): ColumnDef<CostCenterOverview>[] => [
    {
      accessorKey: "code",
      header: "Cost center",
    },
    {
      accessorKey: "allocated",
      header: "Allocated",
    },
    {
      accessorKey: "used",
      header: "Used",
    },
    {
      accessorKey: "balance",
      header: "Balance",
    },
  ];
