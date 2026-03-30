import { useNavigate } from "react-router";

import ReimbursementsList from "@/components/common/ReimbursementsList/ReimbursementsList";
import useReimbursementList from "@/helpers/hooks/useReimbursementList";

import type { Reimbursement } from "@/types/common.types";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

import {
  setPage,
  setSorting,
  setPerPage,
  setColumnFilters,
  setSearchTextFilter,
} from "@/state-management/features/reimbursementListControllerSlice";
import { REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/common";

const SubmittedReimbursementList = () => {
  const { columnFilters, search, page, perPage, sorting } = useAppSelector(
    (state) => state.reimbursementListController,
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
    navigate(`${row.user_expense_id}`);
  };

  return (
    <ReimbursementsList
      title="My reimbursements"
      isFetching={isFetching}
      reimbursements={reimbursements}
      pagination={pagination}
      search={search}
      onSearch={handleSearch}
      onPrevious={() => dispatch(setPage(pagination.page - 1))}
      onNext={() => dispatch(setPage(pagination.page + 1))}
      onPerPageChange={(value) => dispatch(setPerPage(value))}
      onRowClick={handleRowClick}
      loadingMessage="Loading reimbursements"
      columnFilters={columnFilters}
      sorting={sorting}
      onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
      onSortingChange={(sortingState) => dispatch(setSorting(sortingState))}
      onResetFilters={() => {
        dispatch(setColumnFilters(REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE));
      }}
      shouldShowApprovalStatusFilter={false}
      shouldShowSubCategoryFilter={false}
    />
  );
};

export default SubmittedReimbursementList;
