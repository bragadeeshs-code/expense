import { useRef } from "react";
import { ASSET_PATH } from "@/helpers/constants/common";
import { cn, notifyError, validateUploadedFiles } from "@/lib/utils";

interface ImageUploadProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFileItem[]>>;
  hasUploadedFilesAvailable: boolean;
  uploadedFiles: UploadFileItem[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  setUploadedFiles,
  hasUploadedFilesAvailable,
  uploadedFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFilesHandler = (validFiles: File[]) => {
    const newFiles: UploadFileItem[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      isError: false,
      isUploading: false,
      progress: 0,
    }));

    setUploadedFiles((prev) => [...newFiles, ...prev]);
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
      className={cn(
        "bg-white-smoke border-light-lavender-purple flex cursor-pointer flex-col items-center justify-center rounded-2xl transition-all",
        !hasUploadedFilesAvailable ? "h-[200px]" : "h-[120px] sm:h-[88px]",
      )}
      style={{
        backgroundImage: "#E4C5F7",
        backgroundRepeat: "no-repeat",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        className="hidden"
        capture="environment"
        accept="image/*"
      />

      <div
        className={cn(
          "flex flex-col items-center justify-center text-center",
          hasUploadedFilesAvailable &&
            "items-center justify-start gap-3.5 sm:flex-row",
        )}
      >
        <img
          src={`${ASSET_PATH}/icons/document_image.svg`}
          alt="Document image"
          className={cn(!hasUploadedFilesAvailable ? "mb-[17px]" : "h-9 w-9")}
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
            Capture image
          </p>
          <p className="text-dusky-gray text-xs font-medium">
            Click here to take image.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
