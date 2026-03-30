import { DocumentStatus } from "@/helpers/constants/common";
import {
  SUPPORTED_CATEGORIES_FOR_OTHERS_TEMPLATE,
  SUPPORTED_SUB_CATEGORIES_FOR_OTHERS_TEMPLATE,
} from "../helpers/constants/expenseView";
import type { ExpenseDetails } from "../types/expense-view.types";

export const shouldShowExtractionFooter = (
  expense?: ExpenseDetails,
): boolean => {
  if (!expense) return false;

  const isExtracted = expense.status === DocumentStatus.EXTRACTED;

  const isOthers =
    SUPPORTED_CATEGORIES_FOR_OTHERS_TEMPLATE.includes(expense.category) ||
    (expense.sub_category &&
      SUPPORTED_SUB_CATEGORIES_FOR_OTHERS_TEMPLATE.includes(
        expense.sub_category,
      ));

  return isExtracted && !isOthers;
};
