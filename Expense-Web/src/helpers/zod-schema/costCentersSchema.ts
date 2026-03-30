import { z } from "zod";

export const costCenterFormSchema = z.object({
  code: z.string().trim().nonempty({ message: "Cost center code is required" }),
});

export type CostCenterFormValues = z.infer<typeof costCenterFormSchema>;
