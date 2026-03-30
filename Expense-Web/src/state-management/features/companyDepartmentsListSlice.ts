import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { PER_PAGE } from "@/helpers/constants/common";
import type { ListFilters } from "@/types/common.types";

const initialState: ListFilters = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
};

export const companyDepartmentsListSlice = createSlice({
  name: "companyDepartmentsList",
  initialState,
  reducers: {
    setSearchTextFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (state.page !== 1) state.page = 1;
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

export const { setSearchTextFilter, setPage, setPerPage } =
  companyDepartmentsListSlice.actions;
export default companyDepartmentsListSlice.reducer;
