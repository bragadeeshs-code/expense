import { useEffect } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocumentPreview } from "../../pages/private/UserDashboard/helpers/hooks/useDocumentPreview";
import { supportedFormats } from "@/helpers/constants/common";
import type { ReimbursementDocument } from "@/types/common.types";
import DocumentViewer from "./DocumentViewer";

interface DocumentPreviewModalProps {
  document: ReimbursementDocument | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  const { data: previewData, isLoading, error } = useDocumentPreview(document);
  const isOpen = !!document;
  useEffect(() => {
    if (error) {
      toast("Preview Error", {
        description: "Unable to preview the document. Please try again later.",
      });
    }
  }, [error]);

  if (!document || !document.format) return null;

  const isSupported = supportedFormats.includes(document.format.toLowerCase());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onWheel={(e) => e.stopPropagation()}
        showCloseButton={true}
        className="flex h-[90vh] flex-col gap-0 overflow-hidden rounded-md p-0 md:max-w-4xl lg:max-w-5xl"
        closeButtonClassName="p-3 rounded-md bg-background border top-1 right-1 shadow-xs"
      >
        <DialogHeader>
          <DialogTitle className="text-ash-gray p-3.5 text-base">
            {document.name}
          </DialogTitle>
        </DialogHeader>

        {!isSupported ? (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <p className="text-eerie-black mb-4 text-center text-lg leading-[100%] font-semibold tracking-[0%] md:text-xl">
              Preview not supported for {document.format} files
            </p>
            <p className="text-slate-charcoal text-center text-xs leading-6 font-normal tracking-[0%] md:text-sm">
              Supported formats: PDF, XLS, XLSX, JPG, JPEG, PNG, TXT
            </p>
          </div>
        ) : (
          <DocumentViewer
            url={previewData?.url || ""}
            name={document.name}
            format={document.format}
            isLoading={isLoading || !previewData?.url}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
