import { useState } from "react";
import { useNavigate } from "react-router";
import { isEmpty, size } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";

import useDeleteExpense from "../helpers/hooks/useDeleteExpense";
import useExtractExpense from "@/helpers/hooks/useExtractExpense";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import useDeleteAllExpense from "../helpers/hooks/useDeleteAllExpense";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";
import useUploadedDocumentList from "../helpers/hooks/useUploadedDocumentList";
import UploadedDocumentListHeader from "./UploadedDocumentListHeader";

import { DataTable } from "@/components/common/Table/DataTable";
import type { UploadedDocument } from "../types/extraction.types";
import type { ReimbursementDocument } from "@/types/common.types";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import { useUploadedDocumentsTableColumns } from "./UploadedDocumentsColumns";
import { UPLOADED_DOCUMENTS_LIST_QUERY_KEY } from "../helpers/constants/extraction";
import {
  setPage,
  setPerPage,
  setSorting,
} from "../state-management/features/uploadedDocumentListSlice";

const UploadedDocumentList = () => {
  const [userExpenseIdsToDelete, setUserExpenseIdsToDelete] = useState<
    number[]
  >([]);

  const [userExpenseIdToExtract, setUserExpenseIdToExtract] = useState<
    number | null
  >(null);

  const [previewReimbursement, setPreviewReimbursement] =
    useState<ReimbursementDocument | null>(null);

  const [previewDocument, setPreviewDocument] =
    useState<UploadedDocument | null>(null);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { page, perPage, search, sorting } = useAppSelector(
    (state) => state.uploadedDocumentListController,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deletableUserExpenseCount = size(userExpenseIdsToDelete);

  const handleDeleteSuccess = () => {
    setUserExpenseIdsToDelete([]);
    queryClient.invalidateQueries({
      queryKey: [UPLOADED_DOCUMENTS_LIST_QUERY_KEY],
    });
    setRowSelection({});
  };

  const { isExpenseDeleteLoading, mutateExpenseDelete } = useDeleteExpense({
    onSuccess: handleDeleteSuccess,
  });

  const { isDeleteAllExpenseLoading, mutateDeleteAllExpense } =
    useDeleteAllExpense({
      onSuccess: handleDeleteSuccess,
    });

  const { isUploadedDocumentsLoading, uploadedDocuments, pagination } =
    useUploadedDocumentList({ page, perPage, search, sorting });

  const { mutateExpenseExtract, isExpenseExtractPending } = useExtractExpense({
    onSuccess: () => {
      setUserExpenseIdToExtract(null);
      queryClient.invalidateQueries({
        queryKey: [UPLOADED_DOCUMENTS_LIST_QUERY_KEY],
      });
    },
  });

  const columns = useUploadedDocumentsTableColumns({
    handlePreview: (document) => setPreviewDocument(document),
    onDeleteDocument: (userExpenseIdToDelete: number) => {
      setUserExpenseIdsToDelete([userExpenseIdToDelete]);
    },
    onExtractDocument: (userExpenseId: number) => {
      setUserExpenseIdToExtract(userExpenseId);
    },
  });

  const handleClosePreview = () => setPreviewDocument(null);

  const handleRowClick = (row: UploadedDocument) => {
    const isExtracted = row.status === "Extracted";
    if (isExtracted) navigate(`/my_expenses/${row.user_expense_id}`);
  };

  return (
    <div className="shadow-card-soft border-porcelain flex flex-col rounded-2xl border px-6 py-5 sm:h-fit sm:max-h-full">
      <UploadedDocumentListHeader
        total={pagination.total}
        isUploadedDocumentsLoading={isUploadedDocumentsLoading}
      />
      <DataTable<UploadedDocument>
        data={uploadedDocuments}
        pagination={pagination}
        columns={columns}
        isLoading={isUploadedDocumentsLoading && isEmpty(uploadedDocuments)}
        loadingMessage="Loading Uploaded Documents..."
        emptyState="no-documents"
        onPrevious={() => dispatch(setPage(pagination.page - 1))}
        onNext={() => dispatch(setPage(pagination.page + 1))}
        handlePerPage={(value) => dispatch(setPerPage(value))}
        onRowClick={(row) => handleRowClick(row)}
        paginationLabel="Uploaded documents"
        getTableRowClassName={(row) =>
          row.status !== "Extracting" ? "cursor-pointer" : ""
        }
        sorting={sorting}
        onSortingChange={(sortingState) => dispatch(setSorting(sortingState))}
        enableRowSelection
        getRowId={(row) => row.id.toString()}
        onDeleteAll={() =>
          setUserExpenseIdsToDelete(Object.keys(rowSelection).map(Number))
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableColumnResize
      />
      <DocumentPreviewModal
        document={previewDocument}
        onClose={handleClosePreview}
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
      <ConfirmAlertDialog
        open={!!userExpenseIdToExtract}
        onOpenChange={(open) => {
          if (!open) setUserExpenseIdToExtract(null);
        }}
        title="Extract Selected File?"
        content="You're about to extract selected file."
        onConfirm={() =>
          userExpenseIdToExtract &&
          mutateExpenseExtract({ userExpenseID: userExpenseIdToExtract })
        }
        cancelText="Cancel"
        confirmText="Extract"
        disabled={isExpenseExtractPending}
        isApiResponseLoading={isExpenseExtractPending}
      />
      <DocumentPreviewModal
        document={previewReimbursement}
        onClose={() => setPreviewReimbursement(null)}
      />
    </div>
  );
};

export default UploadedDocumentList;
