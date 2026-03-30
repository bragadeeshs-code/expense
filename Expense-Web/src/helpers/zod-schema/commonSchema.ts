import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const memberFormSchema = z
  .object({
    code: z.string().trim().nonempty({ message: "Id is required" }),
    first_name: z
      .string()
      .trim()
      .nonempty({ message: "First name is required" })
      .min(3, { message: "Minimum 3 characters are required" })
      .max(30, { message: "Maximum 30 characters are allowed" }),
    last_name: z
      .string()
      .trim()
      .nonempty({ message: "Last name is required" })
      .max(30, { message: "Maximum 30 characters are allowed" }),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    mobile_number: z
      .string()
      .trim()
      .optional()
      .refine((value) => (value ? isValidPhoneNumber(value) : true), {
        message: "Please enter a valid mobile number",
      }),
    grade: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable(),
    role: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable(),
    reporting_manager: z
      .object({
        id: z.number(),
        first_name: z.string(),
      })
      .nullable(),
    cost_center: z
      .object({
        id: z.number(),
        code: z.string(),
      })
      .nullable()
      .optional(),
    department: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.grade) {
      ctx.addIssue({
        path: ["grade"],
        message: "Grade is required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.role) {
      ctx.addIssue({
        path: ["role"],
        message: "Role is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export const projectFormSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required"),

    description: z
      .string()
      .trim()
      .max(50, "Description must be at most 50 characters")
      .nullish(),

    code: z.string().trim().min(1, "Project code is required"),

    manager: z
      .object({
        id: z.number(),
        first_name: z.string(),
      })
      .nullable(),

    monthly_budget: z
      .number()
      .min(1, "Monthly budget must be a positive value"),

    total_budget: z.number().min(1, "Total budget must be a positive value"),

    members: z.array(
      z.object({
        id: z.number(),
        first_name: z.string(),
      }),
    ),

    approvers: z.array(
      z.object({
        approval_level: z.number(),
        approver: z
          .object({
            id: z.number(),
            first_name: z.string(),
          })
          .nullable(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.manager) {
      ctx.addIssue({
        path: ["manager"],
        message: "Project manager is required",
        code: "custom",
      });
    }
    if (data.monthly_budget > data.total_budget) {
      ctx.addIssue({
        path: ["monthly_budget"],
        message: "Monthly budget should not exceed the total budget",
        code: "custom",
      });
    }

    data.approvers.forEach((item, index) => {
      if (!item.approver) {
        ctx.addIssue({
          path: ["approvers", index, "approver"],
          message: "Approver is required",
          code: "custom",
        });
      }
    });
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
