"use client";

import { subscribeToAuthLogout } from "@/lib/auth-events";
import apiClient from "@/lib/axios";
import { Permission, User } from "@/types";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  permissions: Permission[];
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissionNames: string[]) => boolean;
  hasAllPermissions: (permissionNames: string[]) => boolean;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Match the protected prefixes from middleware.ts
const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/admin", "/client"];

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const pathname = usePathname();
  const abortControllerRef = useRef<AbortController | null>(null);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Logout request failed
    } finally {
      setUser(null);
      setPermissions([]);
    }
  }, []);

  const refreshUser = useCallback(
    async (signal?: AbortSignal): Promise<User | null> => {
      try {
        const response = await apiClient.get("/auth/me", { signal });

        if (!response.data.success) {
          setUser(null);
          setPermissions([]);
          return null;
        }

        const userData = response.data.data;
        setUser(userData);

        // Extract permissions from user data (already included in /auth/me response)
        if (userData?.permissions && Array.isArray(userData.permissions)) {
          setPermissions(userData.permissions);
        } else {
          setPermissions([]);
        }

        return userData;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Don't handle aborted requests
        if (axiosError.name === "CanceledError" || signal?.aborted) {
          return null;
        }

        if (axiosError.response?.status === 401) {
          await logout();
          return null;
        }
        // Auth check failed
        await logout();
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const unsubscribe = subscribeToAuthLogout(() => {
      void logout();
    });

    return () => {
      unsubscribe();
    };
  }, [logout]);

  const hasPermission = useCallback(
    (permissionName: string): boolean =>
      permissions.some((p) => p.name === permissionName),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (permissionNames: string[]): boolean =>
      permissions.some((p) => permissionNames.includes(p.name)),
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (permissionNames: string[]): boolean =>
      permissionNames.every((name) => permissions.some((p) => p.name === name)),
    [permissions]
  );

  const hasRole = useCallback(
    (roleName: string): boolean =>
      user?.roles?.some((r) => r.role.name === roleName) || false,
    [user]
  );

  const hasAnyRole = useCallback(
    (roleNames: string[]): boolean =>
      user?.roles?.some((r) => roleNames.includes(r.role.name)) || false,
    [user]
  );

  useEffect(() => {
    if (!pathname) return;

    // Only fetch user data for protected routes
    if (!isProtectedRoute(pathname)) {
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight request from previous route
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this route
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    refreshUser(abortController.signal);

    // Cleanup: abort on unmount or route change
    return () => {
      abortController.abort();
    };
  }, [pathname, refreshUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    permissions,
    setUser,
    logout,
    refreshUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
