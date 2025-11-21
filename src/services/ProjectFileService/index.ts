"use client";

import apiClient from "@/lib/axios";
import { ApiResponse, ProjectFile, ProjectFileFormData } from "@/types";

export const projectFileService = {
  // Get all files for a project
  getFilesByProjectId: async (
    projectId: string
  ): Promise<ApiResponse<ProjectFile[]>> => {
    const response = await apiClient.get(`/project-files/${projectId}`);
    return response.data;
  },

  // Upload file
  uploadFile: async (
    data: ProjectFileFormData
  ): Promise<ApiResponse<ProjectFile>> => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("projectId", data.projectId);

    // Axios will automatically set Content-Type with boundary for FormData
    // We explicitly set it to multipart/form-data to override default application/json
    const response = await apiClient.post("/project-files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/project-files/${fileId}`);
    return response.data;
  },
};

