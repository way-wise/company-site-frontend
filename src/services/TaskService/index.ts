"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Task,
  TaskComment,
  TaskStats,
  TasksQueryParams,
} from "@/types";

export type { TasksQueryParams };

export const taskService = {
  // Get all tasks with pagination and search
  getAllTasks: async (
    params: TasksQueryParams
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number; totalPages: number };
      result: Task[];
    }>
  > => {
    const { page, limit, search, status, priority, milestoneId, creatorId } =
      params;
    let url = `/tasks?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (priority) {
      url += `&priority=${encodeURIComponent(priority)}`;
    }
    if (milestoneId) {
      url += `&milestoneId=${encodeURIComponent(milestoneId)}`;
    }
    if (creatorId) {
      url += `&creatorId=${encodeURIComponent(creatorId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId: string): Promise<ApiResponse<Task>> => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: {
    title: string;
    description?: string;
    milestoneId: string;
    creatorId?: string;
    status?: string;
    priority?: string;
    progress?: number;
    estimatedHours?: number;
  }): Promise<ApiResponse<Task>> => {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },

  // Update task
  updateTask: async (
    taskId: string,
    taskData: Partial<Task>
  ): Promise<ApiResponse<Task>> => {
    const response = await apiClient.patch(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Assign employees to task
  assignEmployees: async (
    taskId: string,
    userProfileIds: string[],
    roles?: string[]
  ): Promise<ApiResponse<Task>> => {
    const response = await apiClient.post(`/tasks/${taskId}/assign-employees`, {
      userProfileIds,
      roles,
    });
    return response.data;
  },

  // Add comment to task
  addComment: async (
    taskId: string,
    content: string
  ): Promise<ApiResponse<TaskComment>> => {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, {
      content,
    });
    return response.data;
  },

  // Update task progress
  updateProgress: async (
    taskId: string,
    progress: number
  ): Promise<ApiResponse<Task>> => {
    const response = await apiClient.patch(`/tasks/${taskId}/progress`, {
      progress,
    });
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (): Promise<ApiResponse<TaskStats>> => {
    const response = await apiClient.get("/tasks/stats");
    return response.data;
  },
};
