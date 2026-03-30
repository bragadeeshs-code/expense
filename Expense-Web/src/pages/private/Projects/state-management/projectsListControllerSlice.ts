import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { PROJECTS_LIST_PER_PAGE } from "@/helpers/constants/common";
import type { ProjectListFilters } from "@/types/common.types";

const initialState: ProjectListFilters = {
  page: 1,
  search: "",
  per_page: PROJECTS_LIST_PER_PAGE,
};

export const projectListControllerSlice = createSlice({
  name: "projectListController",
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
      state.per_page = action.payload;
      state.page = 1;
    },
  },
});

export const { setPage, setPerPage, setSearchTextFilter } =
  projectListControllerSlice.actions;

export default projectListControllerSlice.reducer;
