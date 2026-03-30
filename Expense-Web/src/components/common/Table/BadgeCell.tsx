import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeCellProps {
  text: string;
  className?: string;
}
const BadgeCell: React.FC<BadgeCellProps> = ({ text, className }) => {
  return (
    <Badge
      className={cn(
        "border-cloud-silver bg-athens-gray max-h-6 min-w-12.5 gap-0 rounded-md px-1.5 py-3 text-[0.625rem] leading-[100%] font-medium tracking-[0%] text-black",
        className,
      )}
    >
      {text}
    </Badge>
  );
};

export default BadgeCell;
