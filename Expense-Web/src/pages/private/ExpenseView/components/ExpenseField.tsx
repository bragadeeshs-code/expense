import { cn } from "@/lib/utils";

interface ExpenseFieldProps {
  label: string;
  value: string | number | boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const ExpenseField: React.FC<ExpenseFieldProps> = ({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "text-cool-silver text-slate-whisper text-xs leading-[100%] font-semibold tracking-[0%]",
          labelClassName,
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          "py-2 text-sm leading-[100%] font-medium tracking-[0%] text-black",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default ExpenseField;
