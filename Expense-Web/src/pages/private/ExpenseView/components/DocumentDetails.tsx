import DocumentHeader from "../../Extraction/components/DocumentHeader";
import DocumentExtractedData from "../../Extraction/components/DocumentExtractedData";
import { useAppSelector } from "@/state-management/hook";

interface ExpenseDetailsProps {
  templateControllerRef: React.RefObject<
    (() => Record<string, unknown>) | null
  >;
}

const DocumentDetails: React.FC<ExpenseDetailsProps> = ({
  templateControllerRef,
}) => {
  const { extractedDocument: extractedData } = useAppSelector(
    (state) => state.extractedDocument,
  );
  const status = extractedData?.status;
  const isEditableStatus = status === "Extracted";

  return (
    <div className="scrollbar-thin flex h-full max-h-[713px] min-h-0 flex-1 flex-col overflow-y-auto sm:max-h-full">
      <DocumentHeader isEditableStatus={isEditableStatus} />
      <div className="shadow-card-soft border-porcelain mt-2 rounded-2xl border">
        <DocumentExtractedData
          templateControllerRef={templateControllerRef}
          isEditableStatus={isEditableStatus}
        />
      </div>
    </div>
  );
};

export default DocumentDetails;
