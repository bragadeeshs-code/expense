import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import TruncatedTextWithTooltip from "../TruncatedTextWithTooltip";

interface MaskedTableCellProps {
  value: string;
  className?: string;
}

const MaskedTableCell: React.FC<MaskedTableCellProps> = ({
  value,
  className,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div
      className={cn("group flex w-37 items-center justify-between", className)}
    >
      <TruncatedTextWithTooltip text={isVisible ? value : "**********"} />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => setIsVisible((prev) => !prev)}
        title={isVisible ? "Hide" : "Show"}
      >
        {isVisible ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
};

export default MaskedTableCell;
