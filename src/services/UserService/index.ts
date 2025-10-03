"use client";

import apiClient from "@/lib/axios";
import { ApiResponse, RegisterCredentials, User } from "@/types";

// Types for user management
export interface PaginatedUsersResponse {
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface BanUserData {
  banReason: string;
}

export interface UsersQueryParams {
  page: number;
  limit: number;
  search?: string;
}

// User management service
export const userService = {
  // Get all users with pagination and search
  getAllUsers: async (
    params: UsersQueryParams
  ): Promise<PaginatedUsersResponse> => {
    const { page, limit, search } = params;
    const url = `/user/all-users?page=${page}&limit=${limit}${
      search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : ""
    }`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (
    userData: RegisterCredentials
  ): Promise<ApiResponse<User>> => {
    console.log(userData);
    const response = await apiClient.post("/user/create-client", userData);
    return response.data;
  },

  // Update user
  updateUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Ban user
  banUser: async (
    userId: string,
    banData: BanUserData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(`/users/${userId}/ban`, banData);
    return response.data;
  },

  // Unban user
  unbanUser: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(`/users/${userId}/unban`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Get user statistics (for dashboard)
  getUserStats: async (): Promise<
    ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      bannedUsers: number;
      adminUsers: number;
    }>
  > => {
    const response = await apiClient.get("/user/stats");
    return response.data;
  },
};
