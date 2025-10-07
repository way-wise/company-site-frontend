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

export interface CreateAdminData {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber?: string;
  };
}

export interface CreateEmployeeData {
  password: string;
  employee: {
    name: string;
    email: string;
    gender: "MALE" | "FEMALE";
    contactNumber?: string;
    address?: string;
  };
}

export interface BanUserData {
  banReason: string;
}

export interface UsersQueryParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}

// User management service
export const userService = {
  // Get all users with pagination and search
  getAllUsers: async (
    params: UsersQueryParams
  ): Promise<PaginatedUsersResponse> => {
    const { page, limit, search, role } = params;
    let url = `/user/all-users?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }

    if (role) {
      url += `&role=${encodeURIComponent(role)}`;
    }

    const response = await apiClient.get(url);

    // Transform the response to match frontend expectations
    const transformedResponse = {
      data: response.data.data,
      pagination: {
        currentPage: response.data.meta.page,
        totalPages: Math.ceil(
          response.data.meta.total / response.data.meta.limit
        ),
        totalUsers: response.data.meta.total,
        hasNextPage:
          response.data.meta.page <
          Math.ceil(response.data.meta.total / response.data.meta.limit),
        hasPrevPage: response.data.meta.page > 1,
      },
    };

    return transformedResponse;
  },

  // Get single user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  // Create new user (client)
  createUser: async (
    userData: RegisterCredentials
  ): Promise<ApiResponse<User>> => {
    console.log(userData);
    const response = await apiClient.post("/user/create-client", userData);
    return response.data;
  },

  // Create admin
  createAdmin: async (
    userData: CreateAdminData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.post("/user/create-admin", userData);
    return response.data;
  },

  // Create employee
  createEmployee: async (
    userData: CreateEmployeeData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.post("/user/create-employee", userData);
    return response.data;
  },

  // Update user
  updateUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/user/${userId}`, userData);
    return response.data;
  },

  // Ban user
  banUser: async (
    userId: string,
    banData: BanUserData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(`/user/${userId}/ban`, banData);
    return response.data;
  },

  // Unban user
  unbanUser: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(`/user/${userId}/unban`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/user/${userId}`);
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
