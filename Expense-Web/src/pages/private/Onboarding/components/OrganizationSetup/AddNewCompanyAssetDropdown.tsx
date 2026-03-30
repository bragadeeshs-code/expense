import AppDropdown from "@/components/common/AppDropdown";
import type { companyAssetForm } from "../../types/onboarding.types";

interface AddNewCompanyAssetDropdownProps {
  children?: React.ReactNode;
  dropdownMenuContentClass?: string;
  setSelectedCompanyAssetForm: React.Dispatch<
    React.SetStateAction<companyAssetForm | null>
  >;
  setIsAddCompanyAssetFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewCompanyAssetDropdown: React.FC<AddNewCompanyAssetDropdownProps> = ({
  children,
  dropdownMenuContentClass,
  setSelectedCompanyAssetForm,
  setIsAddCompanyAssetFormOpen,
}) => {
  return (
    <AppDropdown
      dropdownMenuContentClass={dropdownMenuContentClass}
      dropdownMenuItems={[
        {
          menuItemTitle: "Generator",
          handleClick: () => {
            setSelectedCompanyAssetForm("Generator");
            setIsAddCompanyAssetFormOpen(true);
          },
        },
        {
          menuItemTitle: " Vehicle",
          handleClick: () => {
            setSelectedCompanyAssetForm("Vehicle");
            setIsAddCompanyAssetFormOpen(true);
          },
        },
      ]}
    >
      {children}
    </AppDropdown>
  );
};

export default AddNewCompanyAssetDropdown;
