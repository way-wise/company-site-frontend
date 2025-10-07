import { z } from "zod";

export const createAdminSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  admin: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    contactNumber: z.string().optional(),
  }),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
