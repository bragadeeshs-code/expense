import { X } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DocumentViewer from "@/components/common/DocumentViewer";
import { supportedFormats } from "@/helpers/constants/common";

interface MileageDocumentPreviewModalProps {
  url: string;
  name: string;
  format: string;
  isOpen: boolean;
  onClose: () => void;
}

const MileageDocumentPreviewModal: React.FC<
  MileageDocumentPreviewModalProps
> = ({ url, name, format, isOpen, onClose }) => {
  const isSupported = supportedFormats.includes(format.toLowerCase());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="z-[9999] h-[90vh] max-h-[90vh] overflow-hidden rounded-md p-0 md:max-w-4xl lg:max-w-5xl"
      >
        <DialogHeader className="sr-only">
          <DialogDescription>Document Preview</DialogDescription>
          <DialogTitle>Document Preview: {name}</DialogTitle>
        </DialogHeader>

        {!isSupported ? (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <p className="text-eerie-black mb-4 text-center text-lg leading-[100%] font-semibold tracking-[0%] md:text-xl">
              Preview not supported for {format} files
            </p>
            <p className="text-slate-charcoal text-center text-xs leading-6 font-normal tracking-[0%] md:text-sm">
              Supported formats: PDF, XLS, XLSX, JPG, JPEG, PNG, TXT
            </p>
          </div>
        ) : (
          <DocumentViewer
            url={url}
            name={name}
            format={format}
            isLoading={!url}
          />
        )}
        <DialogClose asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Close"
            className="absolute top-3.5 right-3 rounded-xs"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default MileageDocumentPreviewModal;
