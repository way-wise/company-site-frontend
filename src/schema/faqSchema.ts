import { z } from "zod";

export interface Faq {
	id: string;
	question: string;
	answer: string;
	category: string;
	order: number;
	isShow: boolean;
	createdAt: string;
	updatedAt: string;
}

export const createFaqSchema = z.object({
	question: z.string().min(1, "Question is required"),
	answer: z.string().min(1, "Answer is required"),
	category: z.string().min(1, "Category is required"),
	order: z.coerce.number().int().nonnegative().default(0),
	isShow: z.boolean().default(true),
});

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
