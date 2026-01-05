"use client";

import { liveProjectService, LiveProjectsQueryParams } from "@/services/LiveProjectService";
import { LiveProject } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Type for validation error from API
interface ValidationError {
  code: string;
  values?: unknown[];
  path: string[];
  message: string;
}

// Type for API error responses
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string | ValidationError[];
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
    staleTime: 0, // Always refetch when invalidated to ensure fresh data
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

// Helper function to format validation errors
export const formatValidationErrors = (errors: ValidationError[]): {
  fieldErrors: Record<string, string>;
  summary: string;
} => {
  const fieldErrors: Record<string, string> = {};
  const errorMessages: string[] = [];

  errors.forEach((error) => {
    // Extract field name from path (e.g., ["body", "projectType"] -> "projectType")
    const fieldName = error.path[error.path.length - 1];
    
    // Format the error message to be more user-friendly
    let friendlyMessage = error.message;
    
    // Make messages more readable
    if (error.message.includes("expected one of")) {
      // Extract the valid options from the message
      const match = error.message.match(/expected one of "([^"]+)"/);
      if (match) {
        const options = match[1].split("|").map(opt => opt.trim());
        friendlyMessage = `Please select one of: ${options.join(", ")}`;
      }
    }
    
    // Convert field names to more readable labels
    const fieldLabels: Record<string, string> = {
      projectName: "Project Name",
      projectType: "Project Type",
      projectStatus: "Project Status",
      clientName: "Client Name",
      clientLocation: "Client Location",
      projectBudget: "Project Budget",
      hourlyRate: "Hourly Rate",
      paidAmount: "Paid Amount",
      assignedMembers: "Assigned Members",
      nextActions: "Next Actions",
    };
    
    const fieldLabel = fieldLabels[fieldName] || fieldName;
    fieldErrors[fieldName] = friendlyMessage;
    errorMessages.push(`${fieldLabel}: ${friendlyMessage}`);
  });

  // Create a user-friendly summary for toast
  let summary: string;
  if (errorMessages.length === 0) {
    summary = "Please check the form for errors";
  } else if (errorMessages.length === 1) {
    summary = errorMessages[0];
  } else {
    // For multiple errors, show a concise summary
    const fieldNames = errors.map(err => {
      const fieldName = err.path[err.path.length - 1];
      const fieldLabels: Record<string, string> = {
        projectType: "Project Type",
        projectStatus: "Project Status",
        clientName: "Client Name",
        clientLocation: "Client Location",
        projectBudget: "Project Budget",
        hourlyRate: "Hourly Rate",
        paidAmount: "Paid Amount",
        assignedMembers: "Assigned Members",
        nextActions: "Next Actions",
      };
      return fieldLabels[fieldName] || fieldName;
    });
    summary = `Please fix errors in: ${fieldNames.join(", ")}`;
  }

  return { fieldErrors, summary };
};

// Hook to create live project
export const useCreateLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (liveProjectData: {
      projectName: string;
      clientName: string;
      clientLocation?: string | null;
      projectType: "FIXED" | "HOURLY" | "MONTHLY" | "CUSTOM";
      projectBudget?: number;
      hourlyRate?: number;
      paidAmount?: number;
      dueAmount?: number;
      assignedMembers: string; // API expects comma-separated string
      projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
      deadline?: string;
      progress?: number;
      dailyNotes?: Array<{ note: string; createdAt: string; userId: string; userName: string; type?: "note" | "action" }>;
      nextActions?: string;
    }) => liveProjectService.createLiveProject(liveProjectData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Live project created successfully");
        // Invalidate all list queries (with any params) to ensure the list refreshes
        queryClient.invalidateQueries({ 
          queryKey: liveProjectQueryKeys.lists(),
          refetchType: 'active' // Only refetch active queries
        });
        queryClient.invalidateQueries({ queryKey: liveProjectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data;
      
      // Check if it's a validation error array
      if (Array.isArray(errorData?.error)) {
        const { summary } = formatValidationErrors(errorData.error as ValidationError[]);
        toast.error(summary);
      } else {
        const errorMessage =
          errorData?.message ||
          (typeof errorData?.error === "string" ? errorData.error : undefined) ||
          error.message ||
          "Failed to create live project";
        toast.error(errorMessage);
      }
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
        // Invalidate all list queries (with any params) to ensure the list refreshes
        queryClient.invalidateQueries({ 
          queryKey: liveProjectQueryKeys.lists(),
          refetchType: 'active' // Only refetch active queries
        });
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
      const errorData = apiError.response?.data;
      
      // Check if it's a validation error array
      if (Array.isArray(errorData?.error)) {
        const { summary } = formatValidationErrors(errorData.error as ValidationError[]);
        toast.error(summary);
      } else {
        const errorMessage =
          errorData?.message ||
          (typeof errorData?.error === "string" ? errorData.error : undefined) ||
          error.message ||
          "Failed to update live project";
        toast.error(errorMessage);
      }
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

