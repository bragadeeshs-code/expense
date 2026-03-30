import type { SortingState } from "@tanstack/react-table";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { PER_PAGE } from "@/helpers/constants/common";
import { MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE } from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import type {
  MileageColumnFilters,
  MileageExpenseListFilters,
  TravelExpenseStatusFilter,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

const initialState: MileageExpenseListFilters = {
  page: 1,
  search: "",
  perPage: PER_PAGE,
  status: "all",
  sorting: [],
  columnFilters: MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE,
};

export const mileageMyTravelListSlice = createSlice({
  name: "mileageMyTravelList",
  initialState,
  reducers: {
    setSearchTextFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (state.page !== 1) state.page = 1;
    },
    setStatusFilter(state, action: PayloadAction<TravelExpenseStatusFilter>) {
      state.status = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
      state.page = 1;
    },
    setSorting(state, action: PayloadAction<SortingState>) {
      state.sorting = action.payload;
      state.page = 1;
    },
    setColumnFilters(state, action: PayloadAction<MileageColumnFilters>) {
      state.columnFilters = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.columnFilters = MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE;
      state.page = 1;
    },
  },
});

export const {
  setSearchTextFilter,
  setStatusFilter,
  setPage,
  setPerPage,
  setSorting,
  setColumnFilters,
  resetFilters,
} = mileageMyTravelListSlice.actions;

export default mileageMyTravelListSlice.reducer;
