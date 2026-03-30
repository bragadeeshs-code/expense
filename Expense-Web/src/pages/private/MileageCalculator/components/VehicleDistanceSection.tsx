import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useFormState, useWatch, type Control } from "react-hook-form";

import { cn } from "@/lib/utils";
import { VEHICLES } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import { VEHICLE_TYPES } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import type { MileageRateResponse } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";

export interface VehicleDistanceSectionProps {
  control: Control<MileageExpenseFormValues>;
  isCalculating: boolean;
  mileageRates?: MileageRateResponse;
}

const VehicleDistanceSection: React.FC<VehicleDistanceSectionProps> = ({
  control,
  isCalculating,
  mileageRates,
}) => {
  const distance = useWatch({ control, name: "distance" });
  const vehicle = useWatch({ control, name: "vehicle" });
  const { errors } = useFormState({ control });

  const dynamicVehicles = useMemo(() => {
    if (!mileageRates) return VEHICLES;
    return VEHICLES.map((v) => ({
      ...v,
      rate:
        v.value === "CAR"
          ? parseFloat(mileageRates.car_mileage_rate || "0")
          : parseFloat(mileageRates.bike_mileage_rate || "0"),
    }));
  }, [mileageRates]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <FormInputField
          name="distance"
          label="Distance"
          control={control}
          readOnly
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
          renderInput={(field) => (
            <div
              className={cn(
                "border-silver-gray text-muted-foreground flex h-11 w-full items-center rounded-md border bg-gray-50 px-3 py-2 text-sm",
                errors.distance && "border-destructive",
              )}
            >
              {isCalculating ? (
                <span className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating Distance...
                </span>
              ) : (
                <span
                  className={cn(
                    field.value !== undefined &&
                      field.value !== null &&
                      "font-medium text-black",
                    errors.distance && "text-destructive",
                  )}
                >
                  {typeof field.value === "number" && field.value > 0
                    ? `${(field.value / 1000).toFixed(2)} km`
                    : errors.distance?.message === "No route found"
                      ? "No route found"
                      : "Distance will be calculated automatically"}
                </span>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex gap-4">
        <FormSelectField
          name="vehicle_type"
          label="Vehicle Type"
          control={control}
          options={VEHICLE_TYPES}
          className="border-silver-gray h-11! rounded-md!"
          placeholder="Select type"
          getOptionLabel={(option) => (option as { label: string }).label}
          getOptionValue={(option) => (option as { value: string }).value}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
          fdeep-charcoalieldClassName="gap-2 w-full"
        />

        <FormSelectField
          name="vehicle"
          label="Vehicle"
          control={control}
          options={dynamicVehicles}
          className="border-silver-gray h-11! rounded-md!"
          placeholder="Select vehicle"
          getOptionLabel={(option) => (option as { label: string }).label}
          getOptionValue={(option) => (option as { value: string }).value}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
          fieldClassName="gap-2 w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FormInputField
          name="amount"
          label="Price of Travel"
          control={control}
          readOnly
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-deep-charcoal"
          renderInput={(field) => (
            <div className="border-silver-gray text-muted-foreground flex h-11 w-full items-center rounded-md border bg-gray-50 px-3 py-2 text-sm">
              <span
                className={cn(
                  field.value !== undefined &&
                    field.value !== null &&
                    "font-medium text-black",
                )}
              >
                {vehicle && distance && distance > 0
                  ? `₹${field.value ?? 0}`
                  : "Price will be calculated automatically"}
              </span>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default VehicleDistanceSection;
