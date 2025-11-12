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

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/services",
];

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const pathname = usePathname();

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Logout request failed:", error);
      }
    } finally {
      setUser(null);
      setPermissions([]);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get("/auth/me");

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

      if (axiosError.response?.status === 401) {
        await logout();
        return null;
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("Auth check failed:", error);
      }
      await logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

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

    if (isPublicRoute(pathname)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void refreshUser();
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
