"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  LeaveApplicationWithRelations,
  LeaveCalendarEvent,
  LeaveStats,
} from "@/types";

export interface ApplyLeaveData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
}

export interface ApproveLeaveData {
  comments?: string;
}

export interface RejectLeaveData {
  rejectionReason?: string;
  comments?: string;
}

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  userProfileId?: string;
}

export interface LeaveCalendarParams {
  startDate?: string;
  endDate?: string;
  userProfileId?: string;
  leaveTypeId?: string;
}

export const leaveService = {
  // Get my leaves
  getMyLeaves: async (
    params: LeaveQueryParams
  ): Promise<
    ApiResponse<LeaveApplicationWithRelations[]> & {
      meta: { page: number; limit: number; total: number };
    }
  > => {
    const { page = 1, limit = 10, status, leaveTypeId, startDate, endDate } =
      params;
    let url = `/leaves/mine?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (leaveTypeId) {
      url += `&leaveTypeId=${encodeURIComponent(leaveTypeId)}`;
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

  // Get all leaves (admin)
  getAllLeaves: async (
    params: LeaveQueryParams
  ): Promise<
    ApiResponse<LeaveApplicationWithRelations[]> & {
      meta: { page: number; limit: number; total: number };
    }
  > => {
    const { page = 1, limit = 10, status, leaveTypeId, userProfileId, startDate, endDate } =
      params;
    let url = `/leaves/all?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (leaveTypeId) {
      url += `&leaveTypeId=${encodeURIComponent(leaveTypeId)}`;
    }
    if (userProfileId) {
      url += `&userProfileId=${encodeURIComponent(userProfileId)}`;
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

  // Get single leave
  getLeaveById: async (
    leaveId: string
  ): Promise<ApiResponse<LeaveApplicationWithRelations>> => {
    const response = await apiClient.get(`/leaves/${leaveId}`);
    return response.data;
  },

  // Apply for leave
  applyForLeave: async (
    leaveData: ApplyLeaveData
  ): Promise<ApiResponse<LeaveApplicationWithRelations>> => {
    const response = await apiClient.post("/leaves/apply", leaveData);
    return response.data;
  },

  // Cancel leave
  cancelLeave: async (
    leaveId: string
  ): Promise<ApiResponse<LeaveApplicationWithRelations>> => {
    const response = await apiClient.patch(`/leaves/${leaveId}/cancel`);
    return response.data;
  },

  // Delete leave (pending only)
  deleteLeave: async (leaveId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/leaves/${leaveId}`);
    return response.data;
  },

  // Approve leave (admin)
  approveLeave: async (
    leaveId: string,
    data: ApproveLeaveData
  ): Promise<ApiResponse<LeaveApplicationWithRelations>> => {
    const response = await apiClient.patch(`/leaves/${leaveId}/approve`, {
      status: "APPROVED",
      ...data,
    });
    return response.data;
  },

  // Reject leave (admin)
  rejectLeave: async (
    leaveId: string,
    data: RejectLeaveData
  ): Promise<ApiResponse<LeaveApplicationWithRelations>> => {
    const response = await apiClient.patch(`/leaves/${leaveId}/reject`, {
      status: "REJECTED",
      ...data,
    });
    return response.data;
  },

  // Get leave statistics (admin)
  getLeaveStats: async (
    params?: { year?: number; userProfileId?: string }
  ): Promise<ApiResponse<LeaveStats>> => {
    let url = "/leaves/stats";
    if (params?.year) {
      url += `?year=${params.year}`;
    }
    if (params?.userProfileId) {
      url += params.year ? `&userProfileId=${params.userProfileId}` : `?userProfileId=${params.userProfileId}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get leave calendar (admin)
  getLeaveCalendar: async (
    params: LeaveCalendarParams
  ): Promise<ApiResponse<LeaveCalendarEvent[]>> => {
    const { startDate, endDate, userProfileId, leaveTypeId } = params;
    let url = "/leaves/calendar";

    const queryParams: string[] = [];
    if (startDate) queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
    if (userProfileId) queryParams.push(`userProfileId=${encodeURIComponent(userProfileId)}`);
    if (leaveTypeId) queryParams.push(`leaveTypeId=${encodeURIComponent(leaveTypeId)}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },
};

