"use client";

import {
  projectNoteService,
} from "@/services/ProjectNoteService";
import { ProjectNote, ProjectNoteFormData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const projectNoteQueryKeys = {
  all: ["project-notes"] as const,
  byProject: (projectId: string) =>
    [...projectNoteQueryKeys.all, "project", projectId] as const,
};

// Hook to fetch note by project ID
export const useProjectNote = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: projectNoteQueryKeys.byProject(projectId),
    queryFn: async () => {
      const response = await projectNoteService.getNoteByProjectId(projectId);
      return response.data;
    },
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create or update note
export const useCreateOrUpdateProjectNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectNoteFormData) =>
      projectNoteService.createOrUpdateNote(data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Note saved successfully");
        queryClient.invalidateQueries({
          queryKey: projectNoteQueryKeys.byProject(variables.projectId),
        });
      } else {
        toast.error(data.message || "Failed to save note");
      }
    },
    onError: (error: Error) => {
      console.error("Save note error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || error.message || "Failed to save note";
      toast.error(errorMessage);
    },
  });
};

// Hook to update note
export const useUpdateProjectNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      projectNoteService.updateNote(id, content),
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast.success("Note updated successfully");
        queryClient.invalidateQueries({
          queryKey: projectNoteQueryKeys.byProject(data.data.projectId),
        });
      } else {
        toast.error(data.message || "Failed to update note");
      }
    },
    onError: (error: Error) => {
      console.error("Update note error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || error.message || "Failed to update note";
      toast.error(errorMessage);
    },
  });
};

