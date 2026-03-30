import { useState } from "react";
import { format } from "date-fns";

import { Switch } from "@/components/ui/switch";
import { alerts } from "../../AdminDashboard/helpers/constants/admin-dashboard";
import { transformSpendingOverview } from "../lib/managerDashboardUtils";
import { COST_CENTER_OVERVIEW_MOCK } from "../../UserDashboard/helpers/constants/dashboard";
import { getProjectOverviewColumns } from "../helpers/tableColumns/ProjectOverviewColumns";
import { getCostCenterOverviewColumns } from "../helpers/tableColumns/CostCenterOverviewColumns";
import { combinedSpendingOverviewChartConfig } from "@/helpers/constants/common";

import Alerts from "@/components/common/AlertsList/Alerts";
import AreaChartCard from "@/components/common/AreaChartCard";
import useManagerDashboard from "../helpers/hooks/useManagerDashboard";
import ManagerDashboardStats from "./ManagerDashboardStats";
import ManagerDashboardOverviewTable from "./ManagerDashboardOverviewTable";
import { formatCompactNumber } from "@/utils/numbers.utils";

interface ManagerDashboardProps {
  selectedYearMonth: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  selectedYearMonth,
}) => {
  const [isCombinedSpendingMyExpenseOn, setIsCombinedSpendingMyExpenseOn] =
    useState<boolean>(true);

  const { managerDashboardData, isManagerDashboardLoading } =
    useManagerDashboard({
      selectedYearMonth,
    });
  const combinedSpendingOverviewData = isCombinedSpendingMyExpenseOn
    ? managerDashboardData?.manager_daily_spent
    : managerDashboardData?.team_members_daily_spent;

  const combinedSpendingOverviewChartData = transformSpendingOverview(
    combinedSpendingOverviewData,
  );

  return (
    <div className="scrollbar-thin space-y-3 overflow-y-auto px-5 py-4">
      <div className="flex flex-col gap-3 @3xl:max-h-140 @3xl:flex-row">
        <div className="flex flex-col gap-3 @3xl:flex-3">
          <ManagerDashboardStats
            activeProjects={managerDashboardData?.active_projects}
            totalApprovedExpensesAmount={Number(
              managerDashboardData?.total_approved_expenses_amount,
            )}
            totalPendingExpenses={managerDashboardData?.total_pending_expenses}
          />
          <AreaChartCard
            cardClassName="flex-1 min-h-0"
            isLoading={isManagerDashboardLoading}
            cardContentClassName="flex-1 min-h-0"
            cardTitle="Combined spending overview"
            chartData={combinedSpendingOverviewChartData}
            chartConfig={combinedSpendingOverviewChartConfig}
            xAxisDataKey="day"
            chartAreaDataKey="expense"
            cardTitleClassName="font-bold"
            yAxisTickFormatter={(value: number) => formatCompactNumber(value)}
            xAxisTickFormatter={(value: Date) => format(value, "dd MMM")}
          >
            <div className="flex items-center justify-end gap-2 text-sm @2xl:mt-3">
              <p>My expense</p>
              <Switch
                checked={isCombinedSpendingMyExpenseOn}
                onCheckedChange={setIsCombinedSpendingMyExpenseOn}
                className="cursor-pointer"
              />
              <p>Team expense</p>
            </div>
          </AreaChartCard>
        </div>
        <Alerts
          title="Alerts"
          description="Here's a list of alerts"
          alerts={alerts}
          className="@3xl:flex-1"
        />
      </div>
      <div className="flex flex-col gap-3 @3xl:flex-row">
        <ManagerDashboardOverviewTable
          title="Project Overview"
          tableData={managerDashboardData?.projects_table ?? []}
          columns={getProjectOverviewColumns()}
          isManagerDashboardLoading={isManagerDashboardLoading}
          loadingMessage="Loading project overview..."
          emptyState="no-project-overviews"
          paginationLabel="projects"
        />
        <ManagerDashboardOverviewTable
          title="Cost Center Overview"
          tableData={COST_CENTER_OVERVIEW_MOCK ?? []}
          columns={getCostCenterOverviewColumns()}
          isManagerDashboardLoading={isManagerDashboardLoading}
          loadingMessage="Loading cost center overview..."
          emptyState="no-cost-center-overviews"
          paginationLabel="cost centers"
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
