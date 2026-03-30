import { cn } from "@/lib/utils";
import AlertItem from "./AlertItem";
import { Card } from "@/components/ui/card";

interface AlertsProps {
  title: string;
  description?: string;
  alerts: AlertItem[];
  className?: string;
}

const Alerts: React.FC<AlertsProps> = ({
  title,
  description,
  alerts,
  className,
}) => {
  return (
    <Card
      className={cn(
        "shadow-ambient border-athens-gray gap-y-6 rounded-2xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 px-6">
        <h3 className="text-sm leading-[100%] font-bold tracking-[0%]">
          {title}
        </h3>
        {description && (
          <span className="text-ash-gray text-sm leading-[100%] font-medium tracking-[-1%]">
            {description}
          </span>
        )}
      </div>
      <div className="scrollbar-thin space-y-2 overflow-y-auto px-6">
        {alerts.map((alert, index) => (
          <AlertItem alert={alert} key={index} />
        ))}
      </div>
    </Card>
  );
};

export default Alerts;
