import { RoleEnum } from "@/helpers/constants/common";
import { hasAccess } from "@/lib/utils";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";

import UserDashboardLayout from "../UserDashboard/UserDashboardLayout";
import AdminDashboardLayout from "../AdminDashboard/AdminDashboardLayout";
import ManagerDashboardLayout from "../ManagerDashboard/ManagerDashboardLayout";
import FinanceDashboard from "../FinanceDashboard/FinanceDashboard";

const Dashboard = () => {
  const { data: user } = useCurrentuser();
  if (!user) return null;

  return (
    <>
      {hasAccess(user, [RoleEnum.ADMIN]) ? (
        <AdminDashboardLayout />
      ) : hasAccess(user, [RoleEnum.MANAGER]) ? (
        <ManagerDashboardLayout />
      ) : hasAccess(user, [RoleEnum.FINANCER]) ? (
        <FinanceDashboard />
      ) : (
        <UserDashboardLayout />
      )}
    </>
  );
};

export default Dashboard;
