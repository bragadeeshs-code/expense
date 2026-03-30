import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isLoading?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  isLoading,
  className,
}) => (
  <Card
    className={cn(
      "bg-periwinkle-light-bg flex h-[140px] flex-col justify-between gap-0 rounded-[24px] border-none p-6 shadow-none",
      className,
    )}
  >
    <div className="flex items-start justify-between">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <div className="rounded-md p-1 text-gray-600">{icon}</div>
    </div>
    <div className="mt-auto">
      {isLoading ? (
        <Skeleton className="h-10 w-32 bg-purple-100" />
      ) : (
        <span className="text-[32px] leading-tight font-semibold text-gray-900">
          {value}
        </span>
      )}
    </div>
  </Card>
);

export default MetricCard;
