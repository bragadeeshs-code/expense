import React from "react";
import Avatar from "react-avatar";

import { cn } from "@/lib/utils";
import { statusConfig } from "../helpers/constants/expenseView";
import type { ApproverInfoItem } from "../types/expense-view.types";

import TooltipWrapper from "@/components/common/TooltipWrapper";

const ApproverInfo: React.FC<ApproverInfoItem> = ({
  status,
  first_name,
  approval_level,
}) => {
  const cfg = statusConfig[status as keyof typeof statusConfig];
  const StatusIcon = cfg.icon;

  return (
    <TooltipWrapper content={cfg.label}>
      <div className="group relative flex min-w-16 flex-col items-center gap-1.5 px-1.5">
        <div className="relative">
          <Avatar name={first_name} size="44" round={true} />
          <div
            className={cn(
              "absolute right-0 bottom-0 flex items-center justify-center rounded-full border-2 border-white p-0.5",
              cfg.color,
            )}
          >
            <StatusIcon className="h-1.5 w-1.5" />
          </div>
        </div>

        <p className="text-center text-xs leading-[100%] font-medium tracking-[-0.6%]">
          L{approval_level} approver
        </p>
      </div>
    </TooltipWrapper>
  );
};

export default ApproverInfo;
