import type { Control } from "react-hook-form";

import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";
import type {
  MileageProject,
  MapLocationPoint,
  MileageRateResponse,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import LocationSection from "@/pages/private/MileageCalculator/components/LocationSection";
import DateRangeSection from "@/pages/private/MileageCalculator/components/DateRangeSection";
import ProjectCustomerSection from "@/pages/private/MileageCalculator/components/ProjectCustomerSection";
import VehicleDistanceSection from "@/pages/private/MileageCalculator/components/VehicleDistanceSection";

export interface MileageExpenseFormProps {
  search: string;
  control: Control<MileageExpenseFormValues>;
  projects?: MileageProject[];
  isCalculating: boolean;
  isLoadingProjects: boolean;
  mileageRates?: MileageRateResponse;
  onOpenMap: (field: MapLocationPoint) => void;
  onSearchChange: (value: string) => void;
}

const MileageExpenseForm: React.FC<MileageExpenseFormProps> = ({
  search,
  control,
  projects,
  isCalculating,
  isLoadingProjects,
  mileageRates,
  onOpenMap,
  onSearchChange,
}) => {
  return (
    <div className="scrollbar-thin flex h-full flex-col gap-6 overflow-y-auto pr-2 pb-10">
      <ProjectCustomerSection
        control={control}
        search={search}
        onSearchChange={onSearchChange}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
      />
      <DateRangeSection control={control} />
      <LocationSection control={control} onOpenMap={onOpenMap} />
      <VehicleDistanceSection
        control={control}
        isCalculating={isCalculating}
        mileageRates={mileageRates}
      />
    </div>
  );
};

export default MileageExpenseForm;
