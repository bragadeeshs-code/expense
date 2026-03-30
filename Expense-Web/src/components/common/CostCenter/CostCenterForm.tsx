import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import "react-phone-number-input/style.css";

import { ASSET_PATH } from "@/helpers/constants/common";
import { COST_CENTER_FORM_DEFAULT_VALUES } from "@/helpers/constants/cost-centers";

import {
  createCostCenter,
  updateCostCenter,
} from "@/services/cost-centers.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";

import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import type {
  CostCenterResponse,
  CostCenterBase,
  CostCenterUpdateParams,
} from "@/types/cost-center.types";
import {
  costCenterFormSchema,
  type CostCenterFormValues,
} from "@/helpers/zod-schema/costCentersSchema";

interface CostCenterFormProps {
  onSuccess: () => void;
  selectedCostCenter: CostCenterResponse | null;
}

const CostCenterForm: React.FC<CostCenterFormProps> = ({
  onSuccess,
  selectedCostCenter,
}) => {
  const form = useForm<CostCenterFormValues>({
    resolver: zodResolver(costCenterFormSchema),
    defaultValues: COST_CENTER_FORM_DEFAULT_VALUES,
  });

  const isEditMode = !!selectedCostCenter;

  const { mutate: mutateAddCostCenter, isPending: isCostCenterAddLoading } =
    useMutation<
      CostCenterResponse,
      AxiosError<APIErrorResponse>,
      CostCenterBase
    >({
      mutationFn: createCostCenter,
      onSuccess: () => {
        notifySuccess(
          "Cost center Added",
          "The new cost center has been added successfully.",
        );
        form.reset();
        onSuccess();
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Add new cost center failed", formatApiError(error));
      },
    });

  const { mutate: mutateUpdateCostCenter, isPending: isCostCenterUpdating } =
    useMutation<
      CostCenterResponse,
      AxiosError<APIErrorResponse>,
      CostCenterUpdateParams
    >({
      mutationFn: ({ id, data }) => updateCostCenter({ id, data }),
      onSuccess: () => {
        notifySuccess(
          "Cost center Updated",
          "The cost center details has been updated successfully.",
        );
        form.reset();
        onSuccess();
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Cost center update failed", formatApiError(error));
      },
    });

  const onSubmit = (formValues: CostCenterFormValues) => {
    if (isEditMode) {
      mutateUpdateCostCenter({
        id: selectedCostCenter.id,
        data: formValues,
      });
    } else {
      mutateAddCostCenter(formValues);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        code: selectedCostCenter.code,
      });
    } else {
      form.reset(COST_CENTER_FORM_DEFAULT_VALUES);
    }
  }, [selectedCostCenter]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={isEditMode ? "Update new cost center" : "Create cost center"}
      description={
        isEditMode
          ? "Update cost center and assign its approvers"
          : "Add a cost center and assign its approvers."
      }
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset()}
      isSubmitting={isCostCenterAddLoading || isCostCenterUpdating}
      saveButtonState={!form.formState.isDirty}
      submitText={isEditMode ? "Update cost center" : "Add new cost center"}
      loadingText={
        isEditMode ? "Updating cost center..." : "Adding cost center..."
      }
    >
      <form>
        <FormInputField
          control={form.control}
          label="Cost Center Code"
          name="code"
          placeholder="Enter cost center code"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
      </form>
    </ConfigureSheet>
  );
};

export default CostCenterForm;
