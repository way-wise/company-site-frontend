"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  NewLiveProject,
  NewLiveProjectsQueryParams,
  NewProjectAction,
  NewHourLog,
} from "@/types";

export type { NewLiveProjectsQueryParams };

export interface NewLiveProjectsResponse {
  success: boolean;
  message: string;
  data: NewLiveProject[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const newLiveProjectService = {
  // Get all new live projects with pagination and search
  getAllNewLiveProjects: async (
    params: NewLiveProjectsQueryParams
  ): Promise<NewLiveProjectsResponse> => {
    const { page, limit, search, projectStatus, projectType, clientName } = params;
    let url = `/new-live-projects?page=${page}&limit=${limit}&include=actions,hourLogs`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (projectStatus) {
      url += `&projectStatus=${encodeURIComponent(projectStatus)}`;
    }
    if (projectType) {
      url += `&projectType=${encodeURIComponent(projectType)}`;
    }
    if (clientName) {
      url += `&clientName=${encodeURIComponent(clientName)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single new live project by ID
  getNewLiveProjectById: async (
    projectId: string
  ): Promise<ApiResponse<NewLiveProject>> => {
    const response = await apiClient.get(`/new-live-projects/${projectId}`);
    return response.data;
  },

  // Create new live project
  createNewLiveProject: async (projectData: {
    projectName: string;
    clientName?: string;
    clientLocation?: string;
    assignedMembers: string[]; // Array of strings
    projectType: "FIXED" | "HOURLY";
    projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCEL" | "ARCHIVED";
    projectBudget?: number; // Required for FIXED
    paidAmount?: number; // Required for FIXED
    dueAmount?: number;
    weeklyLimit?: number; // Required for HOURLY
    committedDeadline?: string; // ISO date string
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
  }): Promise<ApiResponse<NewLiveProject>> => {
    const response = await apiClient.post("/new-live-projects", projectData);
    return response.data;
  },

  // Update new live project
  updateNewLiveProject: async (
    projectId: string,
    projectData: Partial<NewLiveProject>
  ): Promise<ApiResponse<NewLiveProject>> => {
    const response = await apiClient.put(
      `/new-live-projects/${projectId}`,
      projectData
    );
    return response.data;
  },

  // Upload document
  uploadDocument: async (
    projectId: string,
    file: File
  ): Promise<ApiResponse<NewLiveProject>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `/new-live-projects/${projectId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Delete new live project
  deleteNewLiveProject: async (
    projectId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/new-live-projects/${projectId}`);
    return response.data;
  },

  // Get project actions
  getProjectActions: async (
    projectId: string
  ): Promise<ApiResponse<NewProjectAction[]>> => {
    const response = await apiClient.get(`/new-live-projects/${projectId}/actions`);
    return response.data;
  },

  // Add project action
  addProjectAction: async (
    projectId: string,
    actionText: string
  ): Promise<ApiResponse<NewProjectAction>> => {
    const response = await apiClient.post(`/new-live-projects/${projectId}/actions`, {
      actionText,
    });
    return response.data;
  },

  // Delete project action (if backend supports it)
  deleteProjectAction: async (
    projectId: string,
    actionId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(
      `/new-live-projects/${projectId}/actions/${actionId}`
    );
    return response.data;
  },

  // Get hour logs (backend uses /hours, not /hour-logs)
  getHourLogs: async (
    projectId: string
  ): Promise<ApiResponse<NewHourLog[]>> => {
    const response = await apiClient.get(`/new-live-projects/${projectId}/hours`);
    return response.data;
  },

  // Add hour log (backend uses /hours, not /hour-logs)
  addHourLog: async (
    projectId: string,
    date: string, // ISO date string
    submittedHours: number
  ): Promise<ApiResponse<NewHourLog>> => {
    const response = await apiClient.post(`/new-live-projects/${projectId}/hours`, {
      date,
      submittedHours,
    });
    return response.data;
  },

  // Update hour log (if backend supports it)
  updateHourLog: async (
    projectId: string,
    hourLogId: string,
    date: string,
    submittedHours: number
  ): Promise<ApiResponse<NewHourLog>> => {
    const response = await apiClient.put(
      `/new-live-projects/${projectId}/hours/${hourLogId}`,
      {
        date,
        submittedHours,
      }
    );
    return response.data;
  },

  // Delete hour log (if backend supports it)
  deleteHourLog: async (
    projectId: string,
    hourLogId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(
      `/new-live-projects/${projectId}/hours/${hourLogId}`
    );
    return response.data;
  },

  // Get new live project statistics
  getNewLiveProjectStats: async (): Promise<
    ApiResponse<{
      totalProjects: number;
      activeProjects: number;
      completedProjects: number;
      pendingProjects: number;
    }>
  > => {
    const response = await apiClient.get("/new-live-projects/stats");
    return response.data;
  },
};
