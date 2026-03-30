import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  PER_PAGE,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import type {
  ReimbursementColumnFilters,
  TeamsExpensesListFilters,
} from "@/types/expense.types";

const initialState: TeamsExpensesListFilters = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
  columnFilters: REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
};

export const teamsExpensesSummaryListSlice = createSlice({
  name: "teamsExpensesSummaryList",
  initialState,
  reducers: {
    setSearchTextFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (state.page !== 1) state.page = 1;
    },
    setColumnFilters(state, action: PayloadAction<ReimbursementColumnFilters>) {
      state.columnFilters = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
      state.page = 1;
    },
  },
});

export const { setSearchTextFilter, setColumnFilters, setPage, setPerPage } =
  teamsExpensesSummaryListSlice.actions;
export default teamsExpensesSummaryListSlice.reducer;
