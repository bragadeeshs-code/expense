import { useState } from "react";
import type { AxiosError } from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Sheet } from "@/components/ui/sheet";
import { deleteCostCenter } from "@/services/cost-centers.service";
import type { ListFilters } from "@/types/common.types";
import type { CostCenterResponse } from "@/types/cost-center.types";
import { getCostCentersTableColumns } from "@/helpers/hooks/CostCentersTableColumns";
import { COST_CENTERS_LIST_QUERY_KEY } from "@/helpers/constants/cost-centers";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import CostCenterForm from "./CostCenterForm";
import DataTableLayout from "../Table/DataTableLayout";
import useCostCentersList from "@/helpers/hooks/useCostCentersList";
import ConfirmAlertDialog from "../ConfirmAlertDialog";

interface CostCentersListProps {
  onNext: () => void;
  filters: ListFilters;
  className?: string;
  onSearch: (value: string) => void;
  onPrevious: () => void;
  onPerPageChange: (perPage: number) => void;
}

const CostCentersList: React.FC<CostCentersListProps> = ({
  onNext,
  filters,
  className,
  onSearch,
  onPrevious,
  onPerPageChange,
}) => {
  const [isCostCenterFormOpen, setIsCostCenterFormOpen] =
    useState<boolean>(false);

  const [isCostCenterDeleteDialogOpen, setIsCostCenterDeleteDialogOpen] =
    useState<boolean>(false);

  const [selectedCostCenter, setSelectedCostCenter] =
    useState<CostCenterResponse | null>(null);

  const queryClient = useQueryClient();

  const { costCenters, isCostCentersLoading, pagination } = useCostCentersList({
    filters,
  });

  const openCostCenterForm = (costCenter?: CostCenterResponse) => {
    setSelectedCostCenter(costCenter ?? null);
    setIsCostCenterFormOpen(true);
  };

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => deleteCostCenter(id),
    onSuccess: () => {
      notifySuccess(
        "Cost Center Deleted",
        "The cost center has been deleted successfully.",
      );
      queryClient.invalidateQueries({
        queryKey: [COST_CENTERS_LIST_QUERY_KEY],
      });
      setIsCostCenterDeleteDialogOpen(false);
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to Delete Cost center", formatApiError(error));
    },
  });

  const columns = getCostCentersTableColumns({
    onEdit: openCostCenterForm,
    onView: () => {},
    onDelete: (costCenter: CostCenterResponse) => {
      setIsCostCenterDeleteDialogOpen(true);
      setSelectedCostCenter(costCenter);
    },
  });

  const handleFormSubmitSuccess = () => {
    setIsCostCenterFormOpen(false);
    queryClient.invalidateQueries({
      queryKey: [COST_CENTERS_LIST_QUERY_KEY],
    });
  };

  return (
    <DataTableLayout
      title="Cost Centers List"
      className={className}
      isLoading={isCostCentersLoading}
      search={filters.search}
      onSearch={onSearch}
      onAddNew={openCostCenterForm}
      isSearchFieldExpandable
      tableProps={{
        data: costCenters,
        columns,
        pagination,
        isLoading: isCostCentersLoading,
        loadingMessage: "Cost centers list loading...",
        onPrevious,
        onNext,
        handlePerPage: onPerPageChange,
        emptyState: "no-cost-centers",
        paginationLabel: "Cost centers",
        getTableRowClassName: () => "cursor-pointer",
        headerClassName: "bg-cool-gray-frost",
      }}
    >
      <Sheet open={isCostCenterFormOpen} onOpenChange={setIsCostCenterFormOpen}>
        <CostCenterForm
          onSuccess={handleFormSubmitSuccess}
          selectedCostCenter={selectedCostCenter}
        />
      </Sheet>
      <ConfirmAlertDialog
        open={isCostCenterDeleteDialogOpen}
        onOpenChange={setIsCostCenterDeleteDialogOpen}
        title="Delete Selected Cost Center?"
        content={`You're about to delete Cost Center "${selectedCostCenter?.code}". This action cannot be undone.`}
        onConfirm={() => deleteMutate(selectedCostCenter!.id)}
        cancelText="Cancel"
        confirmText={isDeletePending ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isDeletePending}
        onCancel={() => setIsCostCenterDeleteDialogOpen(false)}
        isApiResponseLoading={isDeletePending}
      />
    </DataTableLayout>
  );
};

export default CostCentersList;
