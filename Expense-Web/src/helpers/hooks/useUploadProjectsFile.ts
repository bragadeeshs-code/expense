import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { uploadProjectsFile } from "@/services/project.service";
import type { FileUploadResponse } from "@/types/common.types";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

interface UploadProjectsFileMutationParams {
  file: File;
}

interface UploadProjectsFileProps {
  onUploadSuccess: () => void;
}

const useUploadProjectsFile = ({
  onUploadSuccess,
}: UploadProjectsFileProps) => {
  const { mutate, isPending } = useMutation<
    FileUploadResponse,
    AxiosError<APIErrorResponse>,
    UploadProjectsFileMutationParams
  >({
    mutationFn: ({ file }) => uploadProjectsFile(file),
    onSuccess: (res) => {
      notifySuccess("Projects uploaded", res.message);
      onUploadSuccess();
    },
    onError: (error) => {
      notifyError("Projects File upload failed", formatApiError(error));
    },
  });

  return {
    mutateProjectsFileUpload: mutate,
    isProjectsFileUploading: isPending,
  };
};

export default useUploadProjectsFile;
