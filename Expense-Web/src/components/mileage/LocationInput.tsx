import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LocationInputProps } from "../../types/mappls";

const LocationInput = ({
  label,
  value,
  placeholder,
  onClick,
  error,
}: LocationInputProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-deep-charcoal text-sm font-semibold">{label}</label>
    <div
      onClick={onClick}
      className={cn(
        "flex h-11 w-full cursor-pointer items-center gap-3 rounded-md border bg-white px-3 transition-colors hover:bg-white",
        error ? "border-destructive" : "border-silver-gray",
        value ? "text-black" : "text-cool-gray",
      )}
    >
      <MapPin className="text-cool-gray h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-sm">{value || placeholder}</span>
    </div>
    {error && <p className="text-destructive text-xs">{error}</p>}
  </div>
);

export default LocationInput;
