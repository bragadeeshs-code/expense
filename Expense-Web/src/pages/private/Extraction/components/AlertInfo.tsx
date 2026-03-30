import { Alert, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertInfoProps = {
  message: string;
  className?: string;
};

const AlertInfo: React.FC<AlertInfoProps> = ({ message, className = "" }) => {
  return (
    <Alert
      className={cn(
        "border-azure-blue bg-frost-white text-electric-indigo flex border [&>svg]:translate-y-0",
        className,
      )}
    >
      <Info className="h-4" />
      <AlertTitle className="line-clamp-none text-[13px] font-medium">
        {message}
      </AlertTitle>
    </Alert>
  );
};

export default AlertInfo;
