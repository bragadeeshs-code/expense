import z from "zod";

import { FLIGHT_CLASS_ENUM, TRAIN_CLASS_ENUM } from "../constants/common";

export const gradeFormSchema = z
  .object({
    name: z.string().trim().nonempty({ message: "Grade name is required" }),
    expense_max_daily_limit: z
      .number()
      .min(1, "Max Daily limit must be a positive value"),
    expense_max_monthly_limit: z
      .number()
      .min(1, "Max monthly must be a positive value"),
    auto_approval_threshold_type: z.object({
      label: z.string(),
      value: z.string(),
    }),
    flight_class_allowance: z.object({
      label: z.string(),
      value: z.enum(FLIGHT_CLASS_ENUM),
    }),
    train_class_allowance: z.object({
      label: z.string(),
      value: z.enum(TRAIN_CLASS_ENUM),
    }),
    domestic_limit: z
      .number()
      .min(1, "Domestic limit must be a positive value"),
    international_limit: z
      .number()
      .min(1, "International limit must be a positive value"),
    food_max_daily_limit: z
      .number()
      .min(1, "Food max daily limit must be a positive value"),
    car_mileage_rate: z
      .number()
      .min(1, "Car mileage rate must be a positive value"),
    bike_mileage_rate: z
      .number()
      .min(1, "Bike mileage rate must be a positive value"),
  })
  .refine(
    (data) => data.expense_max_daily_limit !== data.expense_max_monthly_limit,
    {
      message: "Max daily limit and Max monthly limit cannot be same",
      path: ["expense_max_daily_limit"],
    },
  )
  .refine(
    (data) => data.expense_max_daily_limit <= data.expense_max_monthly_limit,
    {
      message: "Max daily limit cannot be greater than max monthly limit",
      path: ["expense_max_daily_limit"],
    },
  );

export type GradeFormValues = z.infer<typeof gradeFormSchema>;

export const MEMBER_FORM_DEFAULT_VALUES = {
  code: "",
  email: "",
  first_name: "",
  last_name: "",
  mobile_number: "",
  grade: null,
  role: null,
  reporting_manager: null,
  cost_center: null,
  department: null,
};
