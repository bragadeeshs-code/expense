import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { formatApiError, notifyError } from "@/lib/utils";
import { downloadUrl } from "../../pages/private/UserDashboard/lib/dashboardUtils";
import { getReimbursementLink } from "@/services/reimbursements.service";

interface useExpenseDownloadProps {
  fileName: string;
}

const useExpenseDownload = ({ fileName }: useExpenseDownloadProps) => {
  const { mutate, isPending } = useMutation<
    ExpenseLinkResponse,
    AxiosError<APIErrorResponse>,
    { expenseId: number }
  >({
    mutationFn: ({ expenseId }) => getReimbursementLink(expenseId),
    onSuccess: async (response) => {
      if (!response.url) return;
      downloadUrl(response.url, fileName);
    },
    onError: (error) => {
      notifyError("Download failed", formatApiError(error));
    },
  });

  return {
    mutateGetExpenseLink: mutate,
    isExpenseLinkLoading: isPending,
  };
};

export default useExpenseDownload;
