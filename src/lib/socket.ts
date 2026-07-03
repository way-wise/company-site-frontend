import { io, Socket } from "socket.io-client";
import { cookieManager } from "./cookies";

// Support both NEXT_PUBLIC_BASE_API (remove /api/v1) and NEXT_PUBLIC_API_URL
const SOCKET_URL =
  process.env.NEXT_PUBLIC_BASE_API?.replace("/api/v1", "") ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:5000" : undefined);

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    // Get access token from cookies
    const accessToken = cookieManager.get("accessToken");

    socket = io(SOCKET_URL, {
      withCredentials: true, // Send cookies with requests
      autoConnect: false, // Don't connect automatically
      transports: ["websocket", "polling"],
      auth: {
        token: accessToken,
      },
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: 5, // Try to reconnect 5 times
      reconnectionDelay: 1000, // Wait 1s before first reconnection attempt
      reconnectionDelayMax: 5000, // Max wait time between attempts
      timeout: 20000, // Connection timeout
    });

    // Connection event listeners
    socket.on("connect", () => {
      // Socket connected
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // Server disconnected the socket, try to reconnect manually
        socket?.connect();
      }
    });

    socket.on("reconnect", () => {
      // Socket reconnected
    });

    socket.on("reconnect_attempt", () => {
      // Update auth token on reconnection attempt
      const newToken = cookieManager.get("accessToken");
      if (socket && newToken) {
        socket.auth = { token: newToken };
      }
    });

    socket.on("reconnect_error", () => {
      // Reconnection error occurred
    });

    socket.on("reconnect_failed", () => {
      // Failed to reconnect after maximum attempts
    });

    socket.on("connect_error", () => {
      // Socket connection error
    });

    socket.on("error", () => {
      // Socket error occurred
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
