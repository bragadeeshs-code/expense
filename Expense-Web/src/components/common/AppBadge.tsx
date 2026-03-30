import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EMPLOYEE_STATUS_ENUM } from "@/helpers/constants/common";
import { ApprovalStatusEnum } from "@/pages/private/Extraction/helpers/constants/extraction";
import { TRIP_STATUS_ENUM } from "@/pages/private/Trip/helpers/constants/trips";

interface AppBadgeProps extends VariantProps<typeof appBadgeVariants> {
  children: React.ReactNode;
  className?: string;
  showLoaderOnly?: boolean;
}

const PENDING_STYLE = "font-medium bg-slate-gray text-white border-none";
const APPROVED_STYLE = "bg-kelly-green text-white border-none font-medium";
const REJECTED_STYLE =
  "font-medium bg-cherry-red text-white border-none font-medium";

const appBadgeVariants = cva(
  "rounded-full text-xs leading-[100%] tracking-[0%] py-1 px-2.5",
  {
    variants: {
      type: {
        BASIC: "border-sky-mist bg-cloud-white rounded-md py-0.5 text-xs",
        Uploaded: "bg-royal-blue text-white border-none font-medium",
        Extracting: "font-medium bg-honey text-white border-none",
        Extracted: "font-medium bg-royal-blue text-white border-none",
        Pending: PENDING_STYLE,
        Approved: APPROVED_STYLE,
        Rejected: REJECTED_STYLE,
        [EMPLOYEE_STATUS_ENUM.ACTIVE]:
          "text-forest-fern bg-mint-frost rounded-md border-none text-[10px]",
        [EMPLOYEE_STATUS_ENUM.INVITED]:
          "text-dark-mustard-yellow bg-light-golden-yellow rounded-md border-none text-[10px]",
        PROJECT_CODE:
          "border-pale-purple bg-iced-lavender rounded-md py-0.5 text-xs",
        [ApprovalStatusEnum.PENDING]: PENDING_STYLE,
        [ApprovalStatusEnum.APPROVED]: APPROVED_STYLE,
        [ApprovalStatusEnum.REJECTED]: REJECTED_STYLE,
        [TRIP_STATUS_ENUM.APPROVED]: APPROVED_STYLE,
        [TRIP_STATUS_ENUM.REJECTED]: REJECTED_STYLE,
        [TRIP_STATUS_ENUM.SUBMITTED]: PENDING_STYLE,
      },
    },
  },
);

const AppBadge: React.FC<AppBadgeProps> = ({ type, children, className }) => {
  return (
    <Badge
      variant="outline"
      className={cn(appBadgeVariants({ type }), className)}
    >
      {children}
    </Badge>
  );
};

export default AppBadge;
