import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface NavbarState {
  isNavOpen: boolean;
}

const initialState: NavbarState = {
  isNavOpen: false,
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setIsNavOpen(state, action: PayloadAction<boolean>) {
      state.isNavOpen = action.payload;
    },
  },
});

export const { setIsNavOpen } = navbarSlice.actions;

export default navbarSlice.reducer;
