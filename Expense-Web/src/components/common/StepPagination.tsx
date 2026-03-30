import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepPaginationProps {
  className?: string;
  previousButtonClassName?: string;
  nextButtonClassName?: string;
  isPreviousButtonDisabled?: boolean;
  isNextButtonDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const StepPagination: React.FC<StepPaginationProps> = ({
  className,
  previousButtonClassName,
  nextButtonClassName,
  isPreviousButtonDisabled = false,
  isNextButtonDisabled = false,
  onNext = () => {},
  onPrevious = () => {},
}) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "border-vivid-violet text-vivid-violet hover:bg-frosted-lavender hover:text-vivid-violet size-6 rounded-full",
          previousButtonClassName,
        )}
        disabled={isPreviousButtonDisabled}
        onClick={onPrevious}
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "border-vivid-violet text-vivid-violet hover:bg-frosted-lavender hover:text-vivid-violet size-6 rounded-full",
          nextButtonClassName,
        )}
        disabled={isNextButtonDisabled}
        onClick={onNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default StepPagination;
