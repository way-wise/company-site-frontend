"use client";

import { projectService, ProjectsQueryParams } from "@/services/ProjectService";
import { Project } from "@/types";
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
export const projectQueryKeys = {
  all: ["projects"] as const,
  lists: () => [...projectQueryKeys.all, "list"] as const,
  list: (params: ProjectsQueryParams) =>
    [...projectQueryKeys.lists(), params] as const,
  details: () => [...projectQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
  stats: () => [...projectQueryKeys.all, "stats"] as const,
};

// Hook to get all projects
export const useProjects = (params: ProjectsQueryParams) => {
  return useQuery({
    queryKey: projectQueryKeys.list(params),
    queryFn: () => projectService.getAllProjects(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get project by ID
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get project statistics
export const useProjectStats = () => {
  return useQuery({
    queryKey: projectQueryKeys.stats(),
    queryFn: () => projectService.getProjectStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: {
      name: string;
      description?: string;
      status?: string;
      userProfileId: string;
    }) => projectService.createProject(projectData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Project created successfully");
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create project");
      }
    },
    onError: (error: Error) => {
      console.error("Create project error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create project";
      toast.error(errorMessage);
    },
  });
};

// Hook to update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      projectData,
    }: {
      projectId: string;
      projectData: Partial<Project>;
    }) => projectService.updateProject(projectId, projectData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Project updated successfully");
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.detail(variables.projectId),
        });
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update project");
      }
    },
    onError: (error: Error) => {
      console.error("Update project error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update project";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Project deleted successfully");
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    },
    onError: (error: Error) => {
      console.error("Delete project error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete project";
      toast.error(errorMessage);
    },
  });
};



