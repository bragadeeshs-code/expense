import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PER_PAGE } from "@/helpers/constants/common";
import type { CompanyAssetsListFilter } from "../../types/onboarding.types";

const initialState: CompanyAssetsListFilter = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
};

export const companyAssetsListControllerSlice = createSlice({
  name: "companyAssetsListController",
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
  companyAssetsListControllerSlice.actions;
export default companyAssetsListControllerSlice.reducer;
