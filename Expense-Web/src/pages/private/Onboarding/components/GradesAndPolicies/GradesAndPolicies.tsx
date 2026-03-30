import { useEffect, useState } from "react";

import type { GradeItem } from "@/types/grades.types";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../../state-management/features/gradesListSlice";

import useGradesList from "@/helpers/hooks/useGradesList";
import useUploadGradeFile from "@/helpers/hooks/useUploadGradeFile";
import GradesAndPoliciesList from "@/components/common/GradesAndPolicies/GradesAndPoliciesList";

const GradesAndPolicies = () => {
  const [isGradeFormOpen, setIsGradeFormOpen] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { mutateGradeFileUpload, isGradeFileUploading } = useUploadGradeFile({
    onUploadSuccess: () => {
      setIsUploadOpen(false);
    },
  });

  const { search, page, perPage } = useAppSelector(
    (state) => state.gradesListController,
  );
  const { grades, isGradesListLoading, pagination } = useGradesList({
    page,
    search,
    perPage,
  });

  const handleFileUpload = (file: File) => {
    mutateGradeFileUpload({ file });
  };

  useEffect(() => {
    if (!isGradeFormOpen) setSelectedGrade(null);
  }, [isGradeFormOpen]);

  return (
    <GradesAndPoliciesList
      className="max-h-full"
      search={search}
      grades={grades}
      pagination={pagination}
      isGradesListLoading={isGradesListLoading}
      isGradeFileUploading={isGradeFileUploading}
      isGradeFormOpen={isGradeFormOpen}
      selectedGrade={selectedGrade}
      setIsGradeFormOpen={setIsGradeFormOpen}
      setSelectedGrade={setSelectedGrade}
      onFileUpload={handleFileUpload}
      onPrevious={() => dispatch(setPage(pagination.page - 1))}
      onNext={() => dispatch(setPage(pagination.page + 1))}
      onPerPageChange={(value) => dispatch(setPerPage(value))}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      isUploadOpen={isUploadOpen}
      setIsUploadOpen={setIsUploadOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
    />
  );
};

export default GradesAndPolicies;
