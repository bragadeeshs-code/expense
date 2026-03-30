import z from "zod";

import {
  ACCOMMODATION_TYPE_ENUM,
  FLIGHT_CLASS_ENUM,
  TRAIN_CLASS_ENUM,
} from "@/helpers/constants/common";

export const extractionFormSchema = z
  .object({
    customer_id: z.string(),
    project: z
      .object({
        id: z.number(),
        code: z.string(),
      })
      .nullable(),
    trip: z
      .object({
        id: z.number(),
        destination: z.string(),
      })
      .nullable(),
    so_number: z.string(),
    category: z.object({
      name: z.string(),
      value: z.string(),
    }),
    flight_class: z
      .object({
        label: z.string(),
        value: z.enum(FLIGHT_CLASS_ENUM),
      })
      .nullable(),
    train_class: z
      .object({
        label: z.string(),
        value: z.enum(TRAIN_CLASS_ENUM),
      })
      .nullable(),
    accommodation_type: z
      .object({
        label: z.string(),
        value: z.enum(ACCOMMODATION_TYPE_ENUM),
      })
      .nullable(),
    mode: z.object({
      name: z.string(),
      value: z.string(),
    }),
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasProject = !!data.project;
    const hasTrip = !!data.trip;

    if ((hasProject && hasTrip) || (!hasProject && !hasTrip)) {
      ctx.addIssue({
        path: ["project"],
        message: "Select either project ID or trip ID",
        code: z.ZodIssueCode.custom,
      });

      ctx.addIssue({
        path: ["trip"],
        message: "Select either trip ID or project ID",
        code: z.ZodIssueCode.custom,
      });
    }

    const isTrainClass =
      data.category?.value === "travel" && data.mode?.value === "train";

    if (isTrainClass) {
      if (!data.train_class) {
        ctx.addIssue({
          path: ["train_class"],
          message: "Train class is required",
          code: z.ZodIssueCode.custom,
        });
      }
      return;
    }

    const isFlightClass =
      data.category?.value === "travel" &&
      (data.mode?.value === "flight_invoice" ||
        data.mode?.value === "flight_receipt");

    if (isFlightClass) {
      if (!data.flight_class) {
        ctx.addIssue({
          path: ["flight_class"],
          message: "Flight class is required",
          code: z.ZodIssueCode.custom,
        });
      }
      return;
    }

    const isAccommodationType = data.category?.value == "hotel_accommodation";

    if (isAccommodationType) {
      if (!data.accommodation_type) {
        ctx.addIssue({
          path: ["accommodation_type"],
          message: "Accommodation type is required",
          code: z.ZodIssueCode.custom,
        });
      }
      return;
    }
  });

export const reimbursementLimitFormSchema = z.object({
  notes: z.string(),
});

export type ReimbursementLimitFormValues = z.infer<
  typeof reimbursementLimitFormSchema
>;
