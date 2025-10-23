import { io, Socket } from "socket.io-client";
import { cookieManager } from "./cookies";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BASE_API?.replace("/api/v1", "") ||
  "http://localhost:5000";

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
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected the socket, try to reconnect manually
        socket?.connect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt", attemptNumber);
      // Update auth token on reconnection attempt
      const newToken = cookieManager.get("accessToken");
      if (socket && newToken) {
        socket.auth = { token: newToken };
      }
    });

    socket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Failed to reconnect after maximum attempts");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
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
