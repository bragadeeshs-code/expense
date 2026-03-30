import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { UploadFile } from "@/services/file-upload.service";
import { formatApiError, notifyError } from "@/lib/utils";
import type { AxiosError } from "axios";

interface UseFileUploadProps {
  onProgress: (progress: number) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const useFileUpload = ({
  onProgress,
  onSuccess,
  onError,
}: UseFileUploadProps) => {
  const fileRef = useRef<File | null>(null);

  const { mutate } = useMutation({
    mutationFn: (file: File) =>
      UploadFile(file, (progress) => {
        onProgress(progress);
      }),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Upload Failed", formatApiError(error));
      onError();
    },
  });

  const upload = useCallback(
    (file: File) => {
      fileRef.current = file;
      mutate(file);
    },
    [mutate],
  );

  const retry = useCallback(() => {
    if (!fileRef.current) return;
    mutate(fileRef.current);
  }, [mutate]);

  return {
    upload,
    retry,
  };
};
