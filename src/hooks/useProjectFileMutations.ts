"use client";

import { projectFileService } from "@/services/ProjectFileService";
import { ProjectFile, ProjectFileFormData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const projectFileQueryKeys = {
  all: ["project-files"] as const,
  byProject: (projectId: string) =>
    [...projectFileQueryKeys.all, "project", projectId] as const,
};

// Hook to fetch files by project ID
export const useProjectFiles = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: projectFileQueryKeys.byProject(projectId),
    queryFn: async () => {
      const response = await projectFileService.getFilesByProjectId(projectId);
      return response.data || [];
    },
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to upload file
export const useUploadProjectFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectFileFormData) =>
      projectFileService.uploadFile(data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("File uploaded successfully");
        queryClient.invalidateQueries({
          queryKey: projectFileQueryKeys.byProject(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to upload file");
      }
    },
    onError: (error: Error) => {
      console.error("Upload file error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || error.message || "Failed to upload file";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete file
export const useDeleteProjectFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileId,
      projectId,
    }: {
      fileId: string;
      projectId: string;
    }) => projectFileService.deleteFile(fileId),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("File deleted successfully");
        queryClient.invalidateQueries({
          queryKey: projectFileQueryKeys.byProject(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to delete file");
      }
    },
    onError: (error: Error) => {
      console.error("Delete file error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || error.message || "Failed to delete file";
      toast.error(errorMessage);
    },
  });
};

