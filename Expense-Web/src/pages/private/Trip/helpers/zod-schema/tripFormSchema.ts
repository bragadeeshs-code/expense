import { z } from "zod";

import { MODE_OF_TRAVEL_ENUM } from "../constants/trips";

export const tripFormSchema = z
  .object({
    description: z.string().trim().nullish(),
    project: z
      .object({
        id: z.number(),
        code: z.string(),
      })
      .nullable(),
    destination: z
      .string()
      .trim()
      .nonempty({ message: "Destination is required" }),
    start_date: z.date().nullable(),
    end_date: z.date().nullable(),
    hotel_accommodation_needed: z.boolean(),
    mode_of_travel: z
      .object({ label: z.string(), value: z.enum(MODE_OF_TRAVEL_ENUM) })
      .nullable(),
    vehicle_needed: z.boolean(),
    advance_needed: z.boolean(),
    advance_amount: z
      .number()
      .min(1, { message: "Advance amount must be a positive value" })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.project) {
      ctx.addIssue({
        path: ["project"],
        message: "Project is required",
        code: "custom",
      });
    }
    if (!data.mode_of_travel) {
      ctx.addIssue({
        path: ["mode_of_travel"],
        message: "Mode of travel is required",
        code: "custom",
      });
    }
    if (!data.start_date) {
      ctx.addIssue({
        path: ["start_date"],
        message: "Start date is required",
        code: "custom",
      });
    }
    if (!data.end_date) {
      ctx.addIssue({
        path: ["end_date"],
        message: "End date is required",
        code: "custom",
      });
    }
    if (data.start_date && data.end_date && data.start_date > data.end_date) {
      ctx.addIssue({
        path: ["end_date"],
        message: "End date must be on or after the start date.",
        code: "custom",
      });
    }
    if (data.advance_needed && !data.advance_amount) {
      ctx.addIssue({
        path: ["advance_amount"],
        message: "Advance amount is required",
        code: "custom",
      });
    }
  });

export type tripFormValues = z.infer<typeof tripFormSchema>;
