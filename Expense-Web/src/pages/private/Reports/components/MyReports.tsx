import { useNavigate } from "react-router";
import {
  ASSET_PATH,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import StatusCard from "../../../../components/common/StatusCard";
import CategoryBreakdown from "./CategoryBreakdown";
import ReimbursementsList from "@/components/common/ReimbursementsList/ReimbursementsList";
import useReimbursementList from "../../../../helpers/hooks/useReimbursementList";
import useMyReportsDashboard from "../helpers/hooks/useMyReportsDashboard";
import type { Reimbursement } from "@/types/common.types";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import { userExpenseTrendChartConfig } from "../helpers/constants/reports";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
  setColumnFilters,
  setSorting,
} from "../state-management/features/myExpenseReportListSlice";

import ReportTrendChartCard from "./ReportTrendChartCard";
import { transformUserExpenseTrend } from "../lib/reportsUtils";
import { formatCompactNumber } from "@/utils/numbers.utils";

interface MyReportsProps {
  selectedYearMonth: string;
}

const MyReports: React.FC<MyReportsProps> = ({ selectedYearMonth }) => {
  const { myReportsDashboardData, isMyReportsDashboardStatsLoading } =
    useMyReportsDashboard({ selectedYearMonth });
  const approvedCount = Number(myReportsDashboardData?.approved_count ?? 0);
  const approvedReimbursementTotal = Number(
    myReportsDashboardData?.approved_reimbursement_total ?? 0,
  );
  const totalClaimCount = Number(
    myReportsDashboardData?.total_claim_count ?? 0,
  );
  const totalClaimAmount = Number(
    myReportsDashboardData?.total_claim_amount ?? 0,
  );
  const pendingCount = Number(myReportsDashboardData?.pending_count ?? 0);
  const pendingAmount = Number(myReportsDashboardData?.pending_amount ?? 0);
  const rejectedCount = Number(myReportsDashboardData?.rejected_count ?? 0);
  const rejectedAmount = Number(myReportsDashboardData?.rejected_amount ?? 0);

  const { columnFilters, search, page, perPage, sorting } = useAppSelector(
    (state) => state.myExpenseReportList,
  );
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { isFetching, reimbursements, pagination } = useReimbursementList({
    page,
    perPage,
    search,
    columnFilters: { ...columnFilters, billMonth: selectedYearMonth },
    sorting,
  });

  const handleSearch = (searchQuery: string) =>
    dispatch(setSearchTextFilter(searchQuery));

  const handleRowClick = (row: Reimbursement) => {
    navigate(`${row.id}`);
  };

  return (
    <div className="scrollbar-thin flex h-full flex-col space-y-3 overflow-y-auto px-5 pb-5">
      <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-4">
        <StatusCard
          title="Total claims"
          imgUrl={`${ASSET_PATH}/icons/invoice-outline.svg`}
          className="border-petal-bloom bg-lavender-mist"
          primaryValue={totalClaimAmount}
          description="submitted claims"
          descriptionValue={totalClaimCount}
        />
        <StatusCard
          title="In approval stage"
          imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={pendingAmount}
          description="pending claims"
          descriptionValue={pendingCount}
        />
        <StatusCard
          title="Rejected claims"
          imgUrl={`${ASSET_PATH}/icons/alarm-clock.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={rejectedAmount}
          description="rejected claims"
          descriptionValue={rejectedCount}
        />
        <StatusCard
          title="Paid status"
          imgUrl={`${ASSET_PATH}/icons/checkmark-badge.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          primaryValue={approvedReimbursementTotal}
          description="approved claims"
          descriptionValue={approvedCount}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
        <ReportTrendChartCard
          isLoading={isMyReportsDashboardStatsLoading}
          title="Expense activity this month"
          data={transformUserExpenseTrend(
            myReportsDashboardData?.expense_trend ?? [],
          )}
          chartConfig={userExpenseTrendChartConfig}
          xAxisDataKey="label"
          series={[
            { dataKey: "approved_amount", type: "bar" },
            { dataKey: "pending_amount", type: "bar" },
            {
              dataKey: "cumulative_amount",
              type: "line",
              color: "#2B6EF2",
              strokeWidth: 2.5,
            },
          ]}
          leftYAxisTickFormatter={(value: number) => formatCompactNumber(value)}
        />
        <CategoryBreakdown
          categoryBreakdown={myReportsDashboardData?.category_breakdown}
          isLoading={isMyReportsDashboardStatsLoading}
        />
      </div>
      <div>
        <ReimbursementsList
          title="My expense report"
          isFetching={isFetching}
          reimbursements={reimbursements}
          pagination={pagination}
          search={search}
          onSearch={handleSearch}
          onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
          onResetFilters={() => {
            dispatch(
              setColumnFilters(REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE),
            );
          }}
          onPrevious={() => dispatch(setPage(pagination.page - 1))}
          onNext={() => dispatch(setPage(pagination.page + 1))}
          onPerPageChange={(value) => dispatch(setPerPage(value))}
          onRowClick={handleRowClick}
          loadingMessage="Loading my expense reports"
          columnFilters={columnFilters}
          sorting={sorting}
          onSortingChange={(sortingState) => dispatch(setSorting(sortingState))}
          shouldShowBillDateFilter={false}
          shouldShowApprovalStatusFilter={false}
        />
      </div>
    </div>
  );
};

export default MyReports;
