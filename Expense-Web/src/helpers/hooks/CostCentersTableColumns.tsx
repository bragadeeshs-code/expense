import type { ColumnDef } from "@tanstack/react-table";

import type { CostCenterResponse } from "@/types/cost-center.types";

import TableActions from "@/components/common/Table/TableActions";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";

interface CostCentersTableColumnsProps {
  onView: () => void;
  onEdit: (costCenter: CostCenterResponse) => void;
  onDelete: (costCenter: CostCenterResponse) => void;
}

export const getCostCentersTableColumns = ({
  onView,
  onEdit,
  onDelete,
}: CostCentersTableColumnsProps): ColumnDef<CostCenterResponse>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip text={row.original.code} className="max-w-50" />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <TableActions
          onView={onView}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      );
    },
  },
];
