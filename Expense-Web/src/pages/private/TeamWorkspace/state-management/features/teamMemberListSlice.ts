import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PER_PAGE } from "@/helpers/constants/common";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";
import type {
  EmployeeColumnFilters,
  EmployeeListFilters,
} from "@/types/employees.types";

const initialState: EmployeeListFilters = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
  columnFilters: EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE,
};

export const teamMemberListSlice = createSlice({
  name: "teamMemberList",
  initialState,
  reducers: {
    setSearchTextFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (state.page !== 1) state.page = 1;
    },
    setColumnFilters(state, action: PayloadAction<EmployeeColumnFilters>) {
      state.columnFilters = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
  },
});

export const { setSearchTextFilter, setColumnFilters, setPage, setPerPage } =
  teamMemberListSlice.actions;

export default teamMemberListSlice.reducer;
