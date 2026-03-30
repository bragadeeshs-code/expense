import { statusConfig } from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import TooltipWrapper from "../TooltipWrapper";
import type { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";
import { cn } from "@/lib/utils";

interface ApprovalStatusBadgeProps {
  status: ApprovalStatusEnum;
}

const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({
  status,
}) => {
  const cfg = statusConfig[status];

  const StatusIcon = cfg.icon;

  return (
    <TooltipWrapper content={cfg.label}>
      <div
        className={cn(
          "relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white",
          cfg.color,
        )}
      >
        <StatusIcon className="h-2 w-2" />
      </div>
    </TooltipWrapper>
  );
};

export default ApprovalStatusBadge;
