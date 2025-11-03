"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  permissions?: string[];
  requireAll?: boolean; // If true, require all permissions; if false, require any
  roles?: string[];
  requireAllRoles?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const PermissionGuard = ({
  children,
  permissions = [],
  requireAll = false,
  roles = [],
  requireAllRoles = false,
  fallback,
  redirectTo,
}: PermissionGuardProps) => {
  const {
    isLoading,
    isAuthenticated,
    // hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  // Check role requirements
  if (roles.length > 0) {
    const hasRequiredRole = requireAllRoles
      ? roles.every((role) => hasRole(role))
      : hasAnyRole(roles);

    if (!hasRequiredRole) {
      if (fallback) return <>{fallback}</>;
      return null;
    }
  }

  // Check permission requirements
  if (permissions.length > 0) {
    const hasRequiredPermission = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermission) {
      if (fallback) return <>{fallback}</>;
      return null;
    }
  }

  return <>{children}</>;
};

// Hook for conditional rendering based on permissions
export const usePermissionCheck = () => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = useAuth();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
};
