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
export const createMilestoneSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    cost: z.number().positive("Cost must be a positive number"),
    status: z.enum(["PENDING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
    projectId: z.string().min(1, "Project is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

export const updateMilestoneSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    cost: z.number().positive("Cost must be a positive number").optional(),
    status: z.enum(["PENDING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

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
    .default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  progress: z.number().min(0).max(100).default(0),
  estimatedHours: z.number().min(0).optional(),
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

// Live Project Schemas
export const createLiveProjectSchema = z
  .object({
    projectName: z.string().min(1, "Project name is required"),
    clientName: z.string().min(1, "Client name is required"),
    clientLocation: z.string().optional(),
    projectType: z.enum(["FIXED", "HOURLY", "MONTHLY", "CUSTOM"]),
    projectBudget: z.number().positive("Project budget must be a positive number").optional(),
    paidAmount: z.number().min(0, "Paid amount cannot be negative").optional(),
    dueAmount: z.number().min(0, "Due amount cannot be negative").optional(),
    // Accept both string and array (form stores as array, but we validate both)
    assignedMembers: z.union([
      z.string().min(1, "Assigned members are required"),
      z.array(z.string()).min(1, "At least one member is required"),
    ]),
    projectStatus: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional(),
    deadline: z.string().optional(), // ISO date string
    progress: z.number().min(0).max(100, "Progress must be between 0 and 100").optional(),
    dailyNotes: z.array(z.object({
      note: z.string(),
      createdAt: z.string(),
      userId: z.string(),
      userName: z.string(),
      type: z.enum(["note", "action"]).optional(),
    })).optional(),
    nextActions: z.string().optional(),
  })
  .refine(
    (data) => {
      // For non-hourly projects, projectBudget is required
      if (data.projectType !== "HOURLY") {
        return data.projectBudget !== undefined && data.projectBudget > 0;
      }
      // For HOURLY projects, budget/paid/due amounts are not required
      return true;
    },
    {
      message: "Project budget is required for non-hourly projects",
      path: ["projectBudget"],
    }
  );

export const updateLiveProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required").optional(),
  clientName: z.string().min(1, "Client name is required").optional(),
  clientLocation: z.string().optional(),
  projectType: z.enum(["FIXED", "HOURLY", "MONTHLY", "CUSTOM"]).optional(),
  projectBudget: z.number().positive("Project budget must be a positive number").optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative").optional(),
  dueAmount: z.number().min(0, "Due amount cannot be negative").optional(),
  assignedMembers: z.array(z.string()).optional(),
  projectStatus: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional(),
  deadline: z.string().optional(), // ISO date string
  progress: z.number().min(0).max(100, "Progress must be between 0 and 100").optional(),
  dailyNotes: z.array(z.object({
    note: z.string(),
    createdAt: z.string(),
    userId: z.string(),
    userName: z.string(),
    type: z.enum(["note", "action"]).optional(),
  })).optional(),
  nextActions: z.string().optional(),
});

export type CreateLiveProjectFormData = z.infer<typeof createLiveProjectSchema>;
export type UpdateLiveProjectFormData = z.infer<typeof updateLiveProjectSchema>;