import type { EmployeeColumnFilters } from "@/types/employees.types";
import { EMPLOYEE_STATUS_ENUM } from "./common";

export const EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE: EmployeeColumnFilters = {
  status: [],
  costCenters: [],
  departments: [],
  grades: [],
  roles: [],
};

export const STATUS_FILTER = [
  {
    label: "Active",
    value: EMPLOYEE_STATUS_ENUM.ACTIVE,
  },
  {
    label: "Invited",
    value: EMPLOYEE_STATUS_ENUM.INVITED,
  },
];
