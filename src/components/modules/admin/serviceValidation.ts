import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.instanceof(File).optional().or(z.string().optional()),
  description: z.string().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.instanceof(File).optional().or(z.string().optional()),
  description: z.string().optional(),
});

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
