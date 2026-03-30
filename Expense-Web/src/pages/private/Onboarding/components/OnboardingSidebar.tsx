import { TabsList } from "@/components/ui/tabs";
import { onboardingSteps } from "../helpers/constants/onboarding";
import { Progress } from "@/components/ui/progress";
import type { RootState } from "@/state-management/store";
import { useAppSelector } from "@/state-management/hook";
import StepTrigger from "./StepTrigger";

const OnboardingSidebar = () => {
  const { activeTab } = useAppSelector((state: RootState) => state.onboarding);

  const currentStepIndex = onboardingSteps.findIndex((s) => s.id === activeTab);

  const progress = ((currentStepIndex + 1) / onboardingSteps.length) * 100;

  return (
    <aside className="bg-pastel-iris hidden h-full w-full max-w-75 flex-col px-7.5 py-5 md:flex">
      <img
        src="assets/icons/z-logo-transparent.svg"
        alt="z logo"
        className="w-8.5 object-contain"
      />
      <TabsList className="scrollbar-thin my-3 flex h-full w-full flex-col justify-start gap-2 overflow-y-auto rounded-none bg-transparent p-0 shadow-none">
        {onboardingSteps.map((step, index) => (
          <StepTrigger
            key={step.id}
            step={step}
            index={index}
            activeTab={activeTab}
            currentStepIndex={currentStepIndex}
          />
        ))}
      </TabsList>
      <div className="space-y-2.5">
        <Progress
          value={progress}
          className="bg-petal-bloom h-2"
          indicatorClassName="[background-image:var(--gradient-primary)]"
        />
        <p className="text-slate-charcoal text-sm leading-[140%] font-medium tracking-[-1%]">
          Step {currentStepIndex + 1}/{onboardingSteps.length}{" "}
          {onboardingSteps[currentStepIndex]?.label}
        </p>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;
