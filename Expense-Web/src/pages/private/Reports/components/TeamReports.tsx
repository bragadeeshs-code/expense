import { useNavigate } from "react-router";

import {
  ASSET_PATH,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/state-management/features/teamsExpensesSummaryListSlice";
import {
  pendingEmployeeChartConfig,
  teamApprovalTrendChartConfig,
} from "../helpers/constants/reports";

import StatusCard from "@/components/common/StatusCard";
import TeamExpenseList from "@/components/common/TeamExpenseList/TeamExpenseList";
import CategoryBreakdown from "./CategoryBreakdown";
import ReportBarChartCard from "./ReportBarChartCard";
import ReportTrendChartCard from "./ReportTrendChartCard";
import TopSpendersCard from "./TopSpendersCard";
import useTeamsExpenseList from "@/helpers/hooks/useTeamsExpenseList";
import useTeamReportsDashboard from "../helpers/hooks/useTeamReportsDashboard";
import {
  transformPendingEmployeeBreakdown,
  transformTeamApprovalTrend,
} from "../lib/reportsUtils";
import { formatCompactNumber } from "@/utils/numbers.utils";

interface TeamReportsProps {
  selectedYearMonth: string;
}

const TeamReports: React.FC<TeamReportsProps> = ({ selectedYearMonth }) => {
  const { teamReportsDashboardData, isTeamReportsDashboardStatsLoading } =
    useTeamReportsDashboard({ selectedYearMonth });
  const totalSpent = Number(teamReportsDashboardData?.total_spent ?? 0);
  const pendingApprovalsCount = Number(
    teamReportsDashboardData?.pending_approvals_count ?? 0,
  );
  const pendingAmount = Number(teamReportsDashboardData?.pending_amount ?? 0);
  const pendingEmployeeCount = Number(
    teamReportsDashboardData?.pending_employee_count ?? 0,
  );
  const averageQueueAgeDays = Number(
    teamReportsDashboardData?.average_queue_age_days ?? 0,
  );
  const oldestQueueAgeDays = Number(
    teamReportsDashboardData?.oldest_queue_age_days ?? 0,
  );
  const rejectionRate = Number(teamReportsDashboardData?.rejection_rate ?? 0);
  const dispatch = useAppDispatch();

  const { search, columnFilters, page, perPage } = useAppSelector(
    (state) => state.teamExpenseSummaryList,
  );
  const navigate = useNavigate();

  const {
    isTeamsExpenseListLoading,
    teamsExpensesData,
    teamsExpensesPagination,
  } = useTeamsExpenseList({
    page,
    perPage,
    search,
    columnFilters: { ...columnFilters, billMonth: selectedYearMonth },
  });

  return (
    <div className="scrollbar-thin flex h-full flex-col space-y-3 overflow-y-auto px-5 pb-5">
      <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-3">
        <StatusCard
          title="Team spend"
          imgUrl={`${ASSET_PATH}/icons/cash_icon.svg`}
          className="border-petal-bloom bg-lavender-mist"
          primaryValue={totalSpent}
        />
        <StatusCard
          title="Pending Approvals"
          imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={pendingApprovalsCount}
          isPrimaryValueAmount={false}
        />
        <StatusCard
          title="Pending amount"
          imgUrl={`${ASSET_PATH}/icons/cash_icon.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={pendingAmount}
        />
        <StatusCard
          title="Avg queue age"
          imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
          className="border-petal-bloom bg-lavender-mist"
          primaryValue={averageQueueAgeDays}
          isPrimaryValueAmount={false}
          valueDecimals={1}
          valueSuffix=" days"
        />
        <StatusCard
          title="Employees waiting"
          imgUrl={`${ASSET_PATH}/icons/invoice-outline.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={pendingEmployeeCount}
          isPrimaryValueAmount={false}
          description="oldest pending"
          descriptionValue={oldestQueueAgeDays}
          descriptionValueSuffix=" days"
          descriptionValueDecimals={1}
        />
        <StatusCard
          title="Rejection rate"
          imgUrl={`${ASSET_PATH}/icons/invoice-outline.svg`}
          className="border-petal-bloom bg-lavender-mist"
          primaryValue={rejectionRate}
          isPrimaryValueAmount={false}
          valueDecimals={1}
          valueSuffix="%"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
        <ReportTrendChartCard
          title="Approval activity this month"
          isLoading={isTeamReportsDashboardStatsLoading}
          data={transformTeamApprovalTrend(
            teamReportsDashboardData?.approval_activity_trend ?? [],
          )}
          chartConfig={teamApprovalTrendChartConfig}
          xAxisDataKey="label"
          series={[
            { dataKey: "approved_amount", type: "bar" },
            {
              dataKey: "rejected_amount",
              type: "bar",
              color: "#F17C67",
            },
            {
              dataKey: "open_pending_count",
              type: "line",
              yAxisId: "right",
              color: "#2B6EF2",
              strokeWidth: 2.5,
            },
          ]}
          leftYAxisTickFormatter={(value: number) => formatCompactNumber(value)}
          rightYAxisTickFormatter={(value: number) => `${value}`}
        />
        <CategoryBreakdown
          categoryBreakdown={teamReportsDashboardData?.category_breakdown}
          isLoading={isTeamReportsDashboardStatsLoading}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
        <ReportBarChartCard
          title="Pending amount by employee"
          isLoading={isTeamReportsDashboardStatsLoading}
          data={transformPendingEmployeeBreakdown(
            teamReportsDashboardData?.pending_employee_breakdown ?? [],
          )}
          chartConfig={pendingEmployeeChartConfig}
          xAxisDataKey="employee"
          barDataKey="pending_amount"
          xAxisTickFormatter={(value) =>
            value.length > 12 ? `${value.slice(0, 12)}...` : value
          }
          yAxisTickFormatter={(value) => formatCompactNumber(value)}
          hideTooltipLabel={false}
        />
        <TopSpendersCard
          topSpenders={teamReportsDashboardData?.top_spenders}
          isLoading={isTeamReportsDashboardStatsLoading}
        />
      </div>
      <div>
        <TeamExpenseList
          title="Team expenses summary"
          isLoading={isTeamsExpenseListLoading}
          data={teamsExpensesData}
          pagination={teamsExpensesPagination}
          search={search}
          onSearch={(value) => dispatch(setSearchTextFilter(value))}
          onPrevious={() => dispatch(setPage(teamsExpensesPagination.page - 1))}
          onNext={() => dispatch(setPage(teamsExpensesPagination.page + 1))}
          onPerPageChange={(value) => dispatch(setPerPage(value))}
          loadingMessage="Loading expenses"
          paginationLabel="expenses"
          onRowClick={(row) => navigate(`${row.user_expense_id}`)}
          getTableRowClassName={() => "cursor-pointer"}
          columnFilters={columnFilters}
          onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
          onResetFilters={() => {
            dispatch(
              setColumnFilters(REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE),
            );
          }}
        />
      </div>
    </div>
  );
};

export default TeamReports;
