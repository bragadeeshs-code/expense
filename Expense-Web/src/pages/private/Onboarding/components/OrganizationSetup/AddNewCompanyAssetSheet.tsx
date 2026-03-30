import React, { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import GeneratorSetupForm from "./GeneratorSetupForm";
import CompanyVehicleSetupForm from "./CompanyVehicleSetupForm";
import type { CompanyAssetItem } from "../../types/onboarding.types";

interface AddNewCompanyAssetSheetProps {
  children: React.ReactNode;
  companyAssetItem?: CompanyAssetItem;
}

const AddNewCompanyAssetSheet: React.FC<AddNewCompanyAssetSheetProps> = ({
  children,
  companyAssetItem,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {companyAssetItem?.category === "generator" ? (
        <GeneratorSetupForm isOpen={open} companyAssetItem={companyAssetItem} />
      ) : (
        <CompanyVehicleSetupForm
          companyAssetItem={companyAssetItem}
          isOpen={open}
          onSuccess={handleSuccess}
        />
      )}
    </Sheet>
  );
};

export default AddNewCompanyAssetSheet;
