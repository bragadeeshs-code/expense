import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { ASSET_PATH, PER_PAGE } from "@/helpers/constants/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEmployees } from "@/services/employee.service";
import {
  companyVehicleSetupFormSchema,
  type CompanyVehicleSetupFormValues,
} from "../../helpers/zod-schema/onboardingSchema";
import {
  FUEL_TYPE_OPTIONS,
  VEHICLE_TYPE_OPTION,
  COMPANY_VEHICLE_SETUP_FORM_DEFAULT_VALUES,
  COMPANY_ASSETS_MUTATION_QUERY,
} from "../../helpers/constants/onboarding";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import {
  addCompanyAsset,
  updateCompanyAsset,
} from "@/services/organization-setup.service";
import SelectDropdown from "@/components/common/SelectDropdown";
import type {
  AddCompanyAssetPayload,
  CompanyAssetItem,
} from "../../types/onboarding.types";
import type { EmployeeItem, EmployeeResponse } from "@/types/employees.types";

interface CompanyVehicleSetupFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  companyAssetItem?: CompanyAssetItem;
}

const CompanyVehicleSetupForm: React.FC<CompanyVehicleSetupFormProps> = ({
  isOpen,
  onSuccess = () => {},
  companyAssetItem,
}) => {
  const form = useForm<CompanyVehicleSetupFormValues>({
    resolver: zodResolver(companyVehicleSetupFormSchema),
    defaultValues: COMPANY_VEHICLE_SETUP_FORM_DEFAULT_VALUES,
  });

  const queryClient = useQueryClient();

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const { data: users, isFetching: isUsersFetching } =
    useQuery<EmployeeResponse>({
      queryFn: () =>
        getEmployees({
          search: search,
          page: 1,
          perPage: PER_PAGE,
        }),
      queryKey: ["users", debouncedSearch],
      refetchOnWindowFocus: false,
      enabled: isOpen,
      retry: false,
    });

  const { mutate: mutateAddCompanyVehicle, isPending: isAddingCompanyVehicle } =
    useMutation({
      mutationFn: (formData: AddCompanyAssetPayload) =>
        addCompanyAsset(formData),
      onSuccess: () => {
        notifySuccess(
          "Vehicle Added",
          "The new vehicle has been added successfully.",
        );
        form.reset();
        queryClient.invalidateQueries({
          queryKey: [COMPANY_ASSETS_MUTATION_QUERY],
        });
        onSuccess();
      },
      onError(error: AxiosError<APIErrorResponse>) {
        notifyError("Failed to Add Vehicle", formatApiError(error));
      },
    });

  const {
    mutate: mutateUpdateCompanyVehicle,
    isPending: isUpdatingCompanyVehicle,
  } = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: number;
      formData: AddCompanyAssetPayload;
    }) => updateCompanyAsset(id, formData),
    onSuccess: () => {
      notifySuccess(
        "Vehicle Updated",
        "The new vehicle has been updated successfully.",
      );
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [COMPANY_ASSETS_MUTATION_QUERY],
      });
      onSuccess();
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to Update Vehicle", formatApiError(error));
    },
  });

  const isUpdate = !!companyAssetItem;

  const onSubmit = (data: CompanyVehicleSetupFormValues) => {
    const addCompanyVehicle: AddCompanyAssetPayload = {
      asset_code: data.vehicle_number,
      category: "vehicle",
      fuel_type: data.fuel_type?.value as string,
      make_model: data.make_and_model,
      operator_user_id: data.operational_responsibility?.id as number,
      vehicle_type: data.vehicle_type?.value as string,
    };
    if (isUpdate) {
      mutateUpdateCompanyVehicle({
        id: companyAssetItem.id,
        formData: addCompanyVehicle,
      });
    } else {
      mutateAddCompanyVehicle(addCompanyVehicle);
    }
  };

  useEffect(() => {
    if (isOpen && companyAssetItem) {
      form.reset({
        vehicle_type: VEHICLE_TYPE_OPTION.find(
          (option) => option.value === companyAssetItem.vehicle_type,
        ),
        make_and_model: companyAssetItem.make_model,
        operational_responsibility: companyAssetItem.operator,
        vehicle_number: companyAssetItem.asset_code,
        fuel_type: FUEL_TYPE_OPTIONS["vehicle"].find(
          (option) => option.value === companyAssetItem.fuel_type,
        ),
      });
    } else {
      form.reset(COMPANY_VEHICLE_SETUP_FORM_DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/automotive-battery-icon.svg`}
      title="Company Vehicle Setup"
      description="Add and manage company-owned vehicles"
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset(COMPANY_VEHICLE_SETUP_FORM_DEFAULT_VALUES)}
      isSubmitting={isAddingCompanyVehicle || isUpdatingCompanyVehicle}
      saveButtonState={!form.formState.isDirty}
      submitText="Save Company Vehicle Setup"
      loadingText="Saving..."
    >
      <form className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            label="Vehicle number"
            name="vehicle_number"
            placeholder="Enter vehicle number"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            className="h-8.5 text-xs font-medium shadow-none"
          />
          <FormSelectField
            control={form.control}
            name="vehicle_type"
            label="Vehicle type"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholder="Select vehicle type"
            options={VEHICLE_TYPE_OPTION}
            defaultValue={VEHICLE_TYPE_OPTION}
            className="border-silver-gray h-8.5 min-h-8.5! rounded-md bg-white"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            fieldClassName="gap-2 "
            placeholderClassName="text-slate-whisper"
          />
          <FormInputField
            control={form.control}
            label="Make & Model"
            name="make_and_model"
            placeholder="Enter make and model"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            className="h-8.5 text-xs font-medium shadow-none"
          />
          <FormSelectField
            control={form.control}
            name="fuel_type"
            label="Fuel type"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholder="Select fuel type"
            options={FUEL_TYPE_OPTIONS["vehicle"]}
            className="border-silver-gray h-8.5 min-h-8.5! rounded-md bg-white"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            fieldClassName="gap-2 "
            placeholderClassName="text-slate-whisper"
          />

          <SelectDropdown<CompanyVehicleSetupFormValues, EmployeeItem>
            name="operational_responsibility"
            label="Operational responsibility"
            control={form.control}
            value={search}
            options={users?.data ?? []}
            getLabel={(option) => `${option.first_name} ${option.last_name}`}
            getValue={(option) => `${option.id}`}
            className="border-silver-gray h-9 rounded-md bg-white px-4"
            isLoading={isUsersFetching}
            fieldClassName="gap-2"
            onInputChange={(value) => handleSearch(value)}
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholderText="Select manager"
            placeholderClassName="text-slate-whisper"
          />
        </div>
      </form>
    </ConfigureSheet>
  );
};

export default CompanyVehicleSetupForm;
