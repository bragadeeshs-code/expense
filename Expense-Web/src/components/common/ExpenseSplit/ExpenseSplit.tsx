import { cn } from "@/lib/utils";
import type { ExpenseDetailUser } from "@/pages/private/ExpenseView/types/expense-view.types";

import ExpenseBadge from "./ExpenseBadge";

interface ExpenseSplitProps {
  badges: ExpenseDetailUser[];
  currency: string;
  label?: string;
  className?: string;
}

const ExpenseSplit: React.FC<ExpenseSplitProps> = ({
  badges,
  label = "Expense split between:",
  currency,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 @2xl:flex-row @2xl:items-center",
        className,
      )}
    >
      <p className="text-slate-whisper text-xs leading-[100%] font-semibold tracking-[0%]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {badges.map((badge, index) => (
          <ExpenseBadge key={index} {...badge} currency={currency} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseSplit;
