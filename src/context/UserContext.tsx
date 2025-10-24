"use client";

import apiClient from "@/lib/axios";
import { Permission, User } from "@/types";
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
  logout: () => void;
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

const fetchUserPermissions = async (userId: string): Promise<Permission[]> => {
  try {
    const response = await apiClient.get(`/roles/user/${userId}/permissions`);
    return response.data.success ? response.data.data || [] : [];
  } catch {
    return [];
  }
};

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);

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

      if (userData?.id) {
        const userPermissions = await fetchUserPermissions(userData.id);
        setPermissions(userPermissions);
      }

      return userData;
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setPermissions([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPermissions([]);
  }, []);

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
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    if (isPublicRoute(currentPath)) {
      setIsLoading(false);
    } else {
      refreshUser();
    }
  }, [refreshUser]);

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
