import { useRef, useState } from "react";
import { ASSET_PATH, ALLOWED_FILE_TYPES } from "@/helpers/constants/common";
import {
  cn,
  getBorderSvg,
  notifyError,
  validateUploadedFiles,
} from "@/lib/utils";

interface FileuploadProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFileItem[]>>;
  hasUploadedFilesAvailable: boolean;
  uploadedFiles: UploadFileItem[];
  allowMultiple?: boolean;
}

const FileUpload: React.FC<FileuploadProps> = ({
  setUploadedFiles,
  hasUploadedFilesAvailable,
  uploadedFiles,
  allowMultiple = true,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFilesHandler = (validFiles: File[]) => {
    setUploadedFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        isError: false,
        isUploading: false,
      })),
    ]);
  };

  const handleFiles = (files: File[] | null) => {
    if (!files) return;

    const existingFileNames = new Set(
      uploadedFiles.map((file) => file.file.name),
    );

    const { validFiles, invalidFiles } = validateUploadedFiles(
      files,
      existingFileNames,
    );

    if (invalidFiles.length > 0) {
      invalidFiles.forEach((invalidFile) => {
        const errorMessage = `${invalidFile.name} - ${invalidFile.reason}`;
        notifyError("File Upload Error", errorMessage);
      });
    }

    if (validFiles.length === 0) return;

    uploadFilesHandler(validFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = "";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "bg-white-smoke border-light-lavender-purple flex cursor-pointer flex-col items-center justify-center rounded-2xl transition-all",
        isDragging && "border-primary bg-primary/5",
        !hasUploadedFilesAvailable ? "h-[200px]" : "h-[120px] sm:h-[88px]",
      )}
      style={{
        backgroundImage: getBorderSvg(isDragging ? "#7C3AED" : "#E4C5F7"),
        backgroundRepeat: "no-repeat",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={allowMultiple}
        onChange={handleInputChange}
        className="hidden"
        accept={ALLOWED_FILE_TYPES.join(",")}
      />

      <div
        className={`flex flex-col items-center justify-center text-center ${hasUploadedFilesAvailable && "items-center justify-start gap-3.5 sm:flex-row"}`}
      >
        <img
          src={`${ASSET_PATH}/icons/document_image.svg`}
          alt="Document image"
          className={`${!hasUploadedFilesAvailable ? "mb-[17px]" : "h-9 w-9"}`}
        />
        <div
          className={cn(
            hasUploadedFilesAvailable && "flex flex-col sm:items-start",
          )}
        >
          <p
            className={cn(
              "text-dark-charcoal font-medium",
              hasUploadedFilesAvailable ? "mb-1.5" : "mb-2",
            )}
          >
            Import files
          </p>
          <p className="text-dusky-gray text-xs font-medium">
            Drop file or click here to choose file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
