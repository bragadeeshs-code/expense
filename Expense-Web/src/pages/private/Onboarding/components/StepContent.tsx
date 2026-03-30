import { TabsContent } from "@/components/ui/tabs";
import { onboardingStepContents } from "../helpers/constants/onboarding";

const StepContent = () => {
  return (
    <main className="h-full">
      {onboardingStepContents.map((onboardingStepContent) => {
        const StepComponent = onboardingStepContent.content;

        return (
          <TabsContent
            key={onboardingStepContent.step}
            value={onboardingStepContent.step}
            className="h-full"
          >
            <StepComponent />
          </TabsContent>
        );
      })}
    </main>
  );
};

export default StepContent;
