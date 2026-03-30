import type React from "react";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import "react-phone-number-input/style.css";

import { ASSET_PATH } from "@/helpers/constants/common";

import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import {
  departmentsFormSchema,
  type DepartmentsFormValues,
} from "@/helpers/zod-schema/departmentsSchema";
import { DEPARTMENTS_FORM_DEFAULT_VALUES } from "@/helpers/constants/departments";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import type {
  DepartmentBase,
  DepartmentResponse,
  DepartmentUpdateProps,
} from "@/types/departments.types";
import {
  createDepartment,
  updateDepartment,
} from "@/services/departments.service";
import { useEffect } from "react";

interface DepartmentsFormProps {
  onSuccess: () => void;
  department: DepartmentResponse | null;
}

const DepartmentsForm: React.FC<DepartmentsFormProps> = ({
  onSuccess,
  department,
}) => {
  const form = useForm<DepartmentsFormValues>({
    resolver: zodResolver(departmentsFormSchema),
    defaultValues: DEPARTMENTS_FORM_DEFAULT_VALUES,
  });

  const isEditMode = !!department;

  const { mutate: mutateAddDepartment, isPending: isDepartmentAddLoading } =
    useMutation<
      DepartmentResponse,
      AxiosError<APIErrorResponse>,
      DepartmentBase
    >({
      mutationFn: createDepartment,
      onSuccess: () => {
        notifySuccess(
          "Department Added",
          "The new department has been added successfully.",
        );
        form.reset();
        onSuccess();
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Add new department failed", formatApiError(error));
      },
    });

  const {
    mutate: mutateUpdateDepartment,
    isPending: isDepartmentUpdateLoading,
  } = useMutation<
    DepartmentResponse,
    AxiosError<APIErrorResponse>,
    DepartmentUpdateProps
  >({
    mutationFn: ({ id, data }) => updateDepartment({ id, data }),
    onSuccess: () => {
      notifySuccess(
        "Department Updated",
        "The department has been updated successfully.",
      );
      form.reset();
      onSuccess();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Department update failed", formatApiError(error));
    },
  });

  const onSubmit = (formValues: DepartmentsFormValues) => {
    if (isEditMode) {
      mutateUpdateDepartment({
        id: department.id,
        data: formValues,
      });
    } else {
      mutateAddDepartment(formValues);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        name: department.name,
      });
    } else {
      form.reset(DEPARTMENTS_FORM_DEFAULT_VALUES);
    }
  }, [department]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={isEditMode ? "Update Department" : "Create Department"}
      description={isEditMode ? "Update department" : "Add a department"}
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset()}
      isSubmitting={isDepartmentAddLoading || isDepartmentUpdateLoading}
      saveButtonState={!form.formState.isDirty}
      submitText={isEditMode ? "Update department" : "Add new department"}
      loadingText={
        isEditMode ? "Updating department..." : "Adding department..."
      }
    >
      <form>
        <FormInputField
          control={form.control}
          label="Department name"
          name="name"
          placeholder="Enter department name"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
      </form>
    </ConfigureSheet>
  );
};

export default DepartmentsForm;
