import { X } from "lucide-react";
import type { Control } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { MileageProject } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import { MILEAGE_STATUS_STYLES } from "@/pages/private/MileageCalculator/helpers/constants/mileage";

import AppBadge from "@/components/common/AppBadge";
import SelectDropdown from "@/components/common/SelectDropdown";

interface ProjectFormValues {
  project: MileageProject | null;
  cost_center: string | null;
}

interface TripDetailHeaderProps {
  search: string;
  tripId: number;
  status: TRAVEL_EXPENSE_STATUS;
  control: Control<ProjectFormValues>;
  projects: MileageProject[];
  isProjectsFetching: boolean;
  handleSearch: (value: string) => void;
  setIsCardVisible: (visible: boolean) => void;
}

const TripDetailHeader = ({
  tripId,
  status,
  search,
  control,
  projects,
  isProjectsFetching,
  handleSearch,
  setIsCardVisible,
}: TripDetailHeaderProps) => {
  return (
    <div className="p-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-black tracking-tight text-black sm:text-2xl">
            Mileage-{tripId}
          </h1>
          <div className="border-cool-gray mt-2 h-[2px] w-full border-b-2 border-dashed" />
        </div>
        <div className="flex items-center gap-4">
          <AppBadge
            className={cn(
              "rounded-full border-none px-3 py-1 text-xs font-semibold capitalize",
              MILEAGE_STATUS_STYLES[
                status.toLowerCase() as TRAVEL_EXPENSE_STATUS
              ],
            )}
          >
            {status.toLowerCase() === TRAVEL_EXPENSE_STATUS.SUBMITTED
              ? "Submitted"
              : status.toLowerCase() === TRAVEL_EXPENSE_STATUS.DRAFTED
                ? "Draft"
                : status.replace(/_/g, " ")}
          </AppBadge>
          <button
            onClick={() => setIsCardVisible(false)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label className="shrink-0 text-sm font-medium text-gray-500">
            Project:
          </label>
          <div className="w-full">
            <SelectDropdown<ProjectFormValues, MileageProject>
              name="project"
              control={control}
              options={projects || []}
              getLabel={(option) => option.name}
              getValue={(option) => String(option.id)}
              isSearchable
              value={search}
              onInputChange={handleSearch}
              isLoading={isProjectsFetching}
              disabled={status !== TRAVEL_EXPENSE_STATUS.DRAFTED}
              className="border-lilac-frost h-9 rounded-lg bg-white text-xs font-bold text-gray-700 transition-all hover:bg-white"
              placeholderClassName="border-lilac-frost h-9 rounded-lg bg-white text-xs font-semibold text-gray-400 transition-all"
              placeholderText="Select Project"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailHeader;
