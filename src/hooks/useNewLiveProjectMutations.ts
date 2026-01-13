"use client";

import { newLiveProjectService, NewLiveProjectsQueryParams } from "@/services/NewLiveProjectService";
import { NewLiveProject, NewProjectAction, NewHourLog } from "@/types";
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
export const newLiveProjectQueryKeys = {
  all: ["new-live-projects"] as const,
  lists: () => [...newLiveProjectQueryKeys.all, "list"] as const,
  list: (params: NewLiveProjectsQueryParams) =>
    [...newLiveProjectQueryKeys.lists(), params] as const,
  details: () => [...newLiveProjectQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...newLiveProjectQueryKeys.details(), id] as const,
  actions: (id: string) => [...newLiveProjectQueryKeys.detail(id), "actions"] as const,
  hourLogs: (id: string) => [...newLiveProjectQueryKeys.detail(id), "hour-logs"] as const,
  stats: () => [...newLiveProjectQueryKeys.all, "stats"] as const,
};

// Hook to get all new live projects
export const useNewLiveProjects = (params: NewLiveProjectsQueryParams) => {
  return useQuery({
    queryKey: newLiveProjectQueryKeys.list(params),
    queryFn: () => newLiveProjectService.getAllNewLiveProjects(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

// Hook to get new live project by ID
export const useNewLiveProject = (projectId: string) => {
  return useQuery({
    queryKey: newLiveProjectQueryKeys.detail(projectId),
    queryFn: () => newLiveProjectService.getNewLiveProjectById(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get project actions
export const useProjectActions = (projectId: string) => {
  return useQuery({
    queryKey: newLiveProjectQueryKeys.actions(projectId),
    queryFn: () => newLiveProjectService.getProjectActions(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get hour logs
export const useHourLogs = (projectId: string) => {
  return useQuery({
    queryKey: newLiveProjectQueryKeys.hourLogs(projectId),
    queryFn: () => newLiveProjectService.getHourLogs(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get new live project statistics
export const useNewLiveProjectStats = () => {
  return useQuery({
    queryKey: newLiveProjectQueryKeys.stats(),
    queryFn: () => newLiveProjectService.getNewLiveProjectStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Helper function to format validation errors
export const formatNewLiveProjectValidationErrors = (errors: ValidationError[]): {
  fieldErrors: Record<string, string>;
  summary: string;
} => {
  const fieldErrors: Record<string, string> = {};
  const errorMessages: string[] = [];

  errors.forEach((error) => {
    const fieldName = error.path[error.path.length - 1];
    
    let friendlyMessage = error.message;
    
    if (error.message.includes("expected one of")) {
      const match = error.message.match(/expected one of "([^"]+)"/);
      if (match) {
        const options = match[1].split("|").map(opt => opt.trim());
        friendlyMessage = `Please select one of: ${options.join(", ")}`;
      }
    }
    
    const fieldLabels: Record<string, string> = {
      projectName: "Project Name",
      projectType: "Project Type",
      projectStatus: "Project Status",
      clientName: "Client Name",
      clientLocation: "Client Location",
      projectBudget: "Project Budget",
      paidAmount: "Paid Amount",
      dueAmount: "Due Amount",
      weeklyLimit: "Weekly Limit",
      assignedMembers: "Assigned Members",
      committedDeadline: "Committed Deadline",
      targetedDeadline: "Targeted Deadline",
    };
    
    const fieldLabel = fieldLabels[fieldName] || fieldName;
    fieldErrors[fieldName] = friendlyMessage;
    errorMessages.push(`${fieldLabel}: ${friendlyMessage}`);
  });

  let summary: string;
  if (errorMessages.length === 0) {
    summary = "Please check the form for errors";
  } else if (errorMessages.length === 1) {
    summary = errorMessages[0];
  } else {
    const fieldNames = errors.map(err => {
      const fieldName = err.path[err.path.length - 1];
      const fieldLabels: Record<string, string> = {
        projectName: "Project Name",
        projectType: "Project Type",
        projectStatus: "Project Status",
        clientName: "Client Name",
        clientLocation: "Client Location",
        projectBudget: "Project Budget",
        paidAmount: "Paid Amount",
        dueAmount: "Due Amount",
        weeklyLimit: "Weekly Limit",
        assignedMembers: "Assigned Members",
        committedDeadline: "Committed Deadline",
        targetedDeadline: "Targeted Deadline",
      };
      return fieldLabels[fieldName] || fieldName;
    });
    summary = `Please fix errors in: ${fieldNames.join(", ")}`;
  }

  return { fieldErrors, summary };
};

// Hook to create new live project
export const useCreateNewLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: {
      projectName: string;
      clientName?: string;
      clientLocation?: string;
      assignedMembers: string[];
      projectType: "FIXED" | "HOURLY";
      projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCEL" | "ARCHIVED";
      projectBudget?: number;
      paidAmount?: number;
      dueAmount?: number;
      weeklyLimit?: number;
      committedDeadline?: string;
      targetedDeadline?: {
        backend?: string;
        frontend?: string;
        ui?: string;
      };
      documents?: Array<{
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
        uploadedBy: string;
        uploadedAt: string;
      }>;
    }) => newLiveProjectService.createNewLiveProject(projectData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("New live project created successfully");
        queryClient.invalidateQueries({ 
          queryKey: newLiveProjectQueryKeys.lists()
        });
        queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create new live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data;
      
      if (Array.isArray(errorData?.error)) {
        const { summary } = formatNewLiveProjectValidationErrors(errorData.error as ValidationError[]);
        toast.error(summary);
      } else {
        const errorMessage =
          errorData?.message ||
          (typeof errorData?.error === "string" ? errorData.error : undefined) ||
          error.message ||
          "Failed to create new live project";
        toast.error(errorMessage);
      }
    },
  });
};

// Hook to update new live project
export const useUpdateNewLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      projectData,
    }: {
      projectId: string;
      projectData: Partial<NewLiveProject>;
    }) => newLiveProjectService.updateNewLiveProject(projectId, projectData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("New live project updated successfully");
        queryClient.invalidateQueries({ 
          queryKey: newLiveProjectQueryKeys.lists()
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
        queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update new live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data;
      
      if (Array.isArray(errorData?.error)) {
        const { summary } = formatNewLiveProjectValidationErrors(errorData.error as ValidationError[]);
        toast.error(summary);
      } else {
        const errorMessage =
          errorData?.message ||
          (typeof errorData?.error === "string" ? errorData.error : undefined) ||
          error.message ||
          "Failed to update new live project";
        toast.error(errorMessage);
      }
    },
  });
};

// Hook to delete new live project
export const useDeleteNewLiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      newLiveProjectService.deleteNewLiveProject(projectId),
    onSuccess: (data, projectId) => {
      if (data.success) {
        toast.success("New live project deleted successfully");
        queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.stats() });
        queryClient.removeQueries({ queryKey: newLiveProjectQueryKeys.detail(projectId) });
      } else {
        toast.error(data.message || "Failed to delete new live project");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete new live project";
      toast.error(errorMessage);
    },
  });
};

// Hook to add project action
export const useAddProjectAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      actionText,
    }: {
      projectId: string;
      actionText: string;
    }) => newLiveProjectService.addProjectAction(projectId, actionText),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Action added successfully");
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.actions(variables.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to add action");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to add action";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete project action
export const useDeleteProjectAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      actionId,
    }: {
      projectId: string;
      actionId: string;
    }) => newLiveProjectService.deleteProjectAction(projectId, actionId),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Action deleted successfully");
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.actions(variables.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to delete action");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete action";
      toast.error(errorMessage);
    },
  });
};

// Hook to add hour log
export const useAddHourLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      date,
      submittedHours,
    }: {
      projectId: string;
      date: string;
      submittedHours: number;
    }) => newLiveProjectService.addHourLog(projectId, date, submittedHours),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Hour log added successfully");
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.hourLogs(variables.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to add hour log");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to add hour log";
      toast.error(errorMessage);
    },
  });
};

// Hook to update hour log
export const useUpdateHourLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      hourLogId,
      date,
      submittedHours,
    }: {
      projectId: string;
      hourLogId: string;
      date: string;
      submittedHours: number;
    }) => newLiveProjectService.updateHourLog(projectId, hourLogId, date, submittedHours),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Hour log updated successfully");
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.hourLogs(variables.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to update hour log");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update hour log";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete hour log
export const useDeleteHourLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      hourLogId,
    }: {
      projectId: string;
      hourLogId: string;
    }) => newLiveProjectService.deleteHourLog(projectId, hourLogId),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Hour log deleted successfully");
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.hourLogs(variables.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: newLiveProjectQueryKeys.detail(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to delete hour log");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete hour log";
      toast.error(errorMessage);
    },
  });
};
