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
  const { data: unreadCountData, isLoading } = useUnreadCount();
  const unreadCount = unreadCountData?.data?.count;

  const refreshNotifications = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: notificationQueryKeys.all,
    });
  }, [queryClient]);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (user && !isConnected) {
      console.log("🔌 Connecting socket for notifications...");
      connect();
    }
  }, [user, isConnected, connect]);

  // Log socket connection status changes
  useEffect(() => {
    if (socket) {
      if (isConnected) {
        console.log("✅ Socket connected - notification listener ready");
      } else {
        console.log("⚠️ Socket disconnected - notifications will not be received in real-time");
      }
    }
  }, [socket, isConnected]);

  useEffect(() => {
    // Verify socket is connected before setting up listener
    if (!socket || !isConnected) {
      if (socket && !isConnected) {
        console.log("⏳ Waiting for socket connection before setting up notification listener...");
      }
      return;
    }

    // Listen for new notifications
    const handleNewNotification = (notification: unknown) => {
      try {
        console.log("🔔 New notification received:", notification);
        
        // Invalidate queries to refresh notification list and unread count
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.all,
        });
        
        console.log("✅ Notification queries invalidated - UI will update");
      } catch (error) {
        console.error("❌ Error handling notification event:", error);
      }
    };

    // Set up error handler for socket events
    const handleError = (error: unknown) => {
      console.error("❌ Socket error in notification listener:", error);
    };

    // Register event listeners
    socket.on("notification:new", handleNewNotification);
    socket.on("error", handleError);

    console.log("👂 Notification listener registered on socket");

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("error", handleError);
      console.log("🔇 Notification listener removed");
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

