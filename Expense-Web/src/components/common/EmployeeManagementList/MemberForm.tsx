import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { getRoles } from "@/services/roles.service";
import { getGrades } from "@/services/roles-and-grades.service";
import { useManagers } from "@/helpers/hooks/useManagers";
import type { CostCenterItem } from "@/types/cost-center.types";
import type { DepartmentItem } from "@/types/departments.types";
import { MEMBER_FORM_DEFAULT_VALUES } from "@/helpers/zod-schema/common";
import { addEmployee, updateEmployee } from "@/services/employee.service";
import type { GradeItem, GradesListResponse } from "@/types/grades.types";
import {
  memberFormSchema,
  type MemberFormValues,
} from "@/helpers/zod-schema/commonSchema";
import {
  notifyError,
  notifySuccess,
  formatWithPlus,
  formatApiError,
} from "@/lib/utils";
import {
  ASSET_PATH,
  EMPLOYEES_LIST_API_QUERY_KEY,
  TEAM_MEMBERS_LIST_API_QUERY_KEY,
  EMPLOYEE_DASHBOARD_API_QUERY_KEY,
} from "@/helpers/constants/common";

import FormInputField from "@/components/common/FormInputField";
import SelectDropdown from "../SelectDropdown";
import ConfigureSheet from "../ConfigureSheet";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import useDepartmentsList from "@/helpers/hooks/useDepartmentsList";
import useCostCentersList from "@/helpers/hooks/useCostCentersList";
import type {
  EmployeeItem,
  EmployeeSummary,
  MemberRequestPayload,
} from "@/types/employees.types";

interface MemberFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  employee?: EmployeeItem;
}

