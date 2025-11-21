"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Earning,
  EarningStats,
  EarningsQueryParams,
  PaginatedResponse,
  ProjectEarning,
} from "@/types";

export type { EarningsQueryParams };

export const earningService = {
  // Get all earnings with pagination and search
  getAllEarnings: async (
    params: EarningsQueryParams
  ): Promise<ApiResponse<PaginatedResponse<Earning>>> => {
    const { page, limit, search, projectId, category, startDate, endDate } = params;
    let url = `/earnings?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (projectId) {
      url += `&projectId=${encodeURIComponent(projectId)}`;
    }
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (startDate) {
      url += `&startDate=${encodeURIComponent(startDate)}`;
    }
    if (endDate) {
      url += `&endDate=${encodeURIComponent(endDate)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single earning by ID
  getEarningById: async (earningId: string): Promise<ApiResponse<Earning>> => {
    const response = await apiClient.get(`/earnings/${earningId}`);
    return response.data;
  },

  // Create new earning
  createEarning: async (earningData: {
    amount: number;
    description?: string;
    date: string;
    projectId?: string;
    category?: string;
  }): Promise<ApiResponse<Earning>> => {
    const response = await apiClient.post("/earnings", earningData);
    return response.data;
  },

  // Update earning
  updateEarning: async (
    earningId: string,
    earningData: Partial<Earning>
  ): Promise<ApiResponse<Earning>> => {
    const response = await apiClient.patch(`/earnings/${earningId}`, earningData);
    return response.data;
  },

  // Delete earning
  deleteEarning: async (earningId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/earnings/${earningId}`);
    return response.data;
  },

  // Get earning statistics
  getEarningStats: async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<EarningStats>> => {
    let url = "/earnings/stats";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get project earnings from milestone payments
  getProjectEarnings: async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<ProjectEarning[]>> => {
    let url = "/earnings/project-earnings";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },
};

