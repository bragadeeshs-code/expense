import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { UPLOADED_DOCUMENTS_LIST_QUERY_KEY } from "@/pages/private/Extraction/helpers/constants/extraction";

import AppDialog from "@/components/common/AppDialog";
import FileUpload from "../../pages/private/UserDashboard/components/FileUpload";
import ImageUpload from "../../pages/private/UserDashboard/components/ImageUpload";
import FileUploadList from "../../pages/private/UserDashboard/components/FileUploadList";

interface AddExpenseDialogProps {
  addExpenseDialogOpen: boolean;
  setAddExpenseDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isImage?: boolean;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  addExpenseDialogOpen,
  setAddExpenseDialogOpen,
  isImage = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const isMyExpensesPage = useMatch({
    path: "/my_expenses",
    end: true,
  });

  useEffect(() => {
    if (!addExpenseDialogOpen) {
      setUploadedFiles([]);
    }
  }, [addExpenseDialogOpen]);

  const startUpload = () => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.progress === 0 && !file.isError
          ? { ...file, isUploading: true }
          : file,
      ),
    );
  };

  const handleNext = () => {
    if (isMyExpensesPage) {
      setAddExpenseDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: [UPLOADED_DOCUMENTS_LIST_QUERY_KEY],
      });
    } else {
      navigate("/my_expenses");
    }
  };

  const allFilesUploaded =
    uploadedFiles.length > 0 &&
    uploadedFiles.every((file) => file.progress === 100 && !file.isError);

  return (
    <AppDialog
      isOpen={addExpenseDialogOpen}
      setIsOpen={setAddExpenseDialogOpen}
      dialogHeader="Add Expense"
      isWrapperDivAvailable
      className="sm:max-w-[482px]"
    >
      <div className="mt-[33px]">
        {isImage ? (
          <ImageUpload
            hasUploadedFilesAvailable={!!uploadedFiles.length}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        ) : (
          <FileUpload
            hasUploadedFilesAvailable={!!uploadedFiles.length}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <FileUploadList
              headerText={`Uploaded Files (${String(uploadedFiles.length).padStart(2, "0")})`}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          </div>
        )}

        {allFilesUploaded ? (
          <Button
            className="mt-8 w-full [background-image:var(--gradient-primary)]"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            className="mt-8 w-full [background-image:var(--gradient-primary)]"
            onClick={startUpload}
          >
            Start Upload
          </Button>
        )}
      </div>
    </AppDialog>
  );
};

export default AddExpenseDialog;
