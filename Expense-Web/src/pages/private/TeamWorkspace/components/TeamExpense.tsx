import {
  ASSET_PATH,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import TeamExpenseList from "../../../../components/common/TeamExpenseList/TeamExpenseList";
import useTeamWorkspaceDashboard from "../helpers/hooks/useTeamWorkspaceDashboard";
import useTeamsExpenseList from "../../../../helpers/hooks/useTeamsExpenseList";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../state-management/features/teamsExpensesListControllerSlice";
import StatusCard from "../../../../components/common/StatusCard";

const TeamExpense = () => {
  const { teamWorksSpaceDashboardData } = useTeamWorkspaceDashboard();
  const dispatch = useAppDispatch();

  const { search, columnFilters, page, perPage } = useAppSelector(
    (state) => state.teamsExpenseListController,
  );

  const {
    isTeamsExpenseListLoading,
    teamsExpensesData,
    teamsExpensesPagination,
  } = useTeamsExpenseList({ page, perPage, search, columnFilters });

  return (
    <div className="scrollbar-thin flex h-full flex-col space-y-2.5 overflow-y-auto px-5 pb-5">
      <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-3">
        <StatusCard
          title="Total Team Members"
          imgUrl={`${ASSET_PATH}/icons/multiple_user_icon.svg`}
          className="border-petal-bloom bg-lavender-mist"
          description="reimbursements approved"
          primaryValue={teamWorksSpaceDashboardData?.total_team_members ?? 0}
          descriptionValue={
            teamWorksSpaceDashboardData?.approved_expense_count ?? 0
          }
          isPrimaryValueAmount={false}
        />
        <StatusCard
          title="Total Spend"
          imgUrl={`${ASSET_PATH}/icons/cash_icon.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          description="reimbursements awaiting approval"
          primaryValue={teamWorksSpaceDashboardData?.approved_total_amount ?? 0}
          descriptionValue={
            teamWorksSpaceDashboardData?.pending_expense_count ?? 0
          }
        />
        <StatusCard
          title="Pending Approvals"
          imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
          className="border-petal-bloom bg-lilac-whisper"
          description="reimbursements awaiting approval"
          primaryValue={teamWorksSpaceDashboardData?.pending_total_amount ?? 0}
          descriptionValue={
            teamWorksSpaceDashboardData?.pending_expense_count ?? 0
          }
        />
      </div>
      <div>
        <TeamExpenseList
          title="List of teams expenses"
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

export default TeamExpense;
