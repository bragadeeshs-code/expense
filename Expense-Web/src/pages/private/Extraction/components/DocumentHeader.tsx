import type z from "zod";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import SelectDropdown from "@/components/common/SelectDropdown";
import FormInputField from "@/components/common/FormInputField";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import useCurrentUserProjectsList from "@/helpers/hooks/useCurrentUserProjectsList";

import type { extractionFormSchema } from "../helpers/zod-schema/extractionSchema";
import type { CurrentUserProject } from "@/types/common.types";
import { getTripsOptions } from "@/services/trips.service";
import { useQuery } from "@tanstack/react-query";
import type { TripInfo } from "../../Trip/helpers/types/trips.type";

interface DocumentHeaderProps {
  isEditableStatus: boolean;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  isEditableStatus,
}) => {
  const { control, trigger } =
    useFormContext<z.infer<typeof extractionFormSchema>>();

  const [project, trip] = useWatch({
    control,
    name: ["project", "trip"],
  });

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const {
    search: tripSearch,
    debouncedSearch: debouncedTripSearch,
    updateSearch: handleTripSearch,
  } = useDebouncedSearch();

  const { projects, isProjectsFetching } = useCurrentUserProjectsList({
    search: debouncedSearch,
  });

  const { data: tripOptions } = useQuery({
    queryKey: ["trip-options", debouncedTripSearch],
    queryFn: () => getTripsOptions(debouncedTripSearch),
  });

  useEffect(() => {
    if (!project && !trip) return;
    trigger(["project", "trip"]);
  }, [project, trip, trigger]);

  return (
    <div className="shadow-card-soft border-porcelain grid grid-cols-1 gap-5 rounded-2xl border px-6 py-5 @lg:grid-cols-2">
      <SelectDropdown<z.infer<typeof extractionFormSchema>, CurrentUserProject>
        control={control}
        name="project"
        label="Project ID"
        value={search}
        options={projects}
        getLabel={(option) => `${option.code}`}
        getValue={(option) => `${option.id}`}
        disabled={!isEditableStatus}
        className="border-silver-gray h-9 rounded-lg bg-white"
        isLoading={isProjectsFetching}
        fieldClassName="gap-2"
        isRequired={isEditableStatus && !trip?.id}
        onInputChange={(value) => handleSearch(value)}
        labelClassName="text-xs font-semibold"
        hideDropdownIcon={!isEditableStatus}
        placeholderText={
          isEditableStatus ? "Select project ID" : "Not assigned"
        }
        placeholderClassName="text-slate-whisper"
      />
      <SelectDropdown<z.infer<typeof extractionFormSchema>, TripInfo>
        control={control}
        name="trip"
        label="Trip ID"
        value={tripSearch}
        options={tripOptions ?? []}
        getLabel={(option) => `${option.destination}`}
        getValue={(option) => `${option.id}`}
        disabled={!isEditableStatus}
        className="border-silver-gray h-9 rounded-lg bg-white"
        isLoading={false}
        fieldClassName="gap-2"
        isRequired={isEditableStatus && !project?.id}
        onInputChange={(value) => handleTripSearch(value)}
        labelClassName="text-xs font-semibold"
        hideDropdownIcon={!isEditableStatus}
        placeholderText={isEditableStatus ? "Select trip ID" : "Not assigned"}
        placeholderClassName="text-slate-whisper"
      />
      <FormInputField
        control={control}
        label="Customer ID"
        name="customer_id"
        placeholder={
          isEditableStatus ? "Enter your customer ID" : "Not assigned"
        }
        readOnly={!isEditableStatus}
        className="rounded-lg"
        labelClassName="text-xs font-semibold mb-1"
      />
      <FormInputField
        control={control}
        label="SO Number"
        name="so_number"
        className="rounded-lg"
        placeholder={isEditableStatus ? "Enter your SO number" : "Not assigned"}
        readOnly={!isEditableStatus}
        labelClassName="text-xs font-semibold mb-1"
      />
    </div>
  );
};

export default DocumentHeader;
