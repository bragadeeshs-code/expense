export enum COMPANY {
  COMPANY_ASSETS = "company_assets",
  COST_CENTERS = "cost_centers",
  DEPARTMENTS = "departments",
  GRADES_POLICIES = "grades_policies",
  ROLES_ACCESS = "roles_access",
}

export const CompanyTabs: TabItem<COMPANY>[] = [
  {
    label: "Assets",
    value: COMPANY.COMPANY_ASSETS,
  },
  {
    label: "Cost centers",
    value: COMPANY.COST_CENTERS,
  },
  {
    label: "Departments",
    value: COMPANY.DEPARTMENTS,
  },
  {
    label: "Grades & policies",
    value: COMPANY.GRADES_POLICIES,
  },
  {
    label: "Roles & access",
    value: COMPANY.ROLES_ACCESS,
  },
];
