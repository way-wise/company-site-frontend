"use client";

import apiClient from "@/lib/axios";
import { ApiResponse, LeaveType } from "@/types";

export interface CreateLeaveTypeData {
  name: string;
  description?: string;
  defaultDaysPerYear: number;
  requiresDocument: boolean;
  color?: string;
  isActive?: boolean;
}

export interface UpdateLeaveTypeData {
  name?: string;
  description?: string;
  defaultDaysPerYear?: number;
  requiresDocument?: boolean;
  color?: string;
  isActive?: boolean;
}

export interface LeaveTypeQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

export const leaveTypeService = {
  // Get all leave types
  getAllLeaveTypes: async (
    params: LeaveTypeQueryParams
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number };
      result: LeaveType[];
    }>
  > => {
    const { page = 1, limit = 10, q, isActive } = params;
    let url = `/leave-types?page=${page}&limit=${limit}`;

    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }
    if (isActive !== undefined) {
      url += `&isActive=${isActive}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get active leave types
  getActiveLeaveTypes: async (): Promise<ApiResponse<LeaveType[]>> => {
    const response = await apiClient.get("/leave-types/active");
    return response.data;
  },

  // Get single leave type
  getLeaveTypeById: async (
    leaveTypeId: string
  ): Promise<ApiResponse<LeaveType>> => {
    const response = await apiClient.get(`/leave-types/${leaveTypeId}`);
    return response.data;
  },

  // Create leave type
  createLeaveType: async (
    leaveTypeData: CreateLeaveTypeData
  ): Promise<ApiResponse<LeaveType>> => {
    const response = await apiClient.post("/leave-types", leaveTypeData);
    return response.data;
  },

  // Update leave type
  updateLeaveType: async (
    leaveTypeId: string,
    leaveTypeData: UpdateLeaveTypeData
  ): Promise<ApiResponse<LeaveType>> => {
    const response = await apiClient.patch(
      `/leave-types/${leaveTypeId}`,
      leaveTypeData
    );
    return response.data;
  },

  // Delete leave type
  deleteLeaveType: async (
    leaveTypeId: string
  ): Promise<ApiResponse<LeaveType>> => {
    const response = await apiClient.delete(`/leave-types/${leaveTypeId}`);
    return response.data;
  },

  // Toggle leave type status
  toggleLeaveTypeStatus: async (
    leaveTypeId: string
  ): Promise<ApiResponse<LeaveType>> => {
    const response = await apiClient.patch(
      `/leave-types/${leaveTypeId}/toggle-status`
    );
    return response.data;
  },
};

