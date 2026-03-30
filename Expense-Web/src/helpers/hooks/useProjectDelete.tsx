import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "@/services/project.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { PROJECTS_LIST_API_QUERY_KEY } from "../constants/common";
import type { DeleteProjectResponse } from "@/types/common.types";

interface useDeleteProjectProps {
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useProjectDelete = ({ setIsDeleteDialogOpen }: useDeleteProjectProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation<
    DeleteProjectResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteProject(id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      notifySuccess(
        "Project deleted",
        `The selected project has been deleted successfully.`,
      );
      queryClient.invalidateQueries({
        queryKey: [PROJECTS_LIST_API_QUERY_KEY],
      });
    },
    onError: (error) => {
      notifyError("Failed to delete project", formatApiError(error));
    },
  });

  return {
    isProjectDeleteLoading: isPending,
    mutateProjectDelete: mutate,
  };
};

export default useProjectDelete;
