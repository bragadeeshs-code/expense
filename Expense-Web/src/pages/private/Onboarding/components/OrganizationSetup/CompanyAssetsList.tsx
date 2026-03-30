import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../../state-management/features/companyAssetsListslice";
import { ASSET_PATH } from "@/helpers/constants/common";
import { DataTable } from "@/components/common/Table/DataTable";
import type { Pagination } from "@/types/common.types";
import { useCompanyAssetsTableColumns } from "./CompanyAssets.columns";
import type {
  companyAssetForm,
  CompanyAssetItem,
} from "../../types/onboarding.types";

import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import useDeleteCompanyAsset from "../../helpers/hooks/useDeleteCompanyAsset";
import ExpandableDebouncedSearch from "@/components/common/ExpandableDebouncedSearch";
import AddNewCompanyAssetDropdown from "./AddNewCompanyAssetDropdown";

interface CompanyAssetsListProps {
  pagination: Pagination;
  companyAssetsTableData: CompanyAssetItem[];
  isCompanyAssetsListLoading: boolean;
  setSelectedCompanyAssetForm: React.Dispatch<
    React.SetStateAction<companyAssetForm | null>
  >;
  setIsAddCompanyAssetFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyAssetsList: React.FC<CompanyAssetsListProps> = ({
  pagination,
  companyAssetsTableData,
  isCompanyAssetsListLoading,
  setSelectedCompanyAssetForm,
  setIsAddCompanyAssetFormOpen,
}) => {
  const { search } = useAppSelector(
    (state) => state.companyAssetsListController,
  );

  const dispatch = useDispatch();

  const handleSearch = (value: string) => {
    dispatch(setSearchTextFilter(value));
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [companyassetIdToDelete, setCompanyAssetIdToDelete] = useState<
    number | null
  >(null);

  const { isCompanyAssetDeleteLoading, mutateCompanyAssetDelete } =
    useDeleteCompanyAsset({
      setCompanyAssetIdToDelete,
      setIsDeleteDialogOpen,
    });

  const columns = useCompanyAssetsTableColumns({
    onDelete: (assetId: number) => {
      setCompanyAssetIdToDelete(assetId);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <Card className="border-porcelain shadow-card-soft @container flex h-full w-full flex-col gap-4 rounded-2xl border px-4 py-5 sm:h-fit sm:max-h-full">
      <div
        className={cn(
          "flex flex-col @2xl:flex-row @2xl:items-center @2xl:justify-between",
        )}
      >
        <p className="mb-4 font-semibold text-black @2xl:mb-0">
          Company Assets List
        </p>
        <div
          className={cn(
            "flex flex-col items-end gap-2 @lg:flex-row @lg:justify-end",
          )}
        >
          <ExpandableDebouncedSearch
            search={search}
            onSearch={handleSearch}
            isLoading={isCompanyAssetsListLoading}
            placeholder="Search ..."
          />

          <AddNewCompanyAssetDropdown
            dropdownMenuContentClass="w-36"
            setSelectedCompanyAssetForm={setSelectedCompanyAssetForm}
            setIsAddCompanyAssetFormOpen={setIsAddCompanyAssetFormOpen}
          >
            <Button
              variant="outline"
              className="border-vivid-violet hover:bg-frosted-lavender h-8 w-33 gap-0.5 [background-image:var(--gradient-primary)] bg-clip-text px-0 py-0 text-xs leading-[100%] font-medium tracking-[0%] text-transparent hover:bg-none hover:bg-clip-content hover:text-purple-500"
              disabled={isCompanyAssetsListLoading}
              onClick={() => {}}
            >
              <img src={`${ASSET_PATH}/icons/plus_icon.svg`} alt="plus icon" />
              Add new
            </Button>
          </AddNewCompanyAssetDropdown>
        </div>
      </div>

      <DataTable<CompanyAssetItem>
        data={companyAssetsTableData}
        columns={columns}
        pagination={pagination}
        isLoading={isCompanyAssetsListLoading}
        loadingMessage="Loading Company Assets..."
        onPrevious={() => dispatch(setPage(pagination.page - 1))}
        onNext={() => dispatch(setPage(pagination.page + 1))}
        handlePerPage={(value) => dispatch(setPerPage(value))}
        emptyState="no-company-assets"
        headerClassName="bg-cool-gray-frost"
        paginationLabel="company assets"
      />
      <ConfirmAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Selected Asset?"
        content="You're about to delete selected Asset. This action cannot be undone."
        onConfirm={() => {
          if (companyassetIdToDelete)
            mutateCompanyAssetDelete({ id: companyassetIdToDelete });
        }}
        cancelText="Cancel"
        confirmText={isCompanyAssetDeleteLoading ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
        disabled={isCompanyAssetDeleteLoading}
        onCancel={() => setCompanyAssetIdToDelete(null)}
        isApiResponseLoading={isCompanyAssetDeleteLoading}
      />
    </Card>
  );
};

export default CompanyAssetsList;
