import { z } from "zod";

// Blog status enum
export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Author type
export interface Author {
  id?: string;
  name?: string;
  email?: string;
}

// Blog type matching backend response
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: BlogStatus;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
  userProfile?: {
    id: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

// Create blog input schema
export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric with hyphens only"
    )
    .optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  tags: z.array(z.string()),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
