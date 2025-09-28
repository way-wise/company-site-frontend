"use client";

import apiClient from "@/lib/axios";
import { cookieManager } from "@/lib/cookies";
import {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

// Simple auth service with cookie-based storage
export const authService = {
  // Login user
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

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear cookies, even if server logout fails
      cookieManager.clear();
    }
  },
};
