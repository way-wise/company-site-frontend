"use client";

import { taskService, TasksQueryParams } from "@/services/TaskService";
import { ApiResponse, Task } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { milestoneQueryKeys } from "./useMilestoneMutations";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const taskQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskQueryKeys.all, "list"] as const,
  list: (params: TasksQueryParams) =>
    [...taskQueryKeys.lists(), params] as const,
  details: () => [...taskQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const,
  stats: () => [...taskQueryKeys.all, "stats"] as const,
};

export const useTasks = (params: TasksQueryParams) => {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => taskService.getAllTasks(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: taskQueryKeys.stats(),
    queryFn: () => taskService.getTaskStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: {
      title: string;
      description?: string;
      milestoneId: string;
      creatorId?: string;
      status?: string;
      priority?: string;
      progress?: number;
      estimatedHours?: number;
    }) => taskService.createTask(taskData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Task created successfully");
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.stats() });
        // Also invalidate milestone queries to refresh milestone list
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to create task");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create task";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: Partial<Task>;
    }) => taskService.updateTask(taskId, taskData),

    // Optimistically update the cache before API call
    onMutate: async ({ taskId, taskData }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
      await queryClient.cancelQueries({
        queryKey: taskQueryKeys.detail(taskId),
      });

      // Snapshot the previous value for rollback
      const previousTasksLists = queryClient.getQueriesData({
        queryKey: taskQueryKeys.lists(),
      });
      const previousTaskDetail = queryClient.getQueryData(
        taskQueryKeys.detail(taskId)
      );

      // Optimistically update task lists
      queryClient.setQueriesData<
        ApiResponse<{
          meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
          result: Task[];
        }>
      >({ queryKey: taskQueryKeys.lists() }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            meta: old.data.meta,
            result: old.data.result.map((task) =>
              task.id === taskId ? { ...task, ...taskData } : task
            ),
          },
        };
      });

      // Optimistically update task detail
      queryClient.setQueryData<ApiResponse<Task>>(
        taskQueryKeys.detail(taskId),
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: { ...old.data, ...taskData } as Task,
          };
        }
      );

      // Return context with previous data for rollback
      return { previousTasksLists, previousTaskDetail };
    },

    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Task updated successfully");
        // Invalidate to ensure data consistency
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(variables.taskId),
        });
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.stats() });
        // Also invalidate milestone queries to refresh milestone list
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to update task");
      }
    },

    onError: (error: Error, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousTasksLists) {
        context.previousTasksLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousTaskDetail) {
        queryClient.setQueryData(
          taskQueryKeys.detail(variables.taskId),
          context.previousTaskDetail
        );
      }

      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update task";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Task deleted successfully");
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.stats() });
        // Also invalidate milestone queries to refresh milestone list
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to delete task");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete task";
      toast.error(errorMessage);
    },
  });
};

export const useAssignEmployeesToTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      userProfileIds,
      roles,
    }: {
      taskId: string;
      userProfileIds: string[];
      roles?: string[];
    }) => taskService.assignEmployees(taskId, userProfileIds, roles),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Employees assigned successfully");
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(variables.taskId),
        });
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to assign employees");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to assign employees";
      toast.error(errorMessage);
    },
  });
};

export const useAddTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      taskService.addComment(taskId, content),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Comment added successfully");
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(variables.taskId),
        });
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to add comment";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateTaskProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, progress }: { taskId: string; progress: number }) =>
      taskService.updateProgress(taskId, progress),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Progress updated successfully");
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(variables.taskId),
        });
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to update progress");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update progress";
      toast.error(errorMessage);
    },
  });
};
