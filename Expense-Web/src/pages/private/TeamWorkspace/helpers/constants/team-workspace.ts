import { RoleEnum } from "@/helpers/constants/common";

export enum TEAM_WORKSPACE {
  EXPENSE = "expense",
  TEAM_MEMBERS = "team_members",
}

export const TeamWorkSpaceTabs: TabItem<TEAM_WORKSPACE>[] = [
  {
    label: "Expense",
    value: TEAM_WORKSPACE.EXPENSE,
    access: [RoleEnum.MANAGER],
  },
  {
    label: "Team members",
    value: TEAM_WORKSPACE.TEAM_MEMBERS,
    access: [RoleEnum.MANAGER],
  },
];

export const TEAM_WORKSPACE_DASHBOARD_API_QUERY_KEY =
  "team-workspace-dashboard";
