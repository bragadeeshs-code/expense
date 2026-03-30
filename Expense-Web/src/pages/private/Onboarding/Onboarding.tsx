import { useEffect } from "react";
import { setActiveTab } from "./state-management/features/onboardingSlice";
import type { RootState } from "@/state-management/store";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

import { cn } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ONBOARDING_STEP_ENUM } from "./helpers/constants/onboarding";

import StepContent from "./components/StepContent";
import OnboardingTabs from "./components/OnboardingTabs";
import OnboardingHeader from "./components/OnboardingHeader";
import OnboardingFooter from "./components/OnboardingFooter";
import OnboardingSidebar from "./components/OnboardingSidebar";

const Onboarding = () => {
  const { activeTab } = useAppSelector((state: RootState) => state.onboarding);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(setActiveTab(ONBOARDING_STEP_ENUM.CONNECT_DATA));
  }, [dispatch]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => dispatch(setActiveTab(value))}
      className="flex h-full w-full flex-row gap-0"
    >
      <OnboardingSidebar />
      <main className="flex h-full w-full flex-1 flex-col md:pt-5 md:pb-5">
        <OnboardingHeader />
        <OnboardingTabs />
        <div
          className={cn(
            "my-4 flex min-h-0 flex-1 flex-col",
            isMobile && "scrollbar-thin overflow-y-auto",
          )}
        >
          <div className="md:min-h-0 md:flex-1">
            <StepContent />
          </div>
        </div>
        <OnboardingFooter />
      </main>
    </Tabs>
  );
};

export default Onboarding;
