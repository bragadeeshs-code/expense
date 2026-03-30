import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  ASSET_PATH,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import StatusCard from "@/components/common/StatusCard";
import ReimbursementsList from "@/components/common/ReimbursementsList/ReimbursementsList";
import useReimbursementList from "@/helpers/hooks/useReimbursementList";
import { getDashboardData } from "@/services/dashboard.service";
import type { Reimbursement } from "@/types/common.types";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setSorting,
  setPerPage,
  setColumnFilters,
  setSearchTextFilter,
} from "../state-management/features/userDashboardReimbursementListControllerSlice";

const UserDashboard: React.FC = () => {
  const { data: dashboardData } = useQuery<DashboardStats>({
    queryKey: ["dashboard", "info"],
    queryFn: () => getDashboardData(),
    refetchOnWindowFocus: false,
  });

  const { columnFilters, search, page, perPage, sorting } = useAppSelector(
    (state) => state.userDashboardReimbursementListControllerSlice,
  );

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { isFetching, reimbursements, pagination } = useReimbursementList({
    page,
    perPage,
    search,
    columnFilters,
    sorting,
  });

  const handleSearch = (searchQuery: string) =>
    dispatch(setSearchTextFilter(searchQuery));

  const handleRowClick = (row: Reimbursement) => {
    navigate(`/${row.id}`);
  };

  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-2.5 px-5 pb-5 lg:@3xl:flex-row">
        <div className="flex flex-col gap-2.5 @lg:min-w-0 @lg:flex-1">
          <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-2">
            <StatusCard
              title="Total Approved"
              imgUrl={`${ASSET_PATH}/icons/checkmark-badge.svg`}
              className="border-petal-bloom bg-lavender-mist"
              description="reimbursements approved"
              primaryValue={dashboardData?.approved_amount_sum ?? 0}
              descriptionValue={dashboardData?.approved_count ?? 0}
            />
            <StatusCard
              title="Pending Reimbursements"
              imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
              className="border-petal-bloom bg-lilac-whisper"
              description="reimbursements awaiting approval"
              primaryValue={dashboardData?.pending_amount_sum ?? 0}
              descriptionValue={dashboardData?.pending_count ?? 0}
            />
          </div>
          <ReimbursementsList
            title="My reimbursements"
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
            loadingMessage="Loading reimbursements"
            columnFilters={columnFilters}
            sorting={sorting}
            onSortingChange={(sortingState) =>
              dispatch(setSorting(sortingState))
            }
          />
        </div>

        {/* <ExpenseChart /> */}
      </div>
    </div>
  );
};
export default UserDashboard;
