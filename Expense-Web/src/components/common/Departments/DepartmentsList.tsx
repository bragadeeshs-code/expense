import { useState } from "react";
import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Sheet } from "@/components/ui/sheet";
import { deleteDepartment } from "@/services/departments.service";
import type { ListFilters } from "@/types/common.types";
import type { DepartmentResponse } from "@/types/departments.types";
import { getDepartmentsTableColumns } from "@/helpers/hooks/DepartmentsTableColumns";
import { DEPARTMENTS_LIST_QUERY_KEY } from "@/helpers/constants/departments";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import DepartmentsForm from "./DepartmentsForm";
import DataTableLayout from "../Table/DataTableLayout";
import ConfirmAlertDialog from "../ConfirmAlertDialog";
import useDepartmentsList from "@/helpers/hooks/useDepartmentsList";

interface DepartmentsListProps {
  filters: ListFilters;
  className?: string;
  onSearch: (value: string) => void;
  onPerPageChange: (perPage: number) => void;
  onPageChange: (page: number) => void;
}

const DepartmentsList: React.FC<DepartmentsListProps> = ({
  filters,
  className,
  onSearch,
  onPageChange,
  onPerPageChange,
}) => {
  const queryClient = useQueryClient();

  const [isDepartmentsFormOpen, setIsDepartmentsFormOpen] =
    useState<boolean>(false);

  const [isDepartmentsDeleteDialogOpen, setIsDepartmentsDeleteDialogOpen] =
    useState<boolean>(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentResponse | null>(null);

  const openDepartmentForm = (department?: DepartmentResponse) => {
    setSelectedDepartment(department ?? null);
    setIsDepartmentsFormOpen(true);
  };

  const { departments, isDepartmentsLoading, pagination } = useDepartmentsList({
    filters,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onSuccess: () => {
      notifySuccess(
        "Department Deleted",
        "The department has been deleted successfully.",
      );
      queryClient.invalidateQueries({
        queryKey: [DEPARTMENTS_LIST_QUERY_KEY],
      });
      setIsDepartmentsDeleteDialogOpen(false);
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to delete department", formatApiError(error));
    },
  });

  const columns = getDepartmentsTableColumns({
    onDelete: (department: DepartmentResponse) => {
      setSelectedDepartment(department);
      setIsDepartmentsDeleteDialogOpen(true);
    },
    onEdit: openDepartmentForm,
  });

  const handleFormOnSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [DEPARTMENTS_LIST_QUERY_KEY],
    });
    setIsDepartmentsFormOpen(false);
  };

  return (
    <DataTableLayout
      title="Departments List"
      className={className}
      isLoading={isDepartmentsLoading}
      search={filters.search}
      onSearch={onSearch}
      onAddNew={openDepartmentForm}
      isSearchFieldExpandable
      tableProps={{
        data: departments,
        columns,
        pagination,
        isLoading: isDepartmentsLoading,
        onPrevious: () => onPageChange(filters.page - 1),
        onNext: () => onPageChange(filters.page + 1),
        handlePerPage: onPerPageChange,
        loadingMessage: "Departments list loading...",
        emptyState: "no-departments",
        paginationLabel: "Departments",
        getTableRowClassName: () => "cursor-pointer",
        headerClassName: "bg-cool-gray-frost",
      }}
    >
      <Sheet
        open={isDepartmentsFormOpen}
        onOpenChange={setIsDepartmentsFormOpen}
      >
        <DepartmentsForm
          onSuccess={handleFormOnSuccess}
          department={selectedDepartment}
        />
      </Sheet>
      <ConfirmAlertDialog
        open={isDepartmentsDeleteDialogOpen}
        onOpenChange={setIsDepartmentsDeleteDialogOpen}
        title="Delete Selected Department?"
        content={`You're about to delete department "${selectedDepartment?.name}". This action cannot be undone.`}
        onConfirm={() => deleteMutate(selectedDepartment!.id)}
        cancelText="Cancel"
        confirmText={isDeletePending ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isDeletePending}
        onCancel={() => setIsDepartmentsDeleteDialogOpen(false)}
        isApiResponseLoading={isDeletePending}
      />
    </DataTableLayout>
  );
};

export default DepartmentsList;
