"use client";

import { useAuth } from "@/context/UserContext";
import Link from "next/link";
import AdminWidgets from "./_components/widgets/AdminWidgets";
import ClientWidgets from "./_components/widgets/ClientWidgets";
import EmployeeWidgets from "./_components/widgets/EmployeeWidgets";
import MyWorkWidget from "./_components/widgets/MyWorkWidget";

const DashboardPage = () => {
  const { user, isLoading, hasAnyRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Determine which widgets to show based on user role
  const isAdmin = hasAnyRole(["SUPER_ADMIN", "ADMIN"]);
  const isClient = hasAnyRole(["CLIENT"]);
  const isEmployee = hasAnyRole(["EMPLOYEE"]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin && "Manage your system and monitor activities."}
          {isClient && "View your projects and track progress."}
          {isEmployee && "Track your tasks and manage your work."}
          {!isAdmin && !isClient && !isEmployee && "Welcome to your dashboard."}
        </p>
      </div>

      {/* My Work Widget - Universal for all users */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MyWorkWidget />
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/projects"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  View All Projects
                </Link>
                <Link
                  href="/dashboard/tasks"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  View All Tasks
                </Link>
                <Link
                  href="/dashboard/milestones"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  View All Milestones
                </Link>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Recent Updates</h3>
              <div className="text-sm text-gray-600">
                <p>No recent updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Widgets */}
      <div>
        {isAdmin && <AdminWidgets />}
        {isClient && <ClientWidgets />}
        {isEmployee && <EmployeeWidgets />}
      </div>
    </div>
  );
};

export default DashboardPage;
