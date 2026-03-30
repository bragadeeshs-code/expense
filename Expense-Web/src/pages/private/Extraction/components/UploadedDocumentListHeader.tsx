import padStart from "lodash/padStart";

import UploadedDocumentListFilters from "./UploadedDocumentListFilters";

interface UploadedDocumentListHeaderProps {
  total: number;
  isUploadedDocumentsLoading: boolean;
}

const UploadedDocumentListHeader: React.FC<UploadedDocumentListHeaderProps> = ({
  total,
  isUploadedDocumentsLoading,
}) => {
  return (
    <div className="mb-4.5 flex flex-col gap-2 @min-5xl:flex-row @min-5xl:items-center @min-5xl:justify-between @min-5xl:gap-0">
      <span className="text-sm leading-[100%] font-semibold tracking-[-1%] text-black">
        Uploaded files ({padStart(String(total), 2, "0")})
      </span>
      <UploadedDocumentListFilters
        isUploadedDocumentsLoading={isUploadedDocumentsLoading}
      />
    </div>
  );
};

export default UploadedDocumentListHeader;
