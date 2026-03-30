import { createSlice } from "@reduxjs/toolkit";
import type { SortingState } from "@tanstack/react-table";
import type { PayloadAction } from "@reduxjs/toolkit";

import { PER_PAGE } from "@/helpers/constants/common";

interface UploadedDocumentListControllerState {
  page: number;
  perPage: number;
  search: string;
  sorting: SortingState;
}

const initialState: UploadedDocumentListControllerState = {
  page: 1,
  perPage: PER_PAGE,
  search: "",
  sorting: [],
};

export const uploadedDocumentLisControllerSlice = createSlice({
  name: "uploadedDocumentLisController",
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
    setSorting(state, action: PayloadAction<SortingState>) {
      state.sorting = action.payload;
      state.page = 1;
    },
  },
});

export const { setSearchTextFilter, setPage, setPerPage, setSorting } =
  uploadedDocumentLisControllerSlice.actions;

export default uploadedDocumentLisControllerSlice.reducer;
