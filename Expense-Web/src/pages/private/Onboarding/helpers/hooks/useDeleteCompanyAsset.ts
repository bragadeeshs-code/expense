import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { COMPANY_ASSETS_MUTATION_QUERY } from "../constants/onboarding";
import { deleteCompanyAsset } from "@/services/organization-setup.service";
import type { DeleteCompanyAssetResponse } from "../../types/onboarding.types";

interface useDeleteCompanyAssetProps {
  setCompanyAssetIdToDelete: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useDeleteCompanyAsset = ({
  setCompanyAssetIdToDelete,
  setIsDeleteDialogOpen,
}: useDeleteCompanyAssetProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation<
    DeleteCompanyAssetResponse,
    AxiosError<APIErrorResponse>,
    { id: number }
  >({
    mutationFn: ({ id }) => deleteCompanyAsset(id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      notifySuccess(
        "Asset deleted",
        "The selected asset has been deleted successfully.",
      );
      setCompanyAssetIdToDelete(null);
      queryClient.invalidateQueries({
        queryKey: [COMPANY_ASSETS_MUTATION_QUERY],
      });
    },
    onError: (error) => {
      notifyError("Failed to delete asset", formatApiError(error));
    },
  });

  return {
    isCompanyAssetDeleteLoading: isPending,
    mutateCompanyAssetDelete: mutate,
  };
};

export default useDeleteCompanyAsset;
