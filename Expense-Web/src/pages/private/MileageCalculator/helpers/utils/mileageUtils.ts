import { format } from "date-fns";

import type { MileageExpensePayload } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

export const calculateTravelAmount = (
  distanceMeters: number,
  vehicleValue?: string | null,
  rates?: { CAR: number; BIKE: number },
): number => {
  if (!vehicleValue || !rates) return 0;

  const dist = Number(distanceMeters);
  if (isNaN(dist) || dist <= 0) return 0;

  const normalizedVehicle = vehicleValue.toUpperCase();
  const rateStr = rates[normalizedVehicle as keyof typeof rates];
  const rate = Number(rateStr);

  if (isNaN(rate)) return 0;

  const distKm = dist / 1000;
  return parseFloat((distKm * rate).toFixed(2));
};

export const formatMileagePayload = (
  data: MileageExpenseFormValues,
): MileageExpensePayload => {
  return {
    from_date: data.from_date ? format(data.from_date, "yyyy-MM-dd") : "",
    to_date: data.to_date ? format(data.to_date, "yyyy-MM-dd") : "",
    from_location: {
      name: data.from_location?.name || "",
      latitude: data.from_location?.lat || 0,
      longitude: data.from_location?.lng || 0,
    },
    to_location: {
      name: data.to_location?.name || "",
      latitude: data.to_location?.lat || 0,
      longitude: data.to_location?.lng || 0,
    },
    vehicle: data.vehicle?.value.toLowerCase() || "",
    vehicle_type: data.vehicle_type?.value.toLowerCase() || "",
    distance: parseFloat((data.distance / 1000).toFixed(2)),
    project_id: data.project?.id || 0,
    customer_name: data.customer_name,
    duration_seconds: data.duration_seconds || 0,
  };
};

export const formatDuration = (seconds?: number | string): string => {
  const totalSeconds =
    typeof seconds === "string" ? parseFloat(seconds) : seconds;
  if (!totalSeconds || totalSeconds <= 0) return "";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }

  if (totalSeconds > 0 && m === 0) {
    return "1m";
  }

  return `${m}m`;
};

export const formatDistance = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const formatAmount = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const getMapProfile = (vehicleValue?: string | null): string =>
  vehicleValue?.toUpperCase() === "BIKE" ? "biking" : "driving";

export const formatCarbonEmission = (value?: string | number): string => {
  if (value === undefined || value === null || value === "") return "N/A";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "N/A";

  const formattedValue = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numValue);

  return `${formattedValue} Kg CO₂e`;
};
