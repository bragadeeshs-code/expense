import type { ExpenseData } from "@/pages/private/ExpenseView/types/expense-view.types";
import type { ConfidenceRatedValue } from "@/types/document-response.types";
import { categoryOptions, modeOptions } from "../../data/data";
import { DEFAULT_SELECT_FIELD_VALUE } from "../../helpers/constants/extraction";

export const getValue = (
  obj: ExpenseData,
  path: string,
): ConfidenceRatedValue => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
};

export const setValue = (obj: ExpenseData, path: string, newValue: string) => {
  const keys = path.split(".");
  const last = keys.pop()!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = keys.reduce((acc: any, key) => acc?.[key], obj);
  if (!ref || !ref[last]) return;
  ref[last].value = newValue;
};

export const pickCategory = (category: string) =>
  categoryOptions.find((categoryOption) => categoryOption.value === category) ??
  DEFAULT_SELECT_FIELD_VALUE;

export const pickMode = (subCategory: string) =>
  modeOptions.find((modeOption) => modeOption.value === subCategory) ??
  DEFAULT_SELECT_FIELD_VALUE;
