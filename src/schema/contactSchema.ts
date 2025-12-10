import { z } from "zod";

export const contactSchema = z.object({
	id: z.string().optional(),
	fullName: z.string().min(1, "Full Name is required"),
	email: z.string().email("Invalid email address"),
	whatsappNumber: z.string().min(1, "WhatsApp Number is required"),
	serviceRequired: z.string().min(1, "Service Required is required"),
	projectBudget: z.string().min(1, "Project Budget is required"),
	projectDescription: z.string().min(1, "Project Description is required"),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type Contact = z.infer<typeof contactSchema>;
