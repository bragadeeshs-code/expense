import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import FileUpload from "@/pages/private/UserDashboard/components/FileUpload";
import FileUploadList from "@/pages/private/UserDashboard/components/FileUploadList";

interface TripNoteUploadModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const TripNoteUploadModal: React.FC<TripNoteUploadModalProps> = ({
  title = "Add notes",
  isOpen,
  onClose,
  onUpload,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);

  const handleStartUpload = () => {
    if (uploadedFiles.length > 0) {
      onUpload(uploadedFiles[0].file);
      setUploadedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl border-none p-8 sm:max-w-[482px]">
        <DialogHeader className="flex flex-row items-center justify-between border-none pb-0">
          <div className="flex flex-1 justify-center">
            <DialogTitle className="text-deep-charcoal text-lg font-bold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Upload files for notes
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8">
          {uploadedFiles.length === 0 ? (
            <FileUpload
              hasUploadedFilesAvailable={uploadedFiles.length > 0}
              setUploadedFiles={setUploadedFiles}
              uploadedFiles={uploadedFiles}
              allowMultiple={false}
            />
          ) : (
            <div className="mt-8">
              <FileUploadList
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                headerText="Uploaded file"
              />
            </div>
          )}

          <Button
            className="mt-8 h-12 w-full rounded-xl [background-image:var(--gradient-primary)] font-semibold text-white transition-all hover:opacity-90"
            onClick={handleStartUpload}
            disabled={uploadedFiles.length === 0}
          >
            Start Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripNoteUploadModal;
