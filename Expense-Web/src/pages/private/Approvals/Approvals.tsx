import { Outlet, useNavigate, useParams } from "react-router";

import TeamExpenseList from "../../../components/common/TeamExpenseList/TeamExpenseList";
import useTeamsExpenseList from "../../../helpers/hooks/useTeamsExpenseList";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../TeamWorkspace/state-management/features/teamsExpensesListControllerSlice";
import AppHeader from "@/components/common/AppHeader";
import { REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/common";

const Approvals = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { search, columnFilters, page, perPage } = useAppSelector(
    (state) => state.teamsExpenseListController,
  );

  const {
    isTeamsExpenseListLoading,
    teamsExpensesData,
    teamsExpensesPagination,
  } = useTeamsExpenseList({ page, perPage, search, columnFilters });

  if (id) return <Outlet />;

  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Approvals"
        description="All your pending tasks, reviews, and financial approvals in one place."
      />
      <div className="mt-3.5 overflow-y-auto px-5 pb-5 @4xl:min-h-0 @4xl:flex-1">
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
    </section>
  );
};

export default Approvals;
