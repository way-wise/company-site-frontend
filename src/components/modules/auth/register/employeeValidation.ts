import { z } from "zod";

export const createEmployeeSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  employee: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    gender: z.enum(["MALE", "FEMALE"]),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
