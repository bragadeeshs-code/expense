import Alerts from "@/components/common/AlertsList/Alerts";
import QuickActions from "./QuickActions";
import CompanyAssetChart from "./CompanyAssetChart";
import IncompleteProfiles from "./IncompleteProfiles";
import AdminDashboardStats from "./AdminDashboardStats";
import useAdminDashboardData from "../helpers/hooks/useAdminDashboardData";

import { alerts } from "../helpers/constants/admin-dashboard";

const AdminDashboard: React.FC = () => {
  const { adminDashboardData } = useAdminDashboardData();

  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-2.5 px-5 pb-5 lg:@3xl:flex-row">
        <div className="flex flex-col gap-2.5 @lg:min-w-0 @lg:flex-1">
          <QuickActions />
          <AdminDashboardStats
            totalEmployees={adminDashboardData?.total_employees}
            totalProjects={adminDashboardData?.total_projects}
            totalAssets={adminDashboardData?.total_assets}
            totalConnections={adminDashboardData?.total_connections}
          />
          <div className="grid grid-cols-1 gap-3 lg:@3xl:grid-cols-[auto_1fr]">
            <CompanyAssetChart
              companyAssets={adminDashboardData?.company_assets}
            />
            <div className="space-y-3">
              <IncompleteProfiles
                pendingInvitations={adminDashboardData?.pending_invitations}
              />
              <Alerts
                title="Project setup status"
                alerts={alerts}
                className="max-h-fit lg:@3xl:max-h-[280px]"
              />
            </div>
          </div>
        </div>
        <div className="@3xl:max-h-178 lg:@3xl:w-1/3 lg:@4xl:w-1/4">
          <Alerts
            title="Alerts"
            description="Things that need attention:"
            alerts={alerts}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
