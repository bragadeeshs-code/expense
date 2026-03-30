import { Progress } from "@/components/ui/progress";
import { formatToINR } from "@/lib/utils";

interface BudgetProgressProps {
  title: string;
  current: number;
  total: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  title,
  current,
  total,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-dark-charcoal line-clamp-1 text-xs leading-[150%] font-medium tracking-[-1%]">
          {title}
        </span>

        <span className="text-dark-charcoal text-xs font-medium">
          {formatToINR(current)} / {formatToINR(total)}
        </span>
      </div>
      <Progress
        value={(current / total) * 100}
        className="bg-primary/10"
        indicatorClassName="bg-primary/50"
      />
    </div>
  );
};

export default BudgetProgress;
