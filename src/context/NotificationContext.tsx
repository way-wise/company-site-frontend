"use client";

import { useUnreadCount } from "@/hooks/useNotificationMutations";
import { useSocket } from "@/context/SocketContext";
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
  const { socket, isConnected, connect } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: unreadCountData, isLoading } = useUnreadCount(!!user);
  const unreadCount = unreadCountData?.data?.count;

  const refreshNotifications = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: notificationQueryKeys.all,
    });
  }, [queryClient]);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected, connect]);

  useEffect(() => {
    // Verify socket is connected before setting up listener
    if (!socket || !isConnected) {
      return;
    }

    // Listen for new notifications
    const handleNewNotification = () => {
      // Invalidate queries to refresh notification list and unread count
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    };

    // Set up error handler for socket events
    const handleError = () => {
      // Socket error in notification listener
    };

    // Register event listeners
    socket.on("notification:new", handleNewNotification);
    socket.on("error", handleError);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("error", handleError);
    };
  }, [socket, isConnected, queryClient]);

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

