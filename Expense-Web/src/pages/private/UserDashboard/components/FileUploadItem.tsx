import { useEffect } from "react";
import { RotateCw, Trash2 } from "lucide-react";

import {
  getFileSizeInMB,
  getFileExtension,
  getFileNameWithoutExtension,
} from "@/lib/utils";
import FileIcon from "@/components/common/FileIcon";
import { useFileUpload } from "../helpers/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";

interface FileUploadItemProps {
  file: UploadFileItem;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFileItem[]>>;
}

const FileUploadItem: React.FC<FileUploadItemProps> = ({
  file,
  setUploadedFiles,
}) => {
  const { file: fileObject, id, isUploading } = file;
  const { name, size } = fileObject;

  const { upload } = useFileUpload({
    onProgress: (progress) => {
      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, progress } : file)),
      );
    },
    onError: () => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === id
            ? { ...file, isError: true, isUploading: false }
            : file,
        ),
      );
    },
    onSuccess: () => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === id
            ? { ...file, progress: 100, isUploading: false }
            : file,
        ),
      );
    },
  });

  const handleRetry = () => {
    if (!fileObject) return;
    upload(fileObject);
  };

  useEffect(() => {
    if (isUploading) upload(fileObject);
  }, [isUploading]);

  const handleDelete = () => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="border-athens-gray bg-soft-mist flex w-full items-center gap-3 rounded-lg border px-4 py-3 [box-shadow:0px_2px_6.8px_0px_#0000000A]">
      <FileIcon type={getFileExtension(name)} classname="h-7 w-7" />

      <div className="min-w-0 flex-1">
        <div className="flex gap-1">
          <div className="min-w-0 flex-1">
            <TruncatedTextWithTooltip
              text={getFileNameWithoutExtension(name)}
              className="text-sm"
            />
          </div>
          {file.isError && file.progress ? (
            <span title="Retry">
              <RotateCw
                className="h-4 w-4 cursor-pointer text-red-500"
                onClick={handleRetry}
              />
            </span>
          ) : (
            file.progress > 0 && (
              <p
                className={`text-[10px] font-medium ${file.progress === 100 ? "text-spring-green italic" : "text-ash-gray"}`}
              >
                {file.progress === 100 ? "Completed" : file.progress + "%"}
              </p>
            )
          )}
        </div>
        {file.progress > 0 && file.progress < 100 && (
          <div className="bg-soft-purple mb-1.5 h-1 w-full rounded-full">
            <div
              className="h-1 rounded-full bg-purple-500 transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}
        <p className="text-ash-gray text-[10px] font-medium">
          {file.progress > 0 && file.progress < 100 && (
            <>{getFileSizeInMB((file.progress / 100) * size)} MB of </>
          )}
          {getFileSizeInMB(size)} MB
        </p>
      </div>
      {file.progress === 0 && (
        <Button
          variant="ghost"
          className="text-destructive"
          size="icon-sm"
          onClick={handleDelete}
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
};

export default FileUploadItem;
