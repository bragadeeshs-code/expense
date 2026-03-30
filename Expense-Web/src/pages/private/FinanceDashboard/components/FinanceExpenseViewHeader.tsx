import { Link } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { WORKFLOW_PROGRESS_STATUS_ENUM } from "../helpers/constants/finance-dashboard";
import AppBadge from "@/components/common/AppBadge";

interface FinanceExpenseViewHeaderProps {
  id: number;
  status: WORKFLOW_PROGRESS_STATUS_ENUM;
}

const FinanceExpenseViewHeader: React.FC<FinanceExpenseViewHeaderProps> = ({
  id,
  status,
}) => {
  return (
    <div className="space-y-3 px-5 py-4">
      <Breadcrumb className="text-ash-gray text-xs leading-[100%] font-medium tracking-[-0.2px]">
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Expense Details</h2>
        <AppBadge type={"BASIC"}>{status}</AppBadge>
      </div>
    </div>
  );
};

export default FinanceExpenseViewHeader;
