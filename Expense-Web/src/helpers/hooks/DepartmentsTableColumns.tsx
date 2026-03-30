import type { ColumnDef } from "@tanstack/react-table";

import TableActions from "@/components/common/Table/TableActions";
import type { DepartmentResponse } from "@/types/departments.types";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";

interface DepartmentsTableColumnsProps {
  onDelete: (department: DepartmentResponse) => void;
  onEdit: (department: DepartmentResponse) => void;
}

export const getDepartmentsTableColumns = ({
  onDelete,
  onEdit,
}: DepartmentsTableColumnsProps): ColumnDef<DepartmentResponse>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip text={row.original.name} className="max-w-50" />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <TableActions
          onView={() => {}}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      );
    },
  },
];
