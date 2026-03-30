import type { RoleEnum } from "@/helpers/constants/common";

export interface MeResponse {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: RoleEnum;
  grade: string;
  permissions: string[];
  cost_center: string | null;
  department: string | null;
  viewRole: RoleEnum;
}

export interface UserInfo {
  name: string;
  email: string;
  code: string;
}
