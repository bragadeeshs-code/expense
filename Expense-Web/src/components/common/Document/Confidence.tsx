import { cn, getConfidenceColor } from "@/lib/utils";

type ConfidenceProps = {
  value: number;
  className?: string;
  showConfidenceText?: boolean;
};

const Confidence: React.FC<ConfidenceProps> = ({
  value,
  className,
  showConfidenceText = false,
}) => {
  return (
    <div
      className={cn(
        "w-fit rounded-full px-2 py-px text-xs font-medium",
        getConfidenceColor(value),
        className,
      )}
    >
      {value}%{showConfidenceText && " Confidence"}
    </div>
  );
};

export default Confidence;
