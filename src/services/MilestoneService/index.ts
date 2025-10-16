"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Milestone,
  MilestoneStats,
  MilestonesQueryParams,
} from "@/types";

export type { MilestonesQueryParams };

export const milestoneService = {
  // Get all milestones with pagination and search
  getAllMilestones: async (
    params: MilestonesQueryParams
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number; totalPages: number };
      result: Milestone[];
    }>
  > => {
    const { page, limit, search, status, projectId } = params;
    let url = `/milestones?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (projectId) {
      url += `&projectId=${encodeURIComponent(projectId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single milestone by ID
  getMilestoneById: async (
    milestoneId: string
  ): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.get(`/milestones/${milestoneId}`);
    return response.data;
  },

  // Create new milestone
  createMilestone: async (milestoneData: {
    name: string;
    description?: string;
    status?: string;
    projectId: string;
  }): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.post("/milestones", milestoneData);
    return response.data;
  },

  // Update milestone
  updateMilestone: async (
    milestoneId: string,
    milestoneData: Partial<Milestone>
  ): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.patch(
      `/milestones/${milestoneId}`,
      milestoneData
    );
    return response.data;
  },

  // Delete milestone
  deleteMilestone: async (milestoneId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/milestones/${milestoneId}`);
    return response.data;
  },

  // Assign employees to milestone
  assignEmployees: async (
    milestoneId: string,
    userProfileIds: string[]
  ): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.post(
      `/milestones/${milestoneId}/assign-employees`,
      { userProfileIds }
    );
    return response.data;
  },

  // Assign services to milestone
  assignServices: async (
    milestoneId: string,
    serviceIds: string[]
  ): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.post(
      `/milestones/${milestoneId}/assign-services`,
      { serviceIds }
    );
    return response.data;
  },

  // Get milestone statistics
  getMilestoneStats: async (): Promise<ApiResponse<MilestoneStats>> => {
    const response = await apiClient.get("/milestones/stats");
    return response.data;
  },
};
