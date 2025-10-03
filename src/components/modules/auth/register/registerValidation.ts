import { z } from "zod";

export const createClientSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  client: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  }),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
