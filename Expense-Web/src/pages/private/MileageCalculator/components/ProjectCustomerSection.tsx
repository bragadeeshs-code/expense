import type { Control } from "react-hook-form";

import type { MileageProject } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

import FormInputField from "@/components/common/FormInputField";
import SelectDropdown from "@/components/common/SelectDropdown";

export interface ProjectCustomerSectionProps {
  search: string;
  control: Control<MileageExpenseFormValues>;
  projects?: MileageProject[];
  isLoadingProjects: boolean;
  onSearchChange: (value: string) => void;
}

const ProjectCustomerSection: React.FC<ProjectCustomerSectionProps> = ({
  search,
  control,
  projects = [],
  isLoadingProjects,
  onSearchChange,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <FormInputField
        name="customer_name"
        label="Customer Name"
        control={control}
        className="border-silver-gray h-11"
        placeholder="Enter customer name"
        labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
        fieldClassName="gap-2"
      />
      <SelectDropdown<MileageExpenseFormValues, MileageProject>
        name="project"
        label="Project"
        isSearchable
        value={search}
        control={control}
        options={projects}
        getLabel={(option) => option.name}
        getValue={(option) => String(option.id)}
        className="border-silver-gray h-11 rounded-md"
        placeholderClassName="h-11"
        isLoading={isLoadingProjects}
        labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
        fieldClassName="gap-2"
        placeholderText="Select project"
        onInputChange={onSearchChange}
      />
    </div>
  );
};

export default ProjectCustomerSection;
