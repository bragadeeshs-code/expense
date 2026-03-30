import z from "zod";

import { ALPHABETS_AND_SPACES_REGEX } from "@/helpers/constants/regex-patterns";

export const mileageExpenseSchema = z
  .object({
    customer_name: z
      .string()
      .trim()
      .min(3, "Customer name must be at least 3 characters")
      .max(50, "Customer name must be at most 50 characters")
      .regex(
        ALPHABETS_AND_SPACES_REGEX,
        "Customer name must contain only alphabets",
      ),

    project: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable(),

    from_date: z.date().nullable().optional(),

    to_date: z.date().nullable().optional(),

    from_location: z
      .object({
        lat: z.number(),
        lng: z.number(),
        name: z.string(),
      })
      .nullable(),

    to_location: z
      .object({
        lat: z.number(),
        lng: z.number(),
        name: z.string(),
      })
      .nullable(),

    vehicle_type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),

    vehicle: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),

    distance: z
      .number()
      .min(1, "Choose valid locations, distance must be calculated"),
    amount: z.number().min(0, "Amount must be calculated"),
    duration_seconds: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!data.project) {
      ctx.addIssue({
        path: ["project"],
        message: "Project is required",
        code: "custom",
      });
    }

    if (!data.from_date) {
      ctx.addIssue({
        path: ["from_date"],
        message: "From date is required",
        code: "custom",
      });
    }

    if (!data.to_date) {
      ctx.addIssue({
        path: ["to_date"],
        message: "To date is required",
        code: "custom",
      });
    }

    if (!data.from_location) {
      ctx.addIssue({
        path: ["from_location"],
        message: "Starting location is required",
        code: "custom",
      });
    }

    if (!data.to_location) {
      ctx.addIssue({
        path: ["to_location"],
        message: "Ending location is required",
        code: "custom",
      });
    }

    if (!data.vehicle_type) {
      ctx.addIssue({
        path: ["vehicle_type"],
        message: "Vehicle type is required",
        code: "custom",
      });
    }

    if (!data.vehicle) {
      ctx.addIssue({
        path: ["vehicle"],
        message: "Vehicle is required",
        code: "custom",
      });
    }

    if (data.from_date && data.to_date && data.to_date < data.from_date) {
      ctx.addIssue({
        path: ["to_date"],
        message: "To date cannot be before from date",
        code: "custom",
      });
    }
  });

export type MileageExpenseFormValues = z.infer<typeof mileageExpenseSchema>;
