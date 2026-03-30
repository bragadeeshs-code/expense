import { setSearchTextFilter } from "../state-management/features/uploadedDocumentListSlice";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

import DebouncedSearchField from "../../../../components/common/DebouncedSearchField";

interface UploadedDocumentListFiltersProps {
  isUploadedDocumentsLoading: boolean;
}

const UploadedDocumentListFilters: React.FC<
  UploadedDocumentListFiltersProps
> = ({ isUploadedDocumentsLoading }) => {
  const { search } = useAppSelector(
    (state) => state.uploadedDocumentListController,
  );
  const dispatch = useAppDispatch();

  const handleSearch = (search: string) =>
    dispatch(setSearchTextFilter(search));

  return (
    <div className="flex gap-3">
      <DebouncedSearchField
        isLoading={!!search && isUploadedDocumentsLoading}
        search={search}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default UploadedDocumentListFilters;
