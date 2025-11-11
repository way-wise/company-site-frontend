"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  LeaveBalance,
  LeaveBalanceWithRelations,
  LeaveType,
  LeaveTypeMeta,
} from "@/types";

export interface CreateLeaveBalanceData {
  userProfileId: string;
  leaveType: LeaveType;
  year: number;
  totalDays: number;
}

export interface UpdateLeaveBalanceData {
  totalDays?: number;
  usedDays?: number;
}

export interface AllocateBalanceData {
  year?: number;
}

export interface LeaveBalanceQueryParams {
  page?: number;
  limit?: number;
  userProfileId?: string;
  leaveType?: LeaveType;
  year?: number;
}

export interface EmployeeLeaveSummary {
  userProfileId: string;
  employeeName: string;
  employeeEmail: string;
  totalUsedDays: number;
  totalRemainingDays: number;
  totalDays: number;
  leaveBreakdown: Array<{
    leaveType: LeaveType;
    leaveTypeMeta: LeaveTypeMeta;
    usedDays: number;
    remainingDays: number;
    totalDays: number;
  }>;
}

export const leaveBalanceService = {
  // Get all leave balances (admin)
  getAllLeaveBalances: async (
    params: LeaveBalanceQueryParams
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number };
      result: LeaveBalanceWithRelations[];
    }>
  > => {
    const { page = 1, limit = 10, userProfileId, leaveType, year } = params;
    let url = `/leave-balance?page=${page}&limit=${limit}`;

    if (userProfileId) {
      url += `&userProfileId=${encodeURIComponent(userProfileId)}`;
    }
    if (leaveType) {
      url += `&leaveType=${encodeURIComponent(leaveType)}`;
    }
    if (year) {
      url += `&year=${year}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get user leave balances
  getUserLeaveBalances: async (
    userProfileId: string,
    year?: number
  ): Promise<ApiResponse<LeaveBalanceWithRelations[]>> => {
    let url = `/leave-balance/user/${userProfileId}`;
    if (year) {
      url += `?year=${year}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single leave balance
  getLeaveBalanceById: async (
    balanceId: string
  ): Promise<ApiResponse<LeaveBalanceWithRelations>> => {
    const response = await apiClient.get(`/leave-balance/${balanceId}`);
    return response.data;
  },

  // Create leave balance
  createLeaveBalance: async (
    balanceData: CreateLeaveBalanceData
  ): Promise<ApiResponse<LeaveBalance>> => {
    const response = await apiClient.post("/leave-balance", balanceData);
    return response.data;
  },

  // Update leave balance
  updateLeaveBalance: async (
    balanceId: string,
    balanceData: UpdateLeaveBalanceData
  ): Promise<ApiResponse<LeaveBalance>> => {
    const response = await apiClient.patch(
      `/leave-balance/${balanceId}`,
      balanceData
    );
    return response.data;
  },

  // Delete leave balance
  deleteLeaveBalance: async (
    balanceId: string
  ): Promise<ApiResponse<LeaveBalance>> => {
    const response = await apiClient.delete(`/leave-balance/${balanceId}`);
    return response.data;
  },

  // Allocate annual balance
  allocateAnnualBalance: async (
    userProfileId: string,
    data?: AllocateBalanceData
  ): Promise<ApiResponse<LeaveBalance>> => {
    const response = await apiClient.post(
      `/leave-balance/allocate/${userProfileId}`,
      data || {}
    );
    return response.data;
  },

  // Get employees leave summary
  getEmployeesLeaveSummary: async (
    year?: number,
    params?: { page?: number; limit?: number }
  ): Promise<
    ApiResponse<EmployeeLeaveSummary[]> & {
      meta?: { page: number; limit: number; total: number };
    }
  > => {
    const { page = 1, limit = 10 } = params || {};
    let url = `/leave-balance/summary?page=${page}&limit=${limit}`;
    if (year) {
      url += `&year=${year}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // Allocate yearly leave for all employees
  allocateYearlyLeaveForAll: async (
    year: number,
    totalDays: number
  ): Promise<
    ApiResponse<{
      allocated: number;
      updated: number;
      totalEmployees: number;
    }>
  > => {
    const response = await apiClient.post("/leave-balance/allocate-all", {
      year,
      totalDays,
    });
    return response.data;
  },
};
