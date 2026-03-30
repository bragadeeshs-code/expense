import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Pagination } from "@/types/common.types";
import { useEmployeesTableColumns } from "../../../helpers/hooks/useEmployeesTableColumns";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import DataTableLayout from "../Table/DataTableLayout";
import type {
  EmployeeColumnFilters,
  EmployeeItem,
} from "@/types/employees.types";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";
import useUploadEmployeeFile from "@/helpers/hooks/useUploadEmployeeFile";
import { downloadFile } from "@/lib/utils";
import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import EmployeeManagementFilters from "./EmployeeManagementFilters";
import { Sheet } from "@/components/ui/sheet";
import MemberForm from "./MemberForm";

interface EmployeeManagementListProps {
  title: string;
  isFetching: boolean;
  employees: EmployeeItem[];
  pagination: Pagination;
  search: string;
  columnFilters: EmployeeColumnFilters;
  onResetFilters: () => void;
  onSearch: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange: (value: number) => void;
  isExpandableSearchField?: boolean;
  isDeleteDialogOpen: boolean;
  onDelete: (employeeId: number) => void;
  isDeleteLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onDialogChange: (value: boolean) => void;
  onFiltersChange: (columnFilters: EmployeeColumnFilters) => void;
  className?: string;
}

const EmployeeManagementList: React.FC<EmployeeManagementListProps> = ({
  title,
  isFetching,
  onNext,
  onPerPageChange,
  onPrevious,
  onSearch,
  search,
  pagination,
  employees,
  isDeleteLoading,
  onConfirm,
  onCancel,
  onDelete,
  isDeleteDialogOpen,
  onDialogChange,
  columnFilters,
  onResetFilters,
  onFiltersChange,
  className,
}) => {
  const columns: ColumnDef<EmployeeItem>[] = useEmployeesTableColumns({
    onDelete,
  });
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState<boolean>(false);
  const { mutateEmployeeFileUpload, isEmployeeFileUploading } =
    useUploadEmployeeFile({
      onSuccess: () => {
        setIsUploadOpen(false);
      },
    });

  return (
    <DataTableLayout<EmployeeItem, EmployeeColumnFilters>
      className={className}
      title={title}
      isLoading={isFetching}
      search={search}
      onSearch={onSearch}
      columnFilters={columnFilters}
      defaultFilters={EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE}
      onResetFilters={onResetFilters}
      isSearchFieldExpandable
      filtersComponent={
        <EmployeeManagementFilters
          columnFilters={columnFilters}
          onFiltersChange={onFiltersChange}
        />
      }
      onAddNew={() => setIsEmployeeFormOpen(true)}
      tableProps={{
        data: employees,
        columns,
        pagination,
        isLoading: isFetching,
        loadingMessage: "Loading employees",
        onPrevious,
        onNext,
        handlePerPage: onPerPageChange,
        emptyState: "no-employees",
        paginationLabel: "employees",
        headerClassName: "bg-cool-gray-frost",
      }}
      fileUploadProps={{
        headerText: "Add Employee",
        title: "Import employees from .xlsx /.csv files",
        isFileUploading: isEmployeeFileUploading,
        onFileSelected: (file) => mutateEmployeeFileUpload({ file }),
        isDialogOpen: isUploadOpen,
        setIsDialogOpen: setIsUploadOpen,
        onSampleTemplateClick: () =>
          downloadFile(
            `${import.meta.env.VITE_API_URL}/${ENDPOINTS.EMPLOYEE.TEMPLATE}`,
          ),
      }}
    >
      <ConfirmAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(value: boolean) => onDialogChange(value)}
        title="Delete Selected Employee?"
        content="You're about to delete selected Employee. This action cannot be undone."
        onConfirm={onConfirm}
        cancelText="Cancel"
        confirmText={isDeleteLoading ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isDeleteLoading}
        onCancel={onCancel}
        isApiResponseLoading={isDeleteLoading}
      />

      <Sheet open={isEmployeeFormOpen} onOpenChange={setIsEmployeeFormOpen}>
        <MemberForm
          isOpen={isEmployeeFormOpen}
          onSuccess={() => setIsEmployeeFormOpen(false)}
        />
      </Sheet>
    </DataTableLayout>
  );
};

export default EmployeeManagementList;
