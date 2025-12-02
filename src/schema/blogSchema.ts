import { z } from "zod";

// Blog status enum
export type BlogStatus = "draft" | "published" | "archived";

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
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional().default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;

