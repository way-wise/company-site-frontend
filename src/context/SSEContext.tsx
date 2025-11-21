"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./UserContext";

// Extended EventSource type with custom listener properties
interface ExtendedEventSource extends EventSource {
  [key: string]: unknown;
}

interface SSEContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  onEvent: (event: string, handler: (data: unknown) => void) => void;
  offEvent: (event: string, handler: (data: unknown) => void) => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderProps {
  children: ReactNode;
}

export const SSEProvider = ({ children }: SSEProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const eventHandlersRef = useRef<Map<string, Set<(data: unknown) => void>>>(
    new Map()
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  const getSSEUrl = useCallback(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_API?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const accessToken =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]
        : null;

    const url = `${baseUrl}/api/v1/sse/events`;

    if (accessToken) {
      return `${url}?token=${encodeURIComponent(accessToken)}`;
    }

    return url;
  }, []);

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const accessToken =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1]
        : null;

    if (!accessToken) {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = getSSEUrl();
    const eventSource = new EventSource(url);

    const originalOnOpen = () => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onerror = (error) => {
      const target = error.target as EventSource;

      if (target.readyState === EventSource.CLOSED) {
        setIsConnected(false);
        eventSource.close();
        reconnectAttemptsRef.current = maxReconnectAttempts;
        return;
      }

      setIsConnected(false);
      eventSource.close();

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay =
          baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handlers = eventHandlersRef.current.get("message");
        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.addEventListener("error", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.message?.includes("Authentication") ||
          data.message?.includes("authorized") ||
          data.message?.includes("not authorized")
        ) {
          reconnectAttemptsRef.current = maxReconnectAttempts;
          setIsConnected(false);
          eventSource.close();
        }
      } catch (error) {
        // Ignore parse errors
      }
    });

    const setupEventListeners = () => {
      eventHandlersRef.current.forEach((handlers, eventName) => {
        if (eventName !== "message" && eventName !== "error" && handlers.size > 0) {
          const listenerKey = `_sse_listener_${eventName}`;

          if (!(eventSource as ExtendedEventSource)[listenerKey]) {
            const eventListener = (event: MessageEvent) => {
              try {
                const data = JSON.parse(event.data);
                const currentHandlers = eventHandlersRef.current.get(eventName);
                if (currentHandlers && currentHandlers.size > 0) {
                  currentHandlers.forEach((handler) => {
                    try {
                      handler(data);
                    } catch (handlerError) {
                      console.error(
                        `Error in handler for event ${eventName}:`,
                        handlerError
                      );
                    }
                  });
                }
              } catch (error) {
                console.error(`Error parsing SSE event ${eventName}:`, error);
              }
            };

            eventSource.addEventListener(eventName, eventListener);
            (eventSource as ExtendedEventSource)[listenerKey] = eventListener;
          }
        }
      });
    };

    eventSource.addEventListener("connected", () => {
      // Connection confirmed
    });

    eventSource.onopen = () => {
      originalOnOpen();
      setupEventListeners();
    };

    eventSourceRef.current = eventSource;
  }, [getSSEUrl]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const onEvent = useCallback(
    (event: string, handler: (data: unknown) => void) => {
      if (event === "message" || event === "error") {
        return;
      }

      if (!eventHandlersRef.current.has(event)) {
        eventHandlersRef.current.set(event, new Set());
      }

      const handlers = eventHandlersRef.current.get(event)!;
      handlers.add(handler);

      if (eventSourceRef.current?.readyState === EventSource.OPEN) {
        const eventSource = eventSourceRef.current;
        const listenerKey = `_sse_listener_${event}`;

        if (!(eventSource as ExtendedEventSource)[listenerKey]) {
          const eventListener = (e: MessageEvent) => {
            try {
              const data = JSON.parse(e.data);
              const currentHandlers = eventHandlersRef.current.get(event);
              if (currentHandlers && currentHandlers.size > 0) {
                currentHandlers.forEach((h) => {
                  try {
                    h(data);
                  } catch (handlerError) {
                    console.error(
                      `Error in handler for event ${event}:`,
                      handlerError
                    );
                  }
                });
              }
            } catch (error) {
              console.error(`Error parsing SSE event ${event}:`, error);
            }
          };

          eventSource.addEventListener(event, eventListener);
          (eventSource as ExtendedEventSource)[listenerKey] = eventListener;
        }
      }
    },
    []
  );

  const offEvent = useCallback(
    (event: string, handler: (data: unknown) => void) => {
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler);

        if (handlers.size === 0) {
          eventHandlersRef.current.delete(event);

          if (eventSourceRef.current?.readyState === EventSource.OPEN) {
            const eventSource = eventSourceRef.current as ExtendedEventSource;
            const listenerKey = `_sse_listener_${event}`;
            const listener = eventSource[listenerKey] as ((event: MessageEvent) => void) | undefined;

            if (listener) {
              eventSourceRef.current.removeEventListener(event, listener);
              delete eventSource[listenerKey];
            }
          }
        }
      }
    },
    []
  );

  // Auto-connect when user authenticates
  useEffect(() => {
    if (user && isAuthenticated && !isConnected) {
      connect();
    } else if (!user && isConnected) {
      disconnect();
    }
  }, [user, isAuthenticated, isConnected, connect, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: SSEContextType = {
    isConnected,
    connect,
    disconnect,
    onEvent,
    offEvent,
  };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
};
