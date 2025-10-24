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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Refresh user data from server
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get("/auth/me");

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);

        // Fetch user permissions if user exists
        if (userData?.id) {
          try {
            const permissionsResponse = await apiClient.get(
              `/roles/user/${userData.id}/permissions`
            );
            if (permissionsResponse.data.success) {
              setPermissions(permissionsResponse.data.data || []);
            }
          } catch (error) {
            console.error("Failed to fetch user permissions:", error);
            setPermissions([]);
          }
        }

        return userData;
      } else {
        setUser(null);
        setPermissions([]);
        return null;
      }
    } catch (error: unknown) {
      console.error("Auth check failed:", error);

      // Only clear user state if it's an authentication error (401/403)
      // Don't clear on network errors or other issues
      const errorWithResponse = error as { response?: { status?: number } };
      if (
        errorWithResponse?.response?.status === 401 ||
        errorWithResponse?.response?.status === 403
      ) {
        setUser(null);
        setPermissions([]);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    setPermissions([]);
  }, []);

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      return permissions.some((p) => p.name === permissionName);
    },
    [permissions]
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissionNames: string[]): boolean => {
      return permissions.some((p) => permissionNames.includes(p.name));
    },
    [permissions]
  );

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback(
    (permissionNames: string[]): boolean => {
      return permissionNames.every((name) =>
        permissions.some((p) => p.name === name)
      );
    },
    [permissions]
  );

  // Check if user has a specific role
  const hasRole = useCallback(
    (roleName: string): boolean => {
      return user?.roles?.some((r) => r.role.name === roleName) || false;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roleNames: string[]): boolean => {
      return user?.roles?.some((r) => roleNames.includes(r.role.name)) || false;
    },
    [user]
  );

  // Initialize auth on mount
  useEffect(() => {
    // List of routes that don't require auth check
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/about",
      "/contact",
      "/services",
    ];

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some(
        (route) => currentPath === route || currentPath.startsWith(route + "/")
      );

      if (!isPublicRoute) {
        refreshUser();
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
