import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import { onboardingSteps } from "../helpers/constants/onboarding";
import { setActiveTab } from "../state-management/features/onboardingSlice";

const OnboardingFooter = () => {
  const navigate = useNavigate();
  const { activeTab } = useAppSelector((state: RootState) => state.onboarding);
  const dispatch = useAppDispatch();

  const currentStepIndex = onboardingSteps.findIndex(
    (step) => step.id === activeTab,
  );

  const isAtLastStep = currentStepIndex === onboardingSteps.length - 1;

  const handleBack = () => {
    if (currentStepIndex > 0)
      dispatch(setActiveTab(onboardingSteps[currentStepIndex - 1].id));
  };

  const navigateToDashboard = () => {
    navigate("/");
  };

  const handleNext = () => {
    if (isAtLastStep) {
      navigateToDashboard();
    } else {
      dispatch(setActiveTab(onboardingSteps[currentStepIndex + 1].id));
    }
  };
  return (
    <div className="flex items-end justify-between gap-2 px-5 pb-3 sm:pr-7.5 sm:pl-[5.438rem] md:pb-0">
      <Button
        type="button"
        variant="outline"
        className="border-cool-gray w-36 rounded-[8px] p-2 text-sm leading-6 font-medium tracking-[0%] text-black"
        disabled={currentStepIndex === 0}
        onClick={handleBack}
      >
        Back
      </Button>
      <div className="flex flex-col items-end gap-2 lg:flex-row">
        {!isAtLastStep && (
          <Button
            variant="outline"
            onClick={navigateToDashboard}
            className="border-vivid-violet hover:bg-frosted-lavender [background-image:var(--gradient-primary)] bg-clip-text text-sm leading-[100%] font-medium tracking-[0%] text-transparent hover:text-purple-500"
          >
            Skip to dashboard
          </Button>
        )}
        <Button
          type="button"
          className="w-36 rounded-[8px] [background-image:var(--gradient-primary)] text-sm leading-[100%] font-medium tracking-[0%] text-white"
          onClick={handleNext}
        >
          {currentStepIndex < onboardingSteps.length - 1
            ? "Continue"
            : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFooter;
