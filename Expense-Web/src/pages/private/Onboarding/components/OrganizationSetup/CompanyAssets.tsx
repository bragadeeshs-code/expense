import { isEmpty } from "lodash";
import { useState } from "react";

import { Sheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/state-management/hook";

import EmptyStateCard from "@/components/common/EmptyStateCard";
import { Button } from "@/components/ui/button";
import useCompanyAssets from "../../helpers/hooks/useGetCompanyAssets";
import AddNewCompanyAssetDropdown from "./AddNewCompanyAssetDropdown";
import CompanyAssetsList from "./CompanyAssetsList";
import GeneratorSetupForm from "./GeneratorSetupForm";
import CompanyVehicleSetupForm from "./CompanyVehicleSetupForm";
import { PER_PAGE } from "@/helpers/constants/common";
import type { companyAssetForm } from "../../types/onboarding.types";

const CompanyAssets = () => {
  const { search, perPage, page } = useAppSelector(
    (state) => state.companyAssetsListController,
  );
  const { companyAssets, isCompanyAssetsListLoading, pagination } =
    useCompanyAssets();

  const [isAddCompanyAssetFormOpen, setIsAddCompanyAssetFormOpen] =
    useState<boolean>(false);
  const [selectedCompanyAssetForm, setSelectedCompanyAssetForm] =
    useState<companyAssetForm | null>(null);

  const isDefaultFilters = !search && perPage === PER_PAGE && page === 1;

  const shouldShowEmptyStateCard = isEmpty(companyAssets) && isDefaultFilters;

  const handleSuccess = () => {
    setIsAddCompanyAssetFormOpen(false);
  };

  return (
    <div className="h-full">
      {shouldShowEmptyStateCard ? (
        isCompanyAssetsListLoading ? (
          <div className="flex h-full items-center justify-center gap-4">
            <Spinner /> Loading company assets...
          </div>
        ) : (
          <EmptyStateCard message="Nothing has been configured yet. Add your first company card, vehicle, or asset to begin.">
            <AddNewCompanyAssetDropdown
              dropdownMenuContentClass="w-36"
              setSelectedCompanyAssetForm={setSelectedCompanyAssetForm}
              setIsAddCompanyAssetFormOpen={setIsAddCompanyAssetFormOpen}
            >
              <Button
                className="mt-4 w-36 rounded-[8px] [background-image:var(--gradient-primary)] p-2 text-sm leading-6 font-medium tracking-[0%]"
                onClick={() => {}}
              >
                Add new
              </Button>
            </AddNewCompanyAssetDropdown>
          </EmptyStateCard>
        )
      ) : (
        <CompanyAssetsList
          pagination={pagination}
          companyAssetsTableData={companyAssets}
          isCompanyAssetsListLoading={isCompanyAssetsListLoading}
          setSelectedCompanyAssetForm={setSelectedCompanyAssetForm}
          setIsAddCompanyAssetFormOpen={setIsAddCompanyAssetFormOpen}
        />
      )}
      <Sheet
        open={isAddCompanyAssetFormOpen}
        onOpenChange={setIsAddCompanyAssetFormOpen}
      >
        {selectedCompanyAssetForm === "Generator" ? (
          <GeneratorSetupForm
            onSuccess={handleSuccess}
            isOpen={isAddCompanyAssetFormOpen}
          />
        ) : (
          <CompanyVehicleSetupForm
            onSuccess={handleSuccess}
            isOpen={isAddCompanyAssetFormOpen}
          />
        )}
      </Sheet>
    </div>
  );
};

export default CompanyAssets;
