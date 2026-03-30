import {
  WORKFLOW_PROGRESS_LABEL,
  WORKFLOW_PROGRESS_STATUS_ENUM,
} from "../helpers/constants/finance-dashboard";
import type { FinanceExpenseWorkflowStep } from "../helpers/types/finance-dashboard.types";

export const getFinanceExpenseWorkflowSteps = (
  status: WORKFLOW_PROGRESS_STATUS_ENUM,
): FinanceExpenseWorkflowStep[] => {
  const steps = Object.values(WORKFLOW_PROGRESS_STATUS_ENUM);
  const filteredSteps = steps.filter((step) =>
    status === WORKFLOW_PROGRESS_STATUS_ENUM.REJECTED
      ? step !== WORKFLOW_PROGRESS_STATUS_ENUM.APPROVED
      : step !== WORKFLOW_PROGRESS_STATUS_ENUM.REJECTED,
  );
  const currentIndex = filteredSteps.indexOf(status);
  return filteredSteps.map((step, index) => ({
    label: WORKFLOW_PROGRESS_LABEL[step],
    isCompleted: index <= currentIndex,
    isActive: index <= currentIndex + 1,
  }));
};
