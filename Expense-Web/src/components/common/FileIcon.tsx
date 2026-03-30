import { cn } from "@/lib/utils";
import { File } from "lucide-react";
import { ASSET_PATH } from "@/helpers/constants/common";

interface FileIconProps {
  type: string | null;
  classname?: string;
}

const FileIcon: React.FC<FileIconProps> = ({
  type,
  classname,
}: FileIconProps) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return (
        <img
          src={`${ASSET_PATH}/icons/pdf.svg`}
          alt="PDF Icon"
          className={cn("h-5 w-5", classname)}
        />
      );
    case "jpg":
    case "jpeg":
    case "png":
      return (
        <img
          src={`${ASSET_PATH}/icons/jpg.svg`}
          alt="JPG/PNG/JPEG Icon"
          className={cn("h-5 w-5", classname)}
        />
      );
    case "xlsx":
    case "xls":
    case "csv":
      return (
        <img
          src={`${ASSET_PATH}/icons/xlx.svg`}
          alt="XLX/XLSX/CSV Icon"
          className={cn("h-5 w-5", classname)}
        />
      );
    case "txt":
    case "doc":
    case "docx":
      return (
        <img
          src={`${ASSET_PATH}/icons/txt.svg`}
          alt="TXT/DOC/DOCX Icon"
          className={cn("h-5 w-5", classname)}
        />
      );
    case "zip":
      return (
        <img
          src={`${ASSET_PATH}/icons/zip.svg`}
          alt="ZIP Icon"
          className={cn("h-5 w-5", classname)}
        />
      );
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

export default FileIcon;
