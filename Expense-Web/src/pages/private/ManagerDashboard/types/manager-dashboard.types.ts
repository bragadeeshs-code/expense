export interface ProjectOverview {
  name: string;
  total_budget: string;
  total_spent: string;
}

export interface ManagerDashboardStats {
  active_projects: number;
  total_approved_expenses_amount: string;
  total_pending_expenses: number;
  manager_daily_spent: Record<string, string>;
  team_members_daily_spent: Record<string, string>;
  projects_table: ProjectOverview[];
  cost_centers_table: CostCenterOverview[];
}

export interface CostCenterOverview {
  code: string;
  allocated: string;
  used: string;
  balance: string;
}
