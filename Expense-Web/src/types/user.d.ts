type UserData = {
  id: number;
  email: string;
  transact?: boolean;
  expense?: boolean;
  expense_permissions?: string[];
  expense_organization_id?: number;
};
