"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

// Simple auth service with HTTPOnly cookies
export const authService = {
  // Login user (backend sets HTTPOnly cookies)
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post("/auth/login", credentials);
    console.log(response.data);
    return response.data;
  },

  // Register new user
  register: async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post("/auth/register", credentials);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Logout user (backend clears HTTPOnly cookies)
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },

  // Forgot password - request reset link
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },
};
