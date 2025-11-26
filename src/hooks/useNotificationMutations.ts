"use client";

import { notificationService, NotificationsQueryParams } from "@/services/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.all, "list"] as const,
  list: (params: NotificationsQueryParams) =>
    [...notificationQueryKeys.lists(), params] as const,
  details: () => [...notificationQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...notificationQueryKeys.details(), id] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
};

export const useNotifications = (params: NotificationsQueryParams) => {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationService.getAllNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const useUnreadCount = (enabled = true) => {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 10 * 1000, // 10 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    enabled,
  });
};

export const useNotification = (notificationId: string) => {
  return useQuery({
    queryKey: notificationQueryKeys.detail(notificationId),
    queryFn: () => notificationService.getNotificationById(notificationId),
    enabled: !!notificationId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to mark as read";
      toast.error(errorMessage);
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
      toast.success("All notifications marked as read");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to mark all as read";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
      toast.success("Notification deleted");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete notification";
      toast.error(errorMessage);
    },
  });
};

