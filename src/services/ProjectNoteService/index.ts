"use client";

import apiClient from "@/lib/axios";
import { ApiResponse, ProjectNote, ProjectNoteFormData } from "@/types";

export const projectNoteService = {
  // Get note by project ID
  getNoteByProjectId: async (
    projectId: string
  ): Promise<ApiResponse<ProjectNote | null>> => {
    const response = await apiClient.get(`/project-notes/${projectId}`);
    return response.data;
  },

  // Create or update note
  createOrUpdateNote: async (
    data: ProjectNoteFormData
  ): Promise<ApiResponse<ProjectNote>> => {
    const response = await apiClient.post("/project-notes", data);
    return response.data;
  },

  // Update note
  updateNote: async (
    id: string,
    content: string
  ): Promise<ApiResponse<ProjectNote>> => {
    const response = await apiClient.put(`/project-notes/${id}`, { content });
    return response.data;
  },
};

