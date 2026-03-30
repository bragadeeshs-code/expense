import { format } from "date-fns";
import { startCase } from "lodash";

import type { ColumnDef } from "@tanstack/react-table";

import AppBadge from "@/components/common/AppBadge";
import TableActions from "@/components/common/Table/TableActions";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import type { FinanceExpense } from "../types/finance-dashboard.types";

interface getFinanceExpenseColumnsProps {
  onView: (expense: FinanceExpense) => void;
}

const getFinanceExpenseColumns = ({
  onView,
}: getFinanceExpenseColumnsProps): ColumnDef<FinanceExpense>[] => [
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={row.original.employee_name}
          className="max-w-50"
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <TruncatedTextWithTooltip
          text={startCase(row.original.category)}
          className="max-w-50"
        />
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <p>₹ {row.original.amount}</p>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <>{format(row.original.submitted_at, "d MMM yyyy")}</>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <AppBadge type="BASIC">{startCase(row.original.status)}</AppBadge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <TableActions onView={() => onView(row.original)} />;
    },
  },
];

export default getFinanceExpenseColumns;
