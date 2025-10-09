"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "CLIENT" | "ADMIN";
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  fallback = null,
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (requiredRole && !user?.roles?.some((r) => r.name === requiredRole)) {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  if (requiredRole && !user?.roles?.some((r) => r.name === requiredRole)) {
    return fallback;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
