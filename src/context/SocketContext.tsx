"use client";

import { disconnectSocket, initializeSocket } from "@/lib/socket";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Map<string, boolean>;
  connect: () => void;
  disconnect: () => void;
  isUserOnline: (userProfileId: string) => boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(
    new Map()
  );

  const connect = () => {
    if (!socket) {
      const newSocket = initializeSocket();

      // Add connection status listeners
      newSocket.on("connect", () => {
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen for user online/offline status
      newSocket.on(
        "user:status",
        (data: {
          userProfileId: string;
          status: "online" | "offline";
          lastSeen?: Date;
        }) => {
          setOnlineUsers((prev) => {
            const newMap = new Map(prev);
            newMap.set(data.userProfileId, data.status === "online");
            return newMap;
          });
        }
      );

      // Listen for initial conversation participant statuses
      newSocket.on(
        "conversation:initial-status",
        (data: {
          conversationId: string;
          participants: Array<{
            userProfileId: string;
            status: "online" | "offline";
          }>;
        }) => {
          setOnlineUsers((prev) => {
            const newMap = new Map(prev);
            data.participants.forEach((p) => {
              newMap.set(p.userProfileId, p.status === "online");
            });
            return newMap;
          });
        }
      );

      newSocket.connect();
      setSocket(newSocket);
    } else if (!socket.connected) {
      socket.connect();
    }
  };

  const isUserOnline = (userProfileId: string): boolean => {
    return onlineUsers.get(userProfileId) || false;
  };

  const disconnect = () => {
    if (socket) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
