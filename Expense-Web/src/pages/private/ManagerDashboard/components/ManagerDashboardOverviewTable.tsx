import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/common/Table/DataTable";
import { Card } from "@/components/ui/card";

interface ManagerDashboardOverviewTableProps<T> {
  title: string;
  columns: ColumnDef<T>[];
  tableData: T[];
  emptyState: string;
  loadingMessage: string;
  paginationLabel: string;
  isManagerDashboardLoading: boolean;
}

const ManagerDashboardOverviewTable = <T,>({
  title,
  columns,
  tableData,
  emptyState,
  loadingMessage,
  paginationLabel,
  isManagerDashboardLoading,
}: ManagerDashboardOverviewTableProps<T>) => {
  return (
    <Card className="border-porcelain shadow-card-soft @container w-full rounded-2xl border px-4 py-5">
      <p className="text-sm font-semibold text-black">{title}</p>
      <DataTable<T>
        data={tableData}
        columns={columns}
        isLoading={isManagerDashboardLoading}
        emptyState={emptyState}
        loadingMessage={loadingMessage}
        paginationLabel={paginationLabel}
        getTableRowClassName={() => "cursor-pointer"}
        tableRowClassName="bg-frosted-lavender"
      />
    </Card>
  );
};
export default ManagerDashboardOverviewTable;
