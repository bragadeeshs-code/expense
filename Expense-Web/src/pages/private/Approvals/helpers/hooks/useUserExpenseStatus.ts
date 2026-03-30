import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { formatApiError, notifyError } from "@/lib/utils";
import { updateUserExpenseStatus } from "@/services/reimbursements.service";
import type {
  ApprovalStatusType,
  UserExpenseStatusParams,
  UserExpenseStatusResponse,
} from "../../types/approvals.types";

interface useUserExpenseStatusProps {
  onSuccess?: (status: ApprovalStatusType) => void;
}

const useUserExpenseStatus = ({ onSuccess }: useUserExpenseStatusProps) => {
  const { mutate, isPending } = useMutation<
    UserExpenseStatusResponse,
    AxiosError<APIErrorResponse>,
    UserExpenseStatusParams
  >({
    mutationFn: ({ status, userExpenseId }) =>
      updateUserExpenseStatus({ status, userExpenseId }),
    onSuccess: (data) => {
      onSuccess?.(data.status);
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("User expense status update failed", formatApiError(error));
    },
  });

  return {
    mutateUserExpenseStatus: mutate,
    isUserExpenseStatusPending: isPending,
  };
};

export default useUserExpenseStatus;
