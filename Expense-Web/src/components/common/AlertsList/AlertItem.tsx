import { cn } from "@/lib/utils";

interface AlertItemProps {
  alert: AlertItem;
  className?: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, className }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[10px] border p-3 text-sm",
        className,
        alert.type === "warning"
          ? "bg-cotton-candy-haze border-muted-salmon"
          : "bg-moonlit-lavender border-orchid-milk",
      )}
    >
      <img src={alert.imgSrc} alt="icon" className="size-5" />
      <span>{alert.message}</span>
    </div>
  );
};

export default AlertItem;
