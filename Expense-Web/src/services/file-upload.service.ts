import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import { getPercentValue } from "@/lib/utils";
import type { AxiosProgressEvent } from "axios";

import axiosInstance from "@/lib/axios";

export const UploadFile = async (
  file: File,
  onProgress: (progress: number) => void,
) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    ENDPOINTS.EXPENSES.UPLOAD,
    formData,
    {
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!event || !event.total) return;
        const percent = getPercentValue(event.loaded, event.total);
        onProgress(percent);
      },
    },
  );

  return response;
};
