"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Project,
  ProjectStats,
  ProjectsQueryParams,
} from "@/types";

export type { ProjectsQueryParams };

export const projectService = {
  // Get all projects with pagination and search
  getAllProjects: async (
    params: ProjectsQueryParams
  ): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const { page, limit, search, status, userProfileId } = params;
    let url = `/projects?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (userProfileId) {
      url += `&userProfileId=${encodeURIComponent(userProfileId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single project by ID
  getProjectById: async (projectId: string): Promise<ApiResponse<Project>> => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData: {
    name: string;
    description?: string;
    status?: string;
    userProfileId: string;
  }): Promise<ApiResponse<Project>> => {
    const response = await apiClient.post("/projects", projectData);
    return response.data;
  },

  // Update project
  updateProject: async (
    projectId: string,
    projectData: Partial<Project>
  ): Promise<ApiResponse<Project>> => {
    const response = await apiClient.patch(
      `/projects/${projectId}`,
      projectData
    );
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Get project statistics (for dashboard)
  getProjectStats: async (): Promise<ApiResponse<ProjectStats>> => {
    const response = await apiClient.get("/projects/stats");
    return response.data;
  },
};
