"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Notification,
  NotificationsQueryParams,
  NotificationsResponse,
  UnreadCountResponse,
} from "@/types";

export type { NotificationsQueryParams };

export const notificationService = {
  // Get all notifications with pagination and filters
  getAllNotifications: async (
    params: NotificationsQueryParams
  ): Promise<ApiResponse<NotificationsResponse>> => {
    const { page, limit, search, type, read, startDate, endDate } = params;
    let url = `/notifications?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    if (read !== undefined) {
      url += `&read=${read}`;
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

  // Get unread count
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  },

  // Get single notification by ID
  getNotificationById: async (
    notificationId: string
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get(`/notifications/${notificationId}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (
    notificationId: string
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.patch("/notifications/read-all");
    return response.data;
  },

  // Delete notification
  deleteNotification: async (
    notificationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

