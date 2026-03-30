import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { uploadGradeFile } from "@/services/roles-and-grades.service";
import type { FileUploadResponse } from "@/types/common.types";

interface UploadGradeFileMutationParams {
  file: File;
}

interface UploadGradeFileProps {
  onUploadSuccess: () => void;
}

const useUploadGradeFile = (uploadGradeFileProps: UploadGradeFileProps) => {
  const { mutate, isPending } = useMutation<
    FileUploadResponse,
    AxiosError<APIErrorResponse>,
    UploadGradeFileMutationParams
  >({
    mutationFn: ({ file }: UploadGradeFileMutationParams) =>
      uploadGradeFile(file),
    onSuccess: (res) => {
      notifySuccess("Grade upload processed", res.message);
      uploadGradeFileProps.onUploadSuccess();
    },
    onError: (error) => {
      notifyError("Grade upload failed", formatApiError(error));
    },
  });

  return {
    mutateGradeFileUpload: mutate,
    isGradeFileUploading: isPending,
  };
};

export default useUploadGradeFile;
