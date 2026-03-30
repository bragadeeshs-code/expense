import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import type { FileUploadResponse } from "@/types/common.types";
import { uploadEmployeeFile } from "@/services/employee.service";
import {
  EMPLOYEE_DASHBOARD_API_QUERY_KEY,
  EMPLOYEES_LIST_API_QUERY_KEY,
} from "../constants/common";

interface UploadEmployeeFileMutationParams {
  file: File;
}

interface UploadEmployeeFileProps {
  onSuccess: () => void;
}

const useUploadEmployeeFile = (
  uploadEmployeeFileProps: UploadEmployeeFileProps,
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    FileUploadResponse,
    AxiosError<APIErrorResponse>,
    UploadEmployeeFileMutationParams
  >({
    mutationFn: ({ file }: UploadEmployeeFileMutationParams) =>
      uploadEmployeeFile(file),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEES_LIST_API_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [EMPLOYEE_DASHBOARD_API_QUERY_KEY],
      });
      notifySuccess("Employees uploaded", res.message);
      uploadEmployeeFileProps.onSuccess();
    },
    onError: (error) => {
      notifyError("Employee File upload failed", formatApiError(error));
    },
  });

  return {
    mutateEmployeeFileUpload: mutate,
    isEmployeeFileUploading: isPending,
  };
};

export default useUploadEmployeeFile;
