import { useEffect, useState } from "react";

import { queryClient } from "@/lib/queryClient";
import type { RootState } from "@/state-management/store";
import type { GradeItem } from "@/types/grades.types";
import { GRADS_LIST_API_QUERY_KEY } from "@/helpers/constants/common";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/state-management/features/companyGradesListSlice";

import useGradesList from "@/helpers/hooks/useGradesList";
import useUploadGradeFile from "@/helpers/hooks/useUploadGradeFile";
import GradesAndPoliciesList from "@/components/common/GradesAndPolicies/GradesAndPoliciesList";

const CompanyGradesAndPolicies = () => {
  const [isGradeFormOpen, setIsGradeFormOpen] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const { mutateGradeFileUpload, isGradeFileUploading } = useUploadGradeFile({
    onUploadSuccess: () => {
      setIsUploadOpen(false);
      queryClient.invalidateQueries({ queryKey: [GRADS_LIST_API_QUERY_KEY] });
    },
  });

  const { search, page, perPage } = useAppSelector(
    (state: RootState) => state.companyGradesList,
  );

  const dispatch = useAppDispatch();

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
      className="mx-5 @md:h-full"
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
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      isUploadOpen={isUploadOpen}
      setIsUploadOpen={setIsUploadOpen}
    />
  );
};

export default CompanyGradesAndPolicies;
