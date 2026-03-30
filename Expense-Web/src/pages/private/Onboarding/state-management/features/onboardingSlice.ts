import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ONBOARDING_STEP_ENUM } from "../../helpers/constants/onboarding";

interface OnboardingState {
  activeTab: string;
}

const initialState: OnboardingState = {
  activeTab: ONBOARDING_STEP_ENUM.CONNECT_DATA,
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = onboardingSlice.actions;

export default onboardingSlice.reducer;
