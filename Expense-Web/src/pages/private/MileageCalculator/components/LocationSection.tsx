import { Controller, type Control } from "react-hook-form";

import type { MapLocationPoint } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

import LocationInput from "@/components/mileage/LocationInput";

export interface LocationSectionProps {
  control: Control<MileageExpenseFormValues>;
  onOpenMap: (field: MapLocationPoint) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  control,
  onOpenMap,
}) => {
  return (
    <>
      <Controller
        name="from_location"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <LocationInput
              label="Starting Point"
              value={field.value?.name || ""}
              placeholder="Select starting location"
              onClick={() => onOpenMap("from")}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />

      <Controller
        name="to_location"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <LocationInput
              label="Ending Point"
              value={field.value?.name || ""}
              placeholder="Select ending location"
              onClick={() => onOpenMap("to")}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />
    </>
  );
};

export default LocationSection;
