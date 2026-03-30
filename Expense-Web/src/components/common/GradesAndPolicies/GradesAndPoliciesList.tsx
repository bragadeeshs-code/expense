import { Sheet } from "@/components/ui/sheet";
import type { GradeItem } from "@/types/grades.types";
import type { Pagination } from "@/types/common.types";

import GradeForm from "./GradeForm";
import useDeleteGrade from "@/pages/private/Onboarding/helpers/hooks/useDeleteGrade";
import type { ColumnDef } from "@tanstack/react-table";
import { getGradesTableColumns } from "./GradesColumns";
import DataTableLayout from "../Table/DataTableLayout";
import ConfirmAlertDialog from "../ConfirmAlertDialog";
import { downloadFile } from "@/lib/utils";
import { ENDPOINTS } from "@/helpers/constants/api-endpoints";

interface GradesAndPoliciesListProps {
  search: string;
  grades: GradeItem[];
  pagination: Pagination;
  isGradesListLoading: boolean;
  isGradeFileUploading: boolean;
  isGradeFormOpen: boolean;
  selectedGrade: GradeItem | null;
  setIsGradeFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGrade: React.Dispatch<React.SetStateAction<GradeItem | null>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUploadOpen: boolean;
  setIsUploadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFileUpload: (file: File) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange: (value: number) => void;
  onSearch: (value: string) => void;
  className?: string;
}

const GradesAndPoliciesList: React.FC<GradesAndPoliciesListProps> = ({
  search,
  grades,
  pagination,
  isGradesListLoading,
  isGradeFileUploading,
  isGradeFormOpen,
  selectedGrade,
  setIsGradeFormOpen,
  setSelectedGrade,
  onFileUpload,
  onPrevious,
  onNext,
  onPerPageChange,
  onSearch,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isUploadOpen,
  setIsUploadOpen,
  className,
}) => {
  const columns: ColumnDef<GradeItem>[] = getGradesTableColumns({
    onEdit: (gradeItem: GradeItem) => {
      setIsGradeFormOpen(true);
      setSelectedGrade(gradeItem);
    },
    onDelete: (gradeItem: GradeItem) => {
      setIsDeleteDialogOpen(true);
      setSelectedGrade(gradeItem);
    },
  });

  const { mutateGradeDelete, isGradeDeleteLoading } = useDeleteGrade({
    setIsDeleteDialogOpen,
    setSelectedGrade,
  });

  return (
    <DataTableLayout
      className={className}
      isSearchFieldExpandable
      title="Grades & Policies List"
      isLoading={isGradesListLoading}
      search={search}
      onSearch={onSearch}
      onAddNew={() => {
        setIsGradeFormOpen(true);
        setSelectedGrade(null);
      }}
      tableProps={{
        data: grades,
        columns,
        pagination,
        isLoading: isGradesListLoading,
        loadingMessage: "Grades loading...",
        onPrevious: onPrevious,
        onNext: onNext,
        paginationLabel: "Grades",
        getTableRowClassName: () => "cursor-pointer",
        emptyState: "no-grades",
        handlePerPage: onPerPageChange,
        headerClassName: "bg-cool-gray-frost",
      }}
      fileUploadProps={{
        headerText: "Add Grades",
        title: "Import grades from .xlsx /.csv files",
        isFileUploading: isGradeFileUploading,
        onFileSelected: onFileUpload,
        isDialogOpen: isUploadOpen,
        setIsDialogOpen: setIsUploadOpen,
        onSampleTemplateClick: () =>
          downloadFile(
            `${import.meta.env.VITE_API_URL}/${ENDPOINTS.GRADES.TEMPLATE}`,
          ),
      }}
    >
      <Sheet open={isGradeFormOpen} onOpenChange={setIsGradeFormOpen}>
        <GradeForm
          grade={selectedGrade}
          isGradeFormOpen={isGradeFormOpen}
          setIsGradeFormOpen={setIsGradeFormOpen}
        />
      </Sheet>
      <ConfirmAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Selected grade?"
        content="You're about to delete selected grade. This action cannot be undone."
        onConfirm={() => {
          if (selectedGrade) {
            mutateGradeDelete({ id: selectedGrade.id });
          }
        }}
        cancelText="Cancel"
        confirmText={isGradeDeleteLoading ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isGradeDeleteLoading}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isApiResponseLoading={isGradeDeleteLoading}
      />
    </DataTableLayout>
  );
};

export default GradesAndPoliciesList;