const MemberForm: React.FC<MemberFormProps> = ({
  isOpen,
  onSuccess = () => {},
  employee,
}) => {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: MEMBER_FORM_DEFAULT_VALUES,
  });

  const {
    search: reportingManagerSearch,
    debouncedSearch: debouncedReportingManagerSearch,
    updateSearch: handleReportingManagerSearch,
  } = useDebouncedSearch();

  const {
    search: gradeSearch,
    debouncedSearch: debouncedGradeSearch,
    updateSearch: handleGradeSearch,
  } = useDebouncedSearch();

  const {
    search: costCenterSearch,
    debouncedSearch: debouncedCostCenterSearch,
    updateSearch: handleCostCenterSearch,
  } = useDebouncedSearch();

  const {
    search: departmentSearch,
    debouncedSearch: debouncedDepartmentSearch,
    updateSearch: handleDepartmentSearch,
  } = useDebouncedSearch();

  const queryClient = useQueryClient();

  const { data: grades, isFetching: isGradesFetching } =
    useQuery<GradesListResponse>({
      queryFn: () => getGrades({ search: gradeSearch, page: 1, perPage: 10 }),
      queryKey: ["grades", debouncedGradeSearch],
      refetchOnWindowFocus: false,
      enabled: isOpen,
      retry: false,
    });

  const { data: roles, isFetching: isRolesFetching } = useQuery<RolesResponse>({
    queryFn: () => getRoles(),
    queryKey: ["roles"],
    refetchOnWindowFocus: false,
    enabled: isOpen,
    retry: false,
  });

  const { managers, isManagersFetching } = useManagers({
    search: debouncedReportingManagerSearch,
    isEnabled: isOpen,
  });

  const { costCenters, isCostCentersLoading } = useCostCentersList({
    filters: {
      search: debouncedCostCenterSearch,
      page: 1,
      perPage: 5,
    },
    isEnabled: isOpen,
  });

  const { departments, isDepartmentsLoading } = useDepartmentsList({
    filters: {
      search: debouncedDepartmentSearch,
      page: 1,
      perPage: 5,
    },
    isEnabled: isOpen,
  });

  const { mutate: mutateAddEmployee, isPending: isAddingEmployee } =
    useMutation({
      mutationFn: (formData: MemberRequestPayload) => addEmployee(formData),
      onSuccess: () => {
        notifySuccess(
          "Member Added",
          "The new member has been added successfully.",
        );
        queryClient.invalidateQueries({
          queryKey: [EMPLOYEES_LIST_API_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [EMPLOYEE_DASHBOARD_API_QUERY_KEY],
        });
        form.reset();
        onSuccess();
      },
      onError(error: AxiosError<APIErrorResponse>) {
        notifyError("Failed to Add Member", formatApiError(error));
      },
    });

  const { mutate: mutateUpdateEmployee, isPending: isUpdatingEmployee } =
    useMutation({
      mutationFn: ({
        id,
        formData,
      }: {
        id: number;
        formData: MemberRequestPayload;
      }) => updateEmployee(id, formData),
      onSuccess: () => {
        notifySuccess(
          "Member Updated",
          "The member has been updated successfully.",
        );

        queryClient.invalidateQueries({
          queryKey: [EMPLOYEES_LIST_API_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [TEAM_MEMBERS_LIST_API_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [EMPLOYEE_DASHBOARD_API_QUERY_KEY],
        });
        form.reset();
        onSuccess();
      },
      onError(error: AxiosError<APIErrorResponse>) {
        notifyError("Failed to update Member", formatApiError(error));
      },
    });

  const isUpdate = !!employee;

  const onSubmit = (formData: MemberFormValues) => {
    const {
      email,
      first_name,
      grade,
      last_name,
      mobile_number,
      role,
      code,
      reporting_manager,
      cost_center,
      department,
    } = formData;

    const memberRequestPayload: MemberRequestPayload = {
      code: code,
      email: email,
      first_name: first_name,
      last_name: last_name,
      grade_id: grade!.id,
      role_id: role!.id,
      reporting_manager_id: reporting_manager?.id,
      cost_center_id: cost_center?.id,
      department_id: department?.id,
    };
    if (mobile_number) {
      memberRequestPayload["mobile_number"] = mobile_number;
    }
    if (isUpdate) {
      mutateUpdateEmployee({ id: employee.id, formData: memberRequestPayload });
    } else {
      mutateAddEmployee(memberRequestPayload);
    }
  };

  useEffect(() => {
    if (isOpen && employee) {
      form.reset({
        code: employee.code,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        mobile_number: formatWithPlus(employee.mobile_number),
        grade: employee.grade ?? {},
        role: employee.role ?? {},
        reporting_manager: employee.reporting_manager,
        cost_center: employee.cost_center,
        department: employee.department,
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employee]);

  return (
    <ConfigureSheet
      image={`${ASSET_PATH}/icons/globe.svg`}
      title={isUpdate ? "Update member" : "Add new member"}
      description={
        isUpdate
          ? "Update and organize employees"
          : "Add and organize employees"
      }
      onSave={form.handleSubmit(onSubmit)}
      onCancel={() => form.reset()}
      isSubmitting={isAddingEmployee || isUpdatingEmployee}
      saveButtonState={!form.formState.isDirty}
      submitText={isUpdate ? "Update member" : "Add new member"}
      loadingText={isUpdate ? "Updating member..." : "Adding member..."}
    >
      <form className="space-y-4 sm:space-y-6">
        <FormInputField
          control={form.control}
          label="Emp ID"
          name="code"
          placeholder="Enter your employee id"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            label="First name"
            name="first_name"
            placeholder="Enter your first name"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
          />

          <FormInputField
            control={form.control}
            label="Last name"
            name="last_name"
            placeholder="Enter your last name"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            readOnly={isUpdate}
            endAddon={
              isUpdate && <img src={`${ASSET_PATH}/icons/lock_icon.svg`}></img>
            }
          />

          <FormInputField
            type="tel"
            control={form.control}
            label="Phone number"
            name="mobile_number"
            placeholder="Enter your phone number"
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            renderInput={(field) => (
              <PhoneInput
                international
                defaultCountry="IN"
                onBlur={field.onBlur}
                value={form.getValues("mobile_number") ?? ""}
                className="border-silver-gray placeholder:text-slate-whisper rounded-[0.375rem] border px-2.5 py-[7px] text-sm font-medium text-black"
                numberInputProps={{
                  className: `border-none outline-none focus-visible:ring-0`,
                }}
                onChange={field.onChange}
                placeholder="Enter your mobile number"
              />
            )}
          />
        </div>

        <SelectDropdown<MemberFormValues, CostCenterItem>
          control={form.control}
          name="cost_center"
          label="Cost Center"
          value={costCenterSearch}
          options={costCenters}
          getLabel={(option) => `${option.code}`}
          getValue={(option) => `${option.id}`}
          isLoading={isCostCentersLoading}
          onInputChange={(value) => handleCostCenterSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          placeholderText="Select cost center"
        />

        <SelectDropdown<MemberFormValues, DepartmentItem>
          control={form.control}
          name="department"
          label="Department"
          value={departmentSearch}
          options={departments}
          getLabel={(option) => `${option.name}`}
          getValue={(option) => `${option.id}`}
          isLoading={isDepartmentsLoading}
          onInputChange={(value) => handleDepartmentSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          placeholderText="Select department"
        />

        <SelectDropdown<MemberFormValues, EmployeeSummary>
          control={form.control}
          name="reporting_manager"
          label="Reporting manager"
          value={reportingManagerSearch}
          options={managers ?? []}
          getLabel={(option) => `${option.first_name} ${option.last_name}`}
          getValue={(option) => `${option.id}`}
          isLoading={isManagersFetching}
          onInputChange={(value) => handleReportingManagerSearch(value)}
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
          placeholderText="Select reporting manager"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectDropdown<MemberFormValues, GradeItem>
            control={form.control}
            name="grade"
            label="Grade"
            value={gradeSearch}
            options={grades?.data ?? []}
            getLabel={(option) => `${option.name}`}
            getValue={(option) => `${option.id}`}
            isLoading={isGradesFetching}
            onInputChange={(value) => handleGradeSearch(value)}
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            placeholderText="Select grade"
          />
          <SelectDropdown<MemberFormValues, RoleDetails>
            control={form.control}
            name="role"
            label="Role"
            isSearchable={false}
            options={roles ?? []}
            getLabel={(option) => `${option.name}`}
            getValue={(option) => `${option.id}`}
            isLoading={isRolesFetching}
            labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
            fieldClassName="gap-2"
            placeholderText="Select role"
          />
        </div>
        <div className="border-cloud-silver bg-gray-goose flex items-center gap-3.5 rounded-[0.75rem] border px-5 py-4">
          <img
            src={`${ASSET_PATH}/icons/warning.svg`}
            className="size-5"
            alt="icon"
          />
          <p className="text-sm leading-[160%] font-semibold tracking-[-1%] text-black">
            Assign the role and grade manually. These settings will define the
            member's access and limits.
          </p>
        </div>
      </form>
    </ConfigureSheet>
  );
};

export default MemberForm;
