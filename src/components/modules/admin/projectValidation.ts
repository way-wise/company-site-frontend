import { z } from "zod";

// Project Schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  userProfileId: z.string().min(1, "User profile is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

// Milestone Schemas
export const createMilestoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "ONGOING", "COMPLETED", "REVIEW", "APPROVED", "REJECTED"])
    .optional(),
  projectId: z.string().min(1, "Project is required"),
});

export const updateMilestoneSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "ONGOING", "COMPLETED", "REVIEW", "APPROVED", "REJECTED"])
    .optional(),
});

export type CreateMilestoneFormData = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneFormData = z.infer<typeof updateMilestoneSchema>;

// Task Schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  milestoneId: z.string().min(1, "Milestone is required"),
  creatorId: z.string().optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  estimatedHours: z.number().positive().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  estimatedHours: z.number().positive().optional(),
});

export const addCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type AddCommentFormData = z.infer<typeof addCommentSchema>;
