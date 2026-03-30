import type { ColumnDef } from "@tanstack/react-table";
import type { Pagination } from "@/types/common.types";
import { useTeamsExpensesTableColumns } from "./useTeamsExpensesTableColumns";
import type {
  ReimbursementColumnFilters,
  TeamsExpenseItem,
} from "@/types/expense.types";
import { REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/common";
import ExpenseFilters from "../ReimbursementsList/ExpenseFilters";
import DataTableLayout from "../Table/DataTableLayout";

interface TeamExpenseListProps {
  title: string;
  isLoading: boolean;
  data: TeamsExpenseItem[];
  pagination: Pagination;
  search: string;
  onSearch: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange: (value: number) => void;
  onRowClick?: (row: TeamsExpenseItem) => void;
  getTableRowClassName?: (row: TeamsExpenseItem) => string;
  loadingMessage: string;
  paginationLabel: string;
  columnFilters: ReimbursementColumnFilters;
  onFiltersChange: (columnFilters: ReimbursementColumnFilters) => void;
  onResetFilters: () => void;
  shouldShowApprovalStatusFilter?: boolean;
}

const TeamExpenseList: React.FC<TeamExpenseListProps> = ({
  title,
  isLoading,
  data,
  pagination,
  search,
  onSearch,
  onPrevious,
  onNext,
  onPerPageChange,
  onRowClick,
  getTableRowClassName,
  loadingMessage,
  paginationLabel,
  columnFilters,
  onFiltersChange,
  onResetFilters,
  shouldShowApprovalStatusFilter = true,
}) => {
  const columns: ColumnDef<TeamsExpenseItem>[] = useTeamsExpensesTableColumns();

  return (
    <DataTableLayout
      title={title}
      isLoading={isLoading}
      search={search}
      onSearch={onSearch}
      columnFilters={columnFilters}
      defaultFilters={REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE}
      onResetFilters={onResetFilters}
      filtersComponent={
        <ExpenseFilters
          columnFilters={columnFilters}
          onFiltersChange={onFiltersChange}
          shouldShowApprovalStatusFilter={shouldShowApprovalStatusFilter}
        />
      }
      tableProps={{
        data,
        columns,
        pagination,
        isLoading,
        loadingMessage,
        onPrevious,
        onNext,
        paginationLabel,
        onRowClick,
        getTableRowClassName,
        emptyState: "no-document",
        handlePerPage: onPerPageChange,
      }}
    />
  );
};

export default TeamExpenseList;
