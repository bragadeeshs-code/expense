import z from "zod";

export const whatsAppConnectorForm = z.object({
  phone_number_id: z
    .string()
    .trim()
    .nonempty({ message: "Field cannot be empty" }),
  whatsapp_token: z
    .string()
    .trim()
    .nonempty({ message: "Token cannot be empty" }),
});

export type WhatsAppConnectorFormValues = z.infer<typeof whatsAppConnectorForm>;

export const generatorSetupFormSchema = z
  .object({
    generator_id: z.string().trim().min(1, "Generator Id is required"),
    generator_type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    make_and_model: z.string().trim().min(1, "Make & Model is required"),
    fuel_type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    operational_responsibility: z
      .object({
        id: z.number(),
        first_name: z.string(),
      })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.generator_type) {
      ctx.addIssue({
        path: ["generator_type"],
        message: "Generator type is required",
        code: "custom",
      });
    }
    if (!data.fuel_type) {
      ctx.addIssue({
        path: ["fuel_type"],
        message: "Fuel type is required",
        code: "custom",
      });
    }
    if (!data.operational_responsibility) {
      ctx.addIssue({
        path: ["operational_responsibility"],
        message: "Operational responsibility is required",
        code: "custom",
      });
    }
  });

export type GeneratorSetupFormValues = z.infer<typeof generatorSetupFormSchema>;

export const companyVehicleSetupFormSchema = z
  .object({
    vehicle_number: z.string().trim().min(1, "Vehicle number is required"),
    vehicle_type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    make_and_model: z.string().trim().min(1, "Make & Model is required"),
    fuel_type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    operational_responsibility: z
      .object({
        id: z.number(),
        first_name: z.string(),
      })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.vehicle_type) {
      ctx.addIssue({
        path: ["vehicle_type"],
        message: "Vehicle type is required",
        code: "custom",
      });
    }
    if (!data.fuel_type) {
      ctx.addIssue({
        path: ["fuel_type"],
        message: "Fuel type is required",
        code: "custom",
      });
    }
    if (!data.operational_responsibility) {
      ctx.addIssue({
        path: ["operational_responsibility"],
        message: "Operational responsibility is required",
        code: "custom",
      });
    }
  });

export type CompanyVehicleSetupFormValues = z.infer<
  typeof companyVehicleSetupFormSchema
>;
