import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../state-management/feature/financeExpensesListSlice";

import DataTableLayout from "@/components/common/Table/DataTableLayout";
import useFinanceExpensesList from "../helpers/hooks/useFinanceExpensesList";
import getFinanceExpenseColumns from "../helpers/tableColumns/FinanceExpenseColumns";
import type { ListFilters } from "@/types/common.types";
import type { FinanceExpense } from "../helpers/types/finance-dashboard.types";

const FinanceExpenseList = () => {
  const filters = useAppSelector(
    (state) => state.financeExpensesListController,
  );
  const { isFinanceExpensesListLoading, financeExpensesList, pagination } =
    useFinanceExpensesList(filters);

  const navigate = useNavigate();

  const columns = getFinanceExpenseColumns({
    onView: (expense) => {
      navigate(`${expense.user_expense_id}`);
    },
  });

  const dispatch = useAppDispatch();

  return (
    <DataTableLayout<FinanceExpense, ListFilters>
      className="my-3"
      title="All Expenses"
      isLoading={isFinanceExpensesListLoading}
      search={filters.search}
      onSearch={(search) => {
        dispatch(setSearchTextFilter(search));
      }}
      tableProps={{
        columns,
        pagination: pagination,
        data: financeExpensesList,
        isLoading: isFinanceExpensesListLoading,
        emptyState: "no-document",
        loadingMessage: "Loading expenses",
        onPrevious: () => dispatch(setPage(filters.page - 1)),
        onNext: () => dispatch(setPage(filters.page + 1)),
        handlePerPage: (value) => dispatch(setPerPage(value)),
      }}
    />
  );
};

export default FinanceExpenseList;
