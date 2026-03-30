import { size } from "lodash";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";

import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";
import {
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
  ReimbursementStatusEnum,
} from "@/helpers/constants/common";
import { useReimbursementsTableColumns } from "./ReimbursementsColumns";
import { REIMBURSEMENTS_LIST_QUERY_KEY } from "@/pages/private/Extraction/helpers/constants/extraction";
import type { ReimbursementColumnFilters } from "@/types/expense.types";
import type {
  Pagination,
  Reimbursement,
  ReimbursementDocument,
} from "@/types/common.types";
import useDeleteExpense from "@/pages/private/Extraction/helpers/hooks/useDeleteExpense";
import ConfirmAlertDialog from "../ConfirmAlertDialog";
import useDeleteAllExpense from "@/pages/private/Extraction/helpers/hooks/useDeleteAllExpense";
import ExpenseFilters from "./ExpenseFilters";
import DataTableLayout from "../Table/DataTableLayout";

interface ReimbursementsListProps {
  title: string;
  isFetching: boolean;
  reimbursements: Reimbursement[];
  pagination: Pagination;
  search: string;
  onSearch: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange: (value: number) => void;
  onRowClick: (row: Reimbursement) => void;
  loadingMessage: string;
  columnFilters: ReimbursementColumnFilters;
  onFiltersChange: (columnFilters: ReimbursementColumnFilters) => void;
  sorting: SortingState;
  onSortingChange: (sortingState: SortingState) => void;
  onResetFilters: () => void;
  shouldShowBillDateFilter?: boolean;
  shouldShowApprovalStatusFilter?: boolean;
  shouldShowSubCategoryFilter?: boolean;
}

const ReimbursementsList: React.FC<ReimbursementsListProps> = ({
  title,
  isFetching,
  reimbursements,
  pagination,
  search,
  onSearch,
  onPrevious,
  onNext,
  onPerPageChange,
  onRowClick,
  loadingMessage,
  columnFilters,
  onFiltersChange,
  sorting,
  onSortingChange,
  onResetFilters,
  shouldShowBillDateFilter = true,
  shouldShowApprovalStatusFilter = true,
  shouldShowSubCategoryFilter = true,
}) => {
  const [previewReimbursement, setPreviewReimbursement] =
    useState<ReimbursementDocument | null>(null);

  const [userExpenseIdsToDelete, setUserExpenseIdsToDelete] = useState<
    number[]
  >([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const queryClient = useQueryClient();

  const deletableUserExpenseCount = size(userExpenseIdsToDelete);

  const handleDeleteSuccess = () => {
    setUserExpenseIdsToDelete([]);
    queryClient.invalidateQueries({
      queryKey: [REIMBURSEMENTS_LIST_QUERY_KEY],
    });
    setRowSelection({});
  };

  const columns: ColumnDef<Reimbursement>[] = useReimbursementsTableColumns({
    onDeleteDocument: (userExpenseIdToDelete: number) => {
      setUserExpenseIdsToDelete([userExpenseIdToDelete]);
    },
    handlePreview: (reimbursement) =>
      setPreviewReimbursement({
        id: reimbursement.id,
        name: reimbursement.name,
        format: reimbursement.format,
      }),
  });

  const { isExpenseDeleteLoading, mutateExpenseDelete } = useDeleteExpense({
    onSuccess: handleDeleteSuccess,
  });

  const { isDeleteAllExpenseLoading, mutateDeleteAllExpense } =
    useDeleteAllExpense({
      onSuccess: handleDeleteSuccess,
    });

  return (
    <DataTableLayout<Reimbursement, ReimbursementColumnFilters>
      title={title}
      isLoading={isFetching}
      search={search}
      onSearch={onSearch}
      columnFilters={columnFilters}
      defaultFilters={REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE}
      onResetFilters={onResetFilters}
      filtersComponent={
        <ExpenseFilters
          columnFilters={columnFilters}
          onFiltersChange={onFiltersChange}
          shouldShowBillDateFilter={shouldShowBillDateFilter}
          shouldShowApprovalStatusFilter={shouldShowApprovalStatusFilter}
          shouldShowSubCategoryFilter={shouldShowSubCategoryFilter}
        />
      }
      tableProps={{
        data: reimbursements,
        columns,
        pagination,
        isLoading: isFetching,
        loadingMessage,
        onPrevious,
        onNext,
        handlePerPage: onPerPageChange,
        onRowClick,
        emptyState: "no-document",
        paginationLabel: "expenses",
        sorting,
        onSortingChange,
        getTableRowClassName: () => "cursor-pointer",
        enableRowSelection: (row) =>
          row.original.status === ReimbursementStatusEnum.PENDING,
        getRowId: (row) => row.id.toString(),
        rowSelection,
        onRowSelectionChange: setRowSelection,
        enableColumnResize: true,
        onDeleteAll: () =>
          setUserExpenseIdsToDelete(Object.keys(rowSelection).map(Number)),
      }}
    >
      <DocumentPreviewModal
        document={previewReimbursement}
        onClose={() => setPreviewReimbursement(null)}
      />

      <ConfirmAlertDialog
        open={!!deletableUserExpenseCount}
        onOpenChange={(open) => {
          if (!open) setUserExpenseIdsToDelete([]);
        }}
        title={
          deletableUserExpenseCount > 1
            ? "Delete Selected Files?"
            : "Delete Selected File?"
        }
        content={`You're about to delete selected file${deletableUserExpenseCount > 1 ? "s" : ""}. This action cannot be undone.`}
        onConfirm={() => {
          if (deletableUserExpenseCount > 1) {
            mutateDeleteAllExpense({ ids: userExpenseIdsToDelete });
          } else {
            mutateExpenseDelete({ id: userExpenseIdsToDelete[0] });
          }
        }}
        cancelText="Cancel"
        confirmText={
          isExpenseDeleteLoading || isDeleteAllExpenseLoading
            ? "Deleting..."
            : "Delete"
        }
        confirmVariant="destructive"
        disabled={isExpenseDeleteLoading || isDeleteAllExpenseLoading}
        isApiResponseLoading={
          isExpenseDeleteLoading || isDeleteAllExpenseLoading
        }
      />
    </DataTableLayout>
  );
};

export default ReimbursementsList;
