import { type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipWrapperProps {
  side?: "top" | "bottom" | "right" | "left";
  content: string;
  children: ReactNode;
  className?: string;
  applyAsChildAttribute?: boolean;
  buttonClassName?: string;
}
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  side = "top",
  content,
  children,
  className,
  applyAsChildAttribute = true,
  buttonClassName,
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn("rounded-full", buttonClassName)}
          asChild={applyAsChildAttribute}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
