"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
  requireAll?: boolean; // If true, require all roles; if false, require any
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  roles,
  requireAll = false,
  fallback,
  redirectTo,
}: RoleGuardProps) => {
  const { isLoading, isAuthenticated, hasRole, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  // Check role requirements
  const hasRequiredRole = requireAll
    ? roles.every((role) => hasRole(role))
    : hasAnyRole(roles);

  if (!hasRequiredRole) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don&apos;t have the required role to access this content.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
