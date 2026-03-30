import type { SortingState } from "@tanstack/react-table";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  PER_PAGE,
  REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
} from "@/helpers/constants/common";
import type { ReimbursementListFilters } from "@/types/common.types";
import type { ReimbursementColumnFilters } from "@/types/expense.types";

const initialState: ReimbursementListFilters = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
  columnFilters: REIMBURSEMENT_COLUMN_FILTERS_DEFAULT_VALUE,
  sorting: [],
};

export const userDashboardReimbursementListControllerSlice = createSlice({
  name: "userDashboardReimbursementListController",
  initialState,
  reducers: {
    setSearchTextFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (state.page !== 1) state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setColumnFilters(state, action: PayloadAction<ReimbursementColumnFilters>) {
      state.columnFilters = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
      state.page = 1;
    },
    setSorting(state, action: PayloadAction<SortingState>) {
      state.sorting = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setSearchTextFilter,
  setPage,
  setPerPage,
  setSorting,
  setColumnFilters,
} = userDashboardReimbursementListControllerSlice.actions;
export default userDashboardReimbursementListControllerSlice.reducer;
