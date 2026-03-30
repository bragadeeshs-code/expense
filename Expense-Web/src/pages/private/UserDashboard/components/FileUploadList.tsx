import FileUploadItem from "./FileUploadItem";

interface FileUploadListProps {
  headerText: string;
  uploadedFiles: UploadFileItem[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFileItem[]>>;
}

const FileUploadList: React.FC<FileUploadListProps> = ({
  headerText,
  uploadedFiles,
  setUploadedFiles,
}) => {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-black">{headerText}</p>
      <div className="scrollbar-thin max-h-20 space-y-2 overflow-y-auto sm:max-h-40">
        {uploadedFiles.map((file) => (
          <FileUploadItem
            file={file}
            key={file.id}
            setUploadedFiles={setUploadedFiles}
          />
        ))}
      </div>
    </div>
  );
};

export default FileUploadList;
