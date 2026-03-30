import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WORKFLOW_PROGRESS_STATUS_ENUM } from "../helpers/constants/finance-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinanceExpenseWorkflowSteps } from "../lib/financeDashboardUtils";

interface WorkflowProgressProps {
  status: WORKFLOW_PROGRESS_STATUS_ENUM;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ status }) => {
  return (
    <Card className="border-porcelain shadow-card-soft gap-4 rounded-2xl">
      <CardHeader>
        <CardTitle className="font-medium text-black">
          Workflow Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          {getFinanceExpenseWorkflowSteps(status).map((step) => (
            <div
              key={step.label}
              className={cn(
                "border-primary flex flex-1 items-center gap-2 border-l-4 px-4 py-2 md:border-t-4 md:border-l-0 md:p-0 md:pt-4",
                step.isCompleted || step.isActive
                  ? "border-primary text-primary"
                  : "border-gray-200 text-gray-500",
              )}
            >
              {step.isCompleted && <Check className="h-4 w-4" />}
              <p className="text-sm font-medium">{step.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowProgress;
