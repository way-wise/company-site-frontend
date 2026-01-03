"use client";

import { liveProjectService, LiveProjectsQueryParams } from "@/services/LiveProjectService";
import { LiveProject } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Type for API error responses
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query keys for consistent caching
export const liveProjectQueryKeys = {
  all: ["live-projects"] as const,
  lists: () => [...liveProjectQueryKeys.all, "list"] as const,
  list: (params: LiveProjectsQueryParams) =>
    [...liveProjectQueryKeys.lists(), params] as const,
  details: () => [...liveProjectQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...liveProjectQueryKeys.details(), id] as const,
  stats: () => [...liveProjectQueryKeys.all, "stats"] as const,
};

// Hook to get all live projects
export const useLiveProjects = (params: LiveProjectsQueryParams) => {
  return useQuery({
    queryKey: liveProjectQueryKeys.list(params),
    queryFn: () => liveProjectService.getAllLiveProjects(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get live project by ID
export const useLiveProject = (liveProjectId: string) => {
  return useQuery({
    queryKey: liveProjectQueryKeys.detail(liveProjectId),
    queryFn: () => liveProjectService.getLiveProjectById(liveProjectId),
    enabled: !!liveProjectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get live project statistics
export const useLiveProjectStats = () => {
  return useQuery({
    queryKey: liveProjectQueryKeys.stats(),
    queryFn: () => liveProjectService.getLiveProjectStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to create live project
export const useCreateLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (liveProjectData: {
      clientName: string;
      clientLocation: string;
      projectType: "FIXED" | "HOURLY" | "MONTHLY" | "CUSTOM";
      projectBudget?: number;
      hourlyRate?: number;
      paidAmount?: number;
      assignedMembers: string[];
      projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
      dailyNotes?: Array<{ note: string; createdAt: string }>;
      nextActions?: string;
    }) => liveProjectService.createLiveProject(liveProjectData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Live project created successfully");
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create live project";
      toast.error(errorMessage);
    },
  });
};

// Hook to update live project
export const useUpdateLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      liveProjectId,
      liveProjectData,
    }: {
      liveProjectId: string;
      liveProjectData: Partial<LiveProject>;
    }) => liveProjectService.updateLiveProject(liveProjectId, liveProjectData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Live project updated successfully");
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: liveProjectQueryKeys.detail(variables.liveProjectId),
        });
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update live project";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete live project
export const useDeleteLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (liveProjectId: string) =>
      liveProjectService.deleteLiveProject(liveProjectId),
    onSuccess: (data, liveProjectId) => {
      if (data.success) {
        toast.success("Live project deleted successfully");
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.stats() });
        queryClient.removeQueries({ queryKey: liveProjectQueryKeys.detail(liveProjectId) });
      } else {
        toast.error(data.message || "Failed to delete live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete live project";
      toast.error(errorMessage);
    },
  });
};

