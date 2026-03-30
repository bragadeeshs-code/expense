import { cn } from "@/lib/utils";
import type { Step } from "../types/onboarding.types";
import { ASSET_PATH } from "@/helpers/constants/common";
import { TabsTrigger } from "@/components/ui/tabs";

interface StepTriggerProps {
  step: Step;
  index: number;
  activeTab: string;
  currentStepIndex: number;
}

const StepTrigger: React.FC<StepTriggerProps> = ({
  step,
  index,
  activeTab,
  currentStepIndex,
}) => {
  const isCompleted = currentStepIndex > index;
  const isActive = activeTab === step.id;

  return (
    <TabsTrigger
      key={step.id}
      value={step.id}
      className={cn(
        "border-b-cloud-silver hover:bg-violet-haze relative flex h-auto w-full flex-none cursor-pointer gap-3 rounded-none border-b-[0.5px] px-3 py-2 text-left text-sm font-medium shadow-none",
        "data-[state=active]:bg-petal-bloom data-[state=active]:shadow-none",
        "data-[state=active]:before:absolute data-[state=active]:before:top-0 data-[state=active]:before:left-0 data-[state=active]:before:h-full data-[state=active]:before:w-[3px] data-[state=active]:before:[background-image:var(--gradient-primary)] data-[state=active]:before:content-['']",
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {isActive && (
          <img
            src={`${ASSET_PATH}/icons/unchecked-circle-outline.svg`}
            alt="Checkmark Icon"
            className="h-5 w-5"
          />
        )}
        {isCompleted && (
          <img
            src={`${ASSET_PATH}/icons/checked-gradient.svg`}
            alt="Checkmark Icon"
            className="h-5 w-5"
          />
        )}

        {!isActive && !isCompleted && (
          <span
            className={cn(
              "border-cool-silver flex h-[0.938rem] w-[0.938rem] items-center justify-center rounded-full border",
              isCompleted &&
                "border-none [background-image:var(--gradient-primary)]",
            )}
          ></span>
        )}
      </span>
      <span
        className={cn(
          "text-slate-whisper w-full text-sm leading-snug font-semibold tracking-[-1%] wrap-break-word whitespace-normal",
          (isActive || isCompleted) &&
            "[background-image:var(--gradient-primary)] bg-clip-text text-transparent",
        )}
      >
        {step.label}
      </span>
    </TabsTrigger>
  );
};

export default StepTrigger;
