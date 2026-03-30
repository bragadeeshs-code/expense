import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { onboardingSteps } from "../helpers/constants/onboarding";
import { cn } from "@/lib/utils";
import type { RootState } from "@/state-management/store";
import { useAppSelector } from "@/state-management/hook";

const OnboardingTabs = () => {
  const { activeTab } = useAppSelector((state: RootState) => state.onboarding);
  const currentStepIndex = onboardingSteps.findIndex((s) => s.id === activeTab);

  return (
    <TabsList className="bg-background flex w-full justify-start space-x-2 overflow-x-auto px-5 py-10 md:hidden">
      {onboardingSteps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <TabsTrigger
            key={step.id}
            value={step.id}
            className="flex flex-col space-x-1 border-none p-0 text-xs"
          >
            <div
              className={cn(
                "flex size-6 rounded-full border font-medium",
                isCompleted
                  ? "border-none"
                  : isActive
                    ? "border-primary text-(--gradient-primary)"
                    : "border-lavender-gray text-muted-foreground",
              )}
            >
              {isCompleted ? (
                <img
                  src="assets/icons/checked-gradient.svg"
                  alt="done"
                  className="size-6"
                />
              ) : (
                <div className="size-6 content-center">{index + 1}</div>
              )}
            </div>
            <p
              className={cn(
                isActive
                  ? "[background-image:var(--gradient-primary)] bg-clip-text font-medium text-transparent"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </p>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default OnboardingTabs;
