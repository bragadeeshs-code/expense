import type { Pagination } from "./common.types";

export interface DepartmentBase {
  name: string;
}

export interface DepartmentsListResponse extends Pagination {
  data: DepartmentResponse[];
}

export interface DepartmentResponse extends DepartmentBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentDeleteResponse {
  id: number;
}
export interface DepartmentUpdateProps {
  id: number;
  data: DepartmentBase;
}

export interface DepartmentItem extends DepartmentBase {
  id: number;
}
