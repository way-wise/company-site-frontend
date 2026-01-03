"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  LiveProject,
  LiveProjectsQueryParams,
} from "@/types";

export type { LiveProjectsQueryParams };

export interface LiveProjectsResponse {
  success: boolean;
  message: string;
  data: LiveProject[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const liveProjectService = {
  // Get all live projects with pagination and search
  getAllLiveProjects: async (
    params: LiveProjectsQueryParams
  ): Promise<LiveProjectsResponse> => {
    const { page, limit, search, projectStatus, projectType, clientName } = params;
    let url = `/live-projects?page=${page}&limit=${limit}`;

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

  // Get single live project by ID
  getLiveProjectById: async (
    liveProjectId: string
  ): Promise<ApiResponse<LiveProject>> => {
    const response = await apiClient.get(`/live-projects/${liveProjectId}`);
    return response.data;
  },

  // Create new live project
  createLiveProject: async (liveProjectData: {
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
  }): Promise<ApiResponse<LiveProject>> => {
    const response = await apiClient.post("/live-projects", liveProjectData);
    return response.data;
  },

  // Update live project
  updateLiveProject: async (
    liveProjectId: string,
    liveProjectData: Partial<LiveProject>
  ): Promise<ApiResponse<LiveProject>> => {
    const response = await apiClient.put(
      `/live-projects/${liveProjectId}`,
      liveProjectData
    );
    return response.data;
  },

  // Delete live project
  deleteLiveProject: async (
    liveProjectId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/live-projects/${liveProjectId}`);
    return response.data;
  },

  // Get live project statistics (for dashboard)
  getLiveProjectStats: async (): Promise<
    ApiResponse<{
      totalLiveProjects: number;
      activeLiveProjects: number;
      completedLiveProjects: number;
      pendingLiveProjects: number;
    }>
  > => {
    const response = await apiClient.get("/live-projects/stats");
    return response.data;
  },
};

