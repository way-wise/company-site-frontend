"use client";

import { useUnreadCount } from "@/hooks/useNotificationMutations";
import { useSSE } from "@/context/SSEContext";
import { useAuth } from "@/context/UserContext";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationQueryKeys } from "@/hooks/useNotificationMutations";
import { ApiResponse, Notification, NotificationsResponse, UnreadCountResponse } from "@/types";

interface NotificationContextType {
  unreadCount: number | undefined;
  isLoading: boolean;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { isConnected, connect, disconnect, onEvent, offEvent } = useSSE();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data: unreadCountData, isLoading } = useUnreadCount();
  const unreadCount = unreadCountData?.data?.count;

  const refreshNotifications = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: notificationQueryKeys.all,
    });
  }, [queryClient]);

  useEffect(() => {
    if (user && isAuthenticated && !isConnected) {
      connect();
    } else if (!user && isConnected) {
      disconnect();
    }
  }, [user, isAuthenticated, isConnected, connect, disconnect]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const handleNewNotification = (data: unknown) => {
      try {
        const notification = data as Notification;

        // Update unread count immediately
        queryClient.setQueryData(
          notificationQueryKeys.unreadCount(),
          (old: ApiResponse<UnreadCountResponse> | undefined) => {
            if (!old?.data) {
              // If cache doesn't exist, create it
              return {
                success: true,
                message: "",
                data: { count: 1 },
              };
            }
            return {
              ...old,
              data: {
                count: old.data.count + 1,
              },
            };
          }
        );

        // Update all notification lists by prepending the new notification
        // This will update all queries that match the pattern ["notifications", "list", ...]
        queryClient.setQueriesData<ApiResponse<NotificationsResponse>>(
          { queryKey: notificationQueryKeys.lists() },
          (old) => {
            if (!old?.data) {
              // If cache doesn't exist for this query variant, return old unchanged
              // We'll invalidate below to trigger fetch for missing caches
              return old;
            }

            // Check if notification already exists (avoid duplicates)
            const notificationExists = old.data.result.some(
              (n) => n.id === notification.id
            );

            if (notificationExists) {
              return old;
            }

            // Prepend new notification and update meta
            const newTotal = old.data.meta.total + 1;
            return {
              ...old,
              data: {
                ...old.data,
                result: [notification, ...old.data.result],
                meta: {
                  ...old.data.meta,
                  total: newTotal,
                  totalPages: Math.ceil(newTotal / (old.data.meta.limit || 1)),
                },
              },
            };
          }
        );

        // Also ensure the default NotificationPanel query (page 1, limit 10) gets updated
        // If it doesn't exist in cache, invalidate to trigger fetch
        const defaultPanelQuery = notificationQueryKeys.list({ page: 1, limit: 10 });
        const panelCache = queryClient.getQueryData<ApiResponse<NotificationsResponse>>(
          defaultPanelQuery
        );
        
        if (!panelCache?.data) {
          // If the panel's cache doesn't exist, invalidate to trigger fetch
          queryClient.invalidateQueries({
            queryKey: notificationQueryKeys.lists(),
            exact: false,
          });
        }
      } catch (error) {
        console.error("Error handling notification event:", error);
        // Fallback to invalidation on error
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.all,
        });
      }
    };

    onEvent("notification:new", handleNewNotification);

    return () => {
      offEvent("notification:new", handleNewNotification);
    };
  }, [isConnected, onEvent, offEvent, queryClient]);

  const value: NotificationContextType = {
    unreadCount,
    isLoading,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

