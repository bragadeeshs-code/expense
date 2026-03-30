import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AxiosError } from "axios";

import { ASSET_PATH, PER_PAGE } from "@/helpers/constants/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEmployees } from "@/services/employee.service";
import {
  generatorSetupFormSchema,
  type GeneratorSetupFormValues,
} from "../../helpers/zod-schema/onboardingSchema";
import {
  FUEL_TYPE_OPTIONS,
  GENERATOR_TYPE_OPTIONS,
  GENERATOR_SETUP_FORM_DEFAULT_VALUES,
  COMPANY_ASSETS_MUTATION_QUERY,
} from "../../helpers/constants/onboarding";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import {
  addCompanyAsset,
  updateCompanyAsset,
} from "@/services/organization-setup.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import SelectDropdown from "@/components/common/SelectDropdown";
import FormSelectField from "@/components/common/FormSelectField";
import type {
  AddCompanyAssetPayload,
  CompanyAssetItem,
} from "../../types/onboarding.types";
import type { EmployeeItem, EmployeeResponse } from "@/types/employees.types";

interface GeneratorSetupFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  companyAssetItem?: CompanyAssetItem;
}

const GeneratorSetupForm: React.FC<GeneratorSetupFormProps> = ({
  isOpen,
  onSuccess = () => {},
  companyAssetItem,
}) => {
  const form = useForm<GeneratorSetupFormValues>({
    resolver: zodResolver(generatorSetupFormSchema),
    defaultValues: GENERATOR_SETUP_FORM_DEFAULT_VALUES,
  });

  const {
    search,
    debouncedSearch,
    updateSearch: handleSearch,
  } = useDebouncedSearch();

  const { data: users } = useQuery<EmployeeResponse>({
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

  const queryClient = useQueryClient();

  const {
    mutate: mutateAddCompanyGenerator,
    isPending: isAddingCompnayGenerator,
  } = useMutation({
    mutationFn: (formData: AddCompanyAssetPayload) => addCompanyAsset(formData),
    onSuccess: () => {
      notifySuccess(
        "Generator Added",
        "The new generator has been added successfully.",
      );
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [COMPANY_ASSETS_MUTATION_QUERY],
      });
      onSuccess();
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to Add Generator", formatApiError(error));
    },
  });

  const {
    mutate: mutateUpdateCompanyGenerator,
    isPending: isUpdatingCompanyGenerator,
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
        "Generator Updated",
        "The new generator has been updated successfully.",
      );
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [COMPANY_ASSETS_MUTATION_QUERY],
      });
      onSuccess();
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to Update Generator", formatApiError(error));
    },
  });

  const isUpdate = !!companyAssetItem;

  const onSubmit = (data: GeneratorSetupFormValues) => {
    const addCompanyGenerator: AddCompanyAssetPayload = {
      asset_code: data.generator_id,
      category: "generator",
      fuel_type: data.fuel_type?.value as string,
      make_model: data.make_and_model,
      operator_user_id: data.operational_responsibility?.id as number,
      generator_type: data.generator_type?.value as string,
    };
    if (isUpdate) {
      mutateUpdateCompanyGenerator({
        id: companyAssetItem.id,
        formData: addCompanyGenerator,
      });
    } else {
      mutateAddCompanyGenerator(addCompanyGenerator);
    }
  };

  useEffect(() => {
    if (isOpen && companyAssetItem) {
      form.reset({
        fuel_type: FUEL_TYPE_OPTIONS["generator"].find(
          (option) => option.value === companyAssetItem.fuel_type,
        ),
        make_and_model: companyAssetItem.make_model,
        operational_responsibility: companyAssetItem.operator,
        generator_id: companyAssetItem.asset_code,
        generator_type: GENERATOR_TYPE_OPTIONS.find(
          (option) => option.value === companyAssetItem.generator_type,
        ),
      });
    } else {
      form.reset(GENERATOR_SETUP_FORM_DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/automotive-battery-icon.svg`}
      title="Generator Setup"
      description="Oversee generators, set rules, and handle maintenance."
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset(GENERATOR_SETUP_FORM_DEFAULT_VALUES)}
      isSubmitting={isAddingCompnayGenerator || isUpdatingCompanyGenerator}
      saveButtonState={!form.formState.isDirty}
      submitText="Save Generator Setup"
      loadingText="Saving..."
    >
      <form className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            label="Generator ID"
            name="generator_id"
            placeholder="Enter generator ID"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            className="h-8.5 text-xs font-medium shadow-none"
          />
          <FormSelectField
            control={form.control}
            name="generator_type"
            label="Generator type"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            placeholder="Select generator type"
            options={GENERATOR_TYPE_OPTIONS}
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
            options={FUEL_TYPE_OPTIONS["generator"]}
            className="border-silver-gray h-8.5 min-h-8.5! rounded-md bg-white"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => `${option.value}`}
            fieldClassName="gap-2 "
            placeholderClassName="text-slate-whisper"
          />

          <SelectDropdown<GeneratorSetupFormValues, EmployeeItem>
            name="operational_responsibility"
            label="Operational responsibility"
            value={search}
            control={form.control}
            options={users?.data ?? []}
            getLabel={(option) => `${option.first_name} ${option.last_name}`}
            getValue={(option) => `${option.id}`}
            onInputChange={(value) => handleSearch(value)}
            className="border-silver-gray h-9 rounded-md bg-white px-4"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            placeholderText="Select manager"
          />
        </div>
      </form>
    </ConfigureSheet>
  );
};

export default GeneratorSetupForm;
