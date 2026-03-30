import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addNewGrade, updateGrade } from "@/services/roles-and-grades.service";
import {
  gradeFormSchema,
  type GradeFormValues,
} from "@/helpers/zod-schema/common";
import type {
  GradeItem,
  UpdateNewGradeParams,
  GradeParams,
} from "@/types/grades.types";
import {
  ASSET_PATH,
  GRADS_LIST_API_QUERY_KEY,
  GRADE_FORM_DEFAULT_VALUES,
  TRAIN_CLASS_ALLOWANCE_OPTIONS,
  FLIGHT_CLASS_ALLOWANCE_OPTIONS,
  AUTO_APPROVAL_THRESHOLD_TYPE_OPTIONS,
} from "@/helpers/constants/common";
import {
  notifyError,
  notifySuccess,
  pickTrainClass,
  formatApiError,
  pickFlightClass,
  allowOnlyNumbers,
} from "@/lib/utils";

import AppAccordion from "@/components/common/AppAccordion";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import FormSelectField from "@/components/common/FormSelectField";

interface GradeFormProps {
  grade: GradeItem | null;
  isGradeFormOpen: boolean;
  setIsGradeFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GradeForm: React.FC<GradeFormProps> = ({
  grade,
  isGradeFormOpen,
  setIsGradeFormOpen,
}) => {
  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: GRADE_FORM_DEFAULT_VALUES,
  });

  const queryClient = useQueryClient();
  const isEditMode = !!grade;

  const { mutate: mutateAddNewGrade, isPending: isAddNewGradeLoading } =
    useMutation<GradeItem, AxiosError<APIErrorResponse>, GradeParams>({
      mutationFn: (grade) => addNewGrade(grade),
      onSuccess: () => {
        notifySuccess(
          "Grade Added",
          "The new grade has been added successfully.",
        );
        queryClient.invalidateQueries({ queryKey: [GRADS_LIST_API_QUERY_KEY] });
        form.reset(GRADE_FORM_DEFAULT_VALUES);
        setIsGradeFormOpen(false);
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Add new grade failed", formatApiError(error));
      },
    });

  const { mutate: mutateUpdateGrade, isPending: isUpdateGradeLoading } =
    useMutation<GradeItem, AxiosError<APIErrorResponse>, UpdateNewGradeParams>({
      mutationFn: ({ gradeId, gradeParams }) =>
        updateGrade(gradeId, gradeParams),
      onSuccess: (res) => {
        notifySuccess("Grade updated", `grade ${res.name} got updated `);
        queryClient.invalidateQueries({ queryKey: [GRADS_LIST_API_QUERY_KEY] });
        form.reset(GRADE_FORM_DEFAULT_VALUES);
        setIsGradeFormOpen(false);
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Update new grade failed", formatApiError(error));
      },
    });

  const onsubmit = (formValues: GradeFormValues) => {
    const params: GradeParams = {
      name: formValues.name,
      daily_limit: formValues.expense_max_daily_limit,
      monthly_limit: formValues.expense_max_monthly_limit,
      auto_approval_threshold_type:
        formValues.auto_approval_threshold_type?.value,
      flight_class: formValues.flight_class_allowance.value,
      train_class: formValues.train_class_allowance.value,
      domestic_accommodation_limit: formValues.domestic_limit,
      international_accommodation_limit: formValues.international_limit,
      food_daily_limit: formValues.food_max_daily_limit,
      bike_mileage_rate: formValues.bike_mileage_rate,
      car_mileage_rate: formValues.car_mileage_rate,
    };

    if (isEditMode) {
      mutateUpdateGrade({ gradeId: grade.id, gradeParams: params });
    } else {
      mutateAddNewGrade(params);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: grade.name,
        expense_max_daily_limit: Number(grade.daily_limit),
        expense_max_monthly_limit: Number(grade.monthly_limit),
        auto_approval_threshold_type: AUTO_APPROVAL_THRESHOLD_TYPE_OPTIONS.find(
          (option) => option.value === grade.auto_approval_threshold_type,
        ),
        flight_class_allowance: pickFlightClass(grade.flight_class),
        train_class_allowance: pickTrainClass(grade.train_class),
        domestic_limit: Number(grade.domestic_accommodation_limit),
        international_limit: Number(grade.international_accommodation_limit),
        food_max_daily_limit: Number(grade.food_daily_limit),
        bike_mileage_rate: Number(grade.bike_mileage_rate),
        car_mileage_rate: Number(grade.car_mileage_rate),
      });
    } else {
      form.reset(GRADE_FORM_DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  useEffect(() => {
    if (!isGradeFormOpen) form.reset(GRADE_FORM_DEFAULT_VALUES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGradeFormOpen]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={
        isEditMode
          ? "Update New Grades and Policies"
          : "Add New Grades & Policies"
      }
      description="Define allowances and policies for this grade."
      onSave={form.handleSubmit(onsubmit)}
      onCancel={() => form.reset(GRADE_FORM_DEFAULT_VALUES)}
      isSubmitting={isAddNewGradeLoading || isUpdateGradeLoading}
      saveButtonState={!form.formState.isDirty}
      submitText={isEditMode ? "Update Grade" : "Add new Grade"}
      loadingText={isEditMode ? "Updating grade..." : "Adding grade..."}
    >
      <form className="space-y-4 sm:space-y-6">
        <h1 className="text-lg leading-[100%] font-semibold text-black">
          Grade details
        </h1>
        <FormInputField<GradeFormValues>
          control={form.control}
          label="Name of grade"
          name="name"
          placeholder="Enter grade name"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          className="h-8.5 text-xs font-medium shadow-none"
        />

        <AppAccordion accordionTrigger="Expense limit">
          <div className="bg-lavender-haze mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2 sm:gap-6.5">
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Max daily limit"
              name="expense_max_daily_limit"
              placeholder="Enter daily limit"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              formatAsINR
            />
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Max monthly limit"
              name="expense_max_monthly_limit"
              placeholder="Enter monthly limit"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              formatAsINR
            />
            <FormSelectField
              control={form.control}
              name="auto_approval_threshold_type"
              label="Auto-approval threshold"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              placeholder="Select auto approval threshold"
              options={AUTO_APPROVAL_THRESHOLD_TYPE_OPTIONS}
              className="border-silver-gray h-8.5 min-h-8.5! rounded-md"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => `${option.value}`}
              fieldClassName="gap-2 sm:col-span-2 "
              placeholderClassName="text-slate-whisper"
            />
          </div>
        </AppAccordion>

        <AppAccordion accordionTrigger="Travel policy">
          <div className="bg-lavender-haze mt-4 grid gap-4 rounded-2xl p-6 sm:gap-6.5">
            <FormSelectField
              control={form.control}
              name="flight_class_allowance"
              label="Flight class allowance"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              placeholder="Select flight class"
              options={FLIGHT_CLASS_ALLOWANCE_OPTIONS}
              className="border-silver-gray h-8.5 min-h-8.5! rounded-md"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => `${option.value}`}
              fieldClassName="gap-2 "
              placeholderClassName="text-slate-whisper"
            />
            <FormSelectField
              control={form.control}
              name="train_class_allowance"
              label="Train class allowance"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              placeholder="Select train class"
              options={TRAIN_CLASS_ALLOWANCE_OPTIONS}
              className="border-silver-gray h-8.5 min-h-8.5! rounded-md"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => `${option.value}`}
              fieldClassName="gap-2 "
              placeholderClassName="text-slate-whisper"
            />
          </div>
        </AppAccordion>

        <AppAccordion accordionTrigger="Accommodation Policy">
          <div className="bg-lavender-haze mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Domestic limit"
              name="domestic_limit"
              placeholder="Enter domestic limit"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              formatAsINR
            />
            <FormInputField<GradeFormValues>
              control={form.control}
              label="International limit"
              name="international_limit"
              placeholder="Enter international limit"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              formatAsINR
            />
          </div>
        </AppAccordion>

        <AppAccordion accordionTrigger="Food Policy">
          <div className="bg-lavender-haze mt-4 rounded-2xl p-6">
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Max daily limit"
              name="food_max_daily_limit"
              placeholder="Enter daily limit"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              formatAsINR
            />
          </div>
        </AppAccordion>

        <AppAccordion accordionTrigger="Mileage Settings">
          <div className="bg-lavender-haze mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Car mileage rate"
              name="car_mileage_rate"
              placeholder="Enter car mileage rate"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              isAddon
              formatAsINR
              endAddon={
                <span className="text-slate-whisper text-xs font-medium">
                  /km
                </span>
              }
            />
            <FormInputField<GradeFormValues>
              control={form.control}
              label="Bike mileage rate"
              name="bike_mileage_rate"
              placeholder="Enter bike mileage rate"
              labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
              fieldClassName="gap-2"
              className="h-8.5 text-xs font-medium shadow-none"
              onKeyDown={allowOnlyNumbers}
              isAddon
              formatAsINR
              endAddon={
                <span className="text-slate-whisper text-xs font-medium">
                  /km
                </span>
              }
            />
          </div>
        </AppAccordion>
      </form>
    </ConfigureSheet>
  );
};

export default GradeForm;
