import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import { deleteGrade } from "@/services/roles-and-grades.service";
import { GRADS_LIST_API_QUERY_KEY } from "@/helpers/constants/common";
import type { DeleteGradeResponse, GradeItem } from "@/types/grades.types";

interface useDeleteGradeProps {
  setSelectedGrade: React.Dispatch<React.SetStateAction<GradeItem | null>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useDeleteGrade = ({
  setSelectedGrade,
  setIsDeleteDialogOpen,
}: useDeleteGradeProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation<
    DeleteGradeResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteGrade(id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      notifySuccess(
        "Grade deleted",
        `The selected grade has been deleted successfully.`,
      );
      setSelectedGrade(null);
      queryClient.invalidateQueries({
        queryKey: [GRADS_LIST_API_QUERY_KEY],
      });
    },
    onError: (error) => {
      notifyError("Failed to delete Grade", formatApiError(error));
    },
  });

  return {
    isGradeDeleteLoading: isPending,
    mutateGradeDelete: mutate,
  };
};

export default useDeleteGrade;
