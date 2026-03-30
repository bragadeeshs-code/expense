import type { EMPLOYEE_STATUS_ENUM } from "@/helpers/constants/common";
import type { ListFilters, Pagination, SelectOption } from "./common.types";
import type { CostCenterItem, CostCenterResponse } from "./cost-center.types";
import type { DepartmentItem, DepartmentResponse } from "./departments.types";
import type { GradeItem } from "./grades.types";

interface EmployeeBase {
  email: string;
  first_name: string;
  last_name: string;
}

export interface EmployeeItem extends EmployeeBase {
  code: string;
  id: number;
  mobile_number: string;
  organization_id: number;
  status: EMPLOYEE_STATUS_ENUM;
  grade: Grade;
  role: Role;
  reporting_manager: EmployeeSummary;
  cost_center: CostCenterItem;
  department: DepartmentItem;
}

export interface MemberRequestPayload extends EmployeeBase {
  code: string;
  grade_id: number;
  role_id: number;
  reporting_manager_id?: number;
  mobile_number?: string;
  cost_center_id?: number;
  department_id?: number;
}

export interface AddMemberResponse extends EmployeeBase {
  id: number;
  mobile_number: string;
  grade_id: number;
  organization_id: number;
  status: EMPLOYEE_STATUS_ENUM;
}

export interface EmployeeResponse extends Pagination {
  data: EmployeeItem[];
}

export interface EmployeeListFilters extends ListFilters {
  columnFilters?: EmployeeColumnFilters;
}

export interface DeleteEmployeeResponse extends EmployeeBase {
  id: number;
  grade_id: number;
  mobile_number: string;
}

export interface EmployeeSummary {
  id: number;
  first_name: string;
  last_name: string;
}

export type EmployeeOptions = EmployeeSummary[];

export interface EmployeeColumnFilters {
  status: SelectOption<EMPLOYEE_STATUS_ENUM>[];
  grades: GradeItem[];
  roles: RoleDetails[];
  costCenters: CostCenterResponse[];
  departments: DepartmentResponse[];
}
