import { format } from "date-fns";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import "react-phone-number-input/style.css";

import { ASSET_PATH } from "@/helpers/constants/common";
import { FormSwitchField } from "@/components/common/FormSwitchField";
import { allowOnlyNumbers } from "@/lib/utils";
import type { TripBase, TripItem } from "../helpers/types/trips.type";
import type { CurrentUserProject, SelectOption } from "@/types/common.types";
import {
  tripFormSchema,
  type tripFormValues,
} from "../helpers/zod-schema/tripFormSchema";
import {
  MODE_OF_TRAVEL_OPTIONS,
  TRIP_FORM_DEFAULT_VALUES,
} from "../helpers/constants/trips";

import useAddTrip from "../helpers/hooks/useAddTrip";
import useUpdateTrip from "../helpers/hooks/useUpdateTrip";
import FormDateField from "@/components/common/FormDateField";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import SelectDropdown from "@/components/common/SelectDropdown";
import FormInputField from "@/components/common/FormInputField";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import useCurrentUserProjectsList from "@/helpers/hooks/useCurrentUserProjectsList";
import FormTextAreaField from "@/components/common/FormTextAreaField";

interface TripFormProps {
  onSuccess: () => void;
  selectedTrip: TripItem | null;
  isTripFormOpen: boolean;
}

const TripForm: React.FC<TripFormProps> = ({
  onSuccess,
  selectedTrip,
  isTripFormOpen,
}) => {
  const form = useForm<tripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: TRIP_FORM_DEFAULT_VALUES,
  });

  const isEditMode = !!selectedTrip;

  const isAdvanceNeeded = useWatch({
    control: form.control,
    name: "advance_needed",
  });

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const { projects, isProjectsFetching } = useCurrentUserProjectsList({
    search: debouncedSearch,
    isEnabled: isTripFormOpen,
  });

  const handleFormSubmitSuccess = () => {
    form.reset();
    onSuccess();
  };

  const { mutateAddTrip, isAddTripLoading } = useAddTrip({
    onSuccess: handleFormSubmitSuccess,
  });

  const { mutateUpdateTrip, isUpdateTripLoading } = useUpdateTrip({
    onSuccess: handleFormSubmitSuccess,
  });

  const onSubmit = (formValues: tripFormValues) => {
    const {
      project,
      description,
      destination,
      start_date,
      end_date,
      mode_of_travel,
      hotel_accommodation_needed,
      vehicle_needed,
      advance_needed,
      advance_amount,
    } = formValues;

    const params: TripBase = {
      project_id: Number(project!.id),
      description: description || null,
      destination,
      start_date: format(start_date!, "yyyy-MM-dd"),
      end_date: format(end_date!, "yyyy-MM-dd"),
      mode_of_travel: mode_of_travel!.value,
      hotel_accommodation_needed,
      vehicle_needed,
      advance_needed,
      advance_amount: advance_amount?.toString() ?? null,
    };

    if (isEditMode) {
      mutateUpdateTrip({ id: selectedTrip.id, data: params });
    } else {
      mutateAddTrip(params);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        project: selectedTrip.project,
        description: selectedTrip.description,
        destination: selectedTrip.destination,
        start_date: new Date(selectedTrip.start_date),
        end_date: new Date(selectedTrip.end_date),
        mode_of_travel: MODE_OF_TRAVEL_OPTIONS.find(
          (travelMode) => travelMode.value === selectedTrip.mode_of_travel,
        ),
        hotel_accommodation_needed: selectedTrip.hotel_accommodation_needed,
        vehicle_needed: selectedTrip.vehicle_needed,
        advance_needed: selectedTrip.advance_needed,
        advance_amount: selectedTrip.advance_amount
          ? Number(selectedTrip.advance_amount)
          : null,
      });
    } else {
      form.reset(TRIP_FORM_DEFAULT_VALUES);
    }
  }, [selectedTrip]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={isEditMode ? "Update travel request" : "Add new travel request"}
      description={
        isEditMode
          ? "Update travel request details for trip planning and approval"
          : "Add travel request details for trip planning and approval"
      }
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset()}
      isSubmitting={isAddTripLoading || isUpdateTripLoading}
      saveButtonState={!form.formState.isDirty}
      submitText={isEditMode ? "Update" : "Add"}
      loadingText={
        isEditMode
          ? "Updating travel request..."
          : "Adding new travel request..."
      }
    >
      <form className="space-y-4 sm:space-y-6">
        <SelectDropdown<tripFormValues, CurrentUserProject>
          control={form.control}
          name="project"
          label="Project ID"
          value={search}
          options={projects}
          getLabel={(option) => `${option.code}`}
          getValue={(option) => `${option.id}`}
          isLoading={isProjectsFetching}
          onInputChange={(value) => handleSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          isRequired
          placeholderText="Select project ID"
        />
        <FormTextAreaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Optional"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          className="resize-none"
        />
        <FormInputField
          control={form.control}
          label="Destination"
          name="destination"
          placeholder="Enter destination"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          isRequired
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormDateField
            name="start_date"
            label="Start date"
            control={form.control}
            placeholder="Pick start date"
            fieldClassName="gap-2"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholderClassName="text-slate-whisper"
            isRequired
          />
          <FormDateField
            name="end_date"
            label="End date"
            control={form.control}
            placeholder="Pick end date"
            fieldClassName="gap-2"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholderClassName="text-slate-whisper"
            isRequired
          />
        </div>

        <SelectDropdown<tripFormValues, SelectOption>
          control={form.control}
          name="mode_of_travel"
          label="Mode of travel"
          options={MODE_OF_TRAVEL_OPTIONS}
          getLabel={(option) => `${option.label}`}
          getValue={(option) => `${option.value}`}
          onInputChange={(value) => handleSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          placeholderText="Select mode of travel"
          isSearchable={false}
          isRequired
        />

        <FormSwitchField
          control={form.control}
          name="hotel_accommodation_needed"
          label="Hotel accommodation needed ?"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
        />

        <FormSwitchField
          control={form.control}
          name="vehicle_needed"
          label="Vehicle needed ?"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
        />

        <FormSwitchField
          control={form.control}
          name="advance_needed"
          label="Advance needed ?"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
        />

        {isAdvanceNeeded && (
          <FormInputField
            control={form.control}
            label="Amount"
            name="advance_amount"
            placeholder="Enter advance amount"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            onKeyDown={allowOnlyNumbers}
            formatAsINR
          />
        )}
      </form>
    </ConfigureSheet>
  );
};

export default TripForm;
