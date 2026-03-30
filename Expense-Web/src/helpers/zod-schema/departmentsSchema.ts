import { z } from "zod";

export const departmentsFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Name is required" }),
});

export type DepartmentsFormValues = z.infer<typeof departmentsFormSchema>;
