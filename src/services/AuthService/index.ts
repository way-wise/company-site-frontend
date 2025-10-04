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
    return response.data;
  },

  // Register new user
  register: async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post("/user/create-client", credentials);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Logout user (backend clears HTTPOnly cookies)
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};
