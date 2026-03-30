import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  notifyError,
  allowOnlyNumbers,
  formatApiError,
  notifySuccess,
} from "@/lib/utils";
import {
  addProject,
  updateProject,
  getProjectDetail,
} from "@/services/project.service";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/helpers/zod-schema/commonSchema";
import {
  ASSET_PATH,
  PROJECT_FORM_DEFAULTS,
  PROJECTS_LIST_API_QUERY_KEY,
  PROJECT_DETAIL_API_QUERY_KEY,
} from "@/helpers/constants/common";

import TooltipWrapper from "@/components/common/TooltipWrapper";
import ConfigureSheet from "@/components/common/ConfigureSheet";
import FormInputField from "@/components/common/FormInputField";
import FormTextAreaField from "@/components/common/FormTextAreaField";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import SelectDropdown from "@/components/common/SelectDropdown";

import type {
  AddProjectPayload,
  ProjectDetailResponse,
} from "@/types/common.types";
import { getEmployeeOptions } from "@/services/employee.service";
import { useManagers } from "@/helpers/hooks/useManagers";
import type { EmployeeOptions, EmployeeSummary } from "@/types/employees.types";
import FormMultiSelectField from "../FormMultiSelectField";

const AddNewProjectForm = ({
  isOpen,
  onSuccess,
  projectID,
}: {
  isOpen: boolean;
  onSuccess: () => void;
  projectID: number | null;
}) => {
  const isEditMode = !!projectID;

  const { data: projectDetailData } = useQuery<
    ProjectDetailResponse,
    AxiosError<APIErrorResponse>
  >({
    enabled: isEditMode,
    refetchOnWindowFocus: false,
    queryKey: [PROJECT_DETAIL_API_QUERY_KEY, projectID],
    queryFn: () => getProjectDetail(projectID!),
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: PROJECT_FORM_DEFAULTS,
  });

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState } = form;

  const { fields, append, replace } = useFieldArray({
    control,
    name: "approvers",
  });

  const addApprover = () => {
    append({
      approval_level: fields.length + 1,
      approver: null,
    });
  };

  const {
    search: managerSearch,
    debouncedSearch: managerDebouncedSearch,
    updateSearch: handleManagerSearch,
  } = useDebouncedSearch();

  const { managers, isManagersFetching } = useManagers({
    search: managerDebouncedSearch,
    isEnabled: isOpen,
  });

  const {
    debouncedSearch: employeeDebouncedSearch,
    updateSearch: handleEmployeeSearch,
  } = useDebouncedSearch();

  const { data: users, isFetching: isFetchingUsers } =
    useQuery<EmployeeOptions>({
      queryFn: () =>
        getEmployeeOptions({
          search: employeeDebouncedSearch,
        }),
      queryKey: ["users", employeeDebouncedSearch],
      refetchOnWindowFocus: false,
      enabled: isOpen,
      retry: false,
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AddProjectPayload) => addProject(formData),
    onSuccess: () => {
      notifySuccess(
        "Project Added",
        "The new project has been added successfully.",
      );
      form.reset();
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [PROJECTS_LIST_API_QUERY_KEY],
      });
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to add project", formatApiError(error));
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: (formData: AddProjectPayload) =>
      updateProject(projectID!, formData),
    onSuccess: () => {
      notifySuccess(
        "Project Updated",
        "The project details have been updated successfully.",
      );
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [PROJECTS_LIST_API_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_DETAIL_API_QUERY_KEY, projectID],
      });
    },
    onError(error: AxiosError<APIErrorResponse>) {
      notifyError("Failed to update project", formatApiError(error));
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    const payload: AddProjectPayload = {
      name: data.name,
      description: data.description ?? "",
      code: data.code,
      manager_id: data.manager!.id,
      monthly_budget: data.monthly_budget,
      total_budget: data.total_budget,
      member_ids: data.members.map((member) => member.id),
      approvers: data.approvers.map((approver) => ({
        approval_level: approver.approval_level,
        approver_id: approver.approver!.id,
      })),
    };
    if (isEditMode) {
      updateMutate(payload);
    } else {
      mutate(payload);
    }
  };

  useEffect(() => {
    if (projectDetailData) {
      form.reset({
        name: projectDetailData.name,
        description: projectDetailData.description,
        code: projectDetailData.code,
        monthly_budget: Number(projectDetailData.monthly_budget),
        total_budget: Number(projectDetailData.total_budget),
        manager: projectDetailData.manager,
        members: projectDetailData.members,
        approvers: projectDetailData.approvers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetailData]);

  useEffect(() => {
    if (!isEditMode && isOpen) {
      form.reset(PROJECT_FORM_DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={isEditMode ? "Update existing project" : "Create new project"}
      description="Configure project details, budgets, and approval rules."
      onSave={handleSubmit(onSubmit)}
      onCancel={() => reset()}
      isSubmitting={isPending || isUpdatePending}
      saveButtonState={!formState.isDirty}
      submitText={isEditMode ? "Update project" : "Create project"}
      loadingText={isEditMode ? "Updating project" : "Creating project..."}
    >
      <form className="space-y-4 sm:space-y-6">
        <FormInputField
          control={control}
          name="name"
          label="Project Name"
          placeholder="Enter project name"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
        <FormTextAreaField
          control={control}
          name="description"
          label="Project Description"
          placeholder="Optional (max 50 characters)"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          className="resize-none"
        />
        <FormInputField
          control={control}
          name="code"
          label="Project Code"
          placeholder="YT-102"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />

        <SelectDropdown<ProjectFormValues, EmployeeSummary>
          name="manager"
          label="Project Manager"
          value={managerSearch}
          control={control}
          options={managers ?? []}
          getLabel={(option) => `${option.first_name} ${option.last_name}`}
          getValue={(option) => `${option.id}`}
          isLoading={isManagersFetching}
          onInputChange={(value) => handleManagerSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          placeholderText="Select manager"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            label="Monthly budget"
            name="monthly_budget"
            placeholder="Enter monthly budget"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            className="h-8.5 text-xs font-medium shadow-none"
            onKeyDown={allowOnlyNumbers}
            formatAsINR
          />
          <FormInputField
            control={form.control}
            label="Total budget"
            name="total_budget"
            placeholder="Enter total budget"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            className="h-8.5 text-xs font-medium shadow-none"
            onKeyDown={allowOnlyNumbers}
            formatAsINR
          />
        </div>

        <FormMultiSelectField<ProjectFormValues, EmployeeSummary>
          control={control}
          name="members"
          label="Assign Members"
          options={users || []}
          getLabel={(option) => `${option.first_name} ${option.last_name}`}
          isLoading={isFetchingUsers}
          getValue={(option) => String(option.id)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          placeholderText="Select Members"
          onSearchChange={(value) => handleEmployeeSearch(value)}
          placeHolderClassName="text-slate-whisper"
        />
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-black">
              Assign Approval Matrix
            </label>
            <Button
              type="button"
              size="sm"
              onClick={addApprover}
              className="[background-image:var(--gradient-primary)] bg-clip-text text-sm leading-[100%] font-medium tracking-[0%] text-transparent"
            >
              + Add more
            </Button>
          </div>
          {fields.map((field, index) => (
            <div className="flex items-center gap-2" key={index}>
              <SelectDropdown<ProjectFormValues, EmployeeSummary>
                key={field.id}
                name={`approvers.${index}.approver`}
                value={managerSearch}
                control={control}
                options={managers ?? []}
                getLabel={(option) =>
                  `${option.first_name} ${option.last_name}`
                }
                getValue={(option) => `${option.id}`}
                isLoading={isManagersFetching}
                onInputChange={(value) => handleManagerSearch(value)}
                labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
                fieldClassName="gap-2"
                placeholderText="Select approver"
              />
              <TooltipWrapper content="Remove Level">
                <Button
                  key={field.id}
                  type="button"
                  variant="ghost"
                  className="text-red-400"
                  size="icon"
                  onClick={() => {
                    const current = form.getValues("approvers");
                    const updated = current
                      .filter((_, i) => i !== index)
                      .map((item, i) => ({
                        ...item,
                        approval_level: i + 1,
                      }));

                    replace(updated);
                  }}
                >
                  <Trash2 />
                </Button>
              </TooltipWrapper>
            </div>
          ))}
        </div>
      </form>
    </ConfigureSheet>
  );
};

export default AddNewProjectForm;
