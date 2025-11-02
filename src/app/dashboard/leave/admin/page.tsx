"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaveStats } from "@/hooks/useLeaveMutations";
import {
  BarChart3,
  CalendarCheck,
  CalendarX,
  Clock,
  TrendingUp,
} from "lucide-react";
import { LeaveTable } from "../../_components/leave-components/leave-table";

export default function AdminLeavePage() {
  const { data: statsData, isLoading: isStatsLoading } = useLeaveStats();

  const stats = statsData?.data;

  return (
    <PermissionGuard permissions={["view_team_leaves"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leave Management", href: "/dashboard/leave" },
            { label: "Admin View", current: true },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Leave Management - Admin View</h1>
        </div>

        {/* Statistics Cards */}
        {!isStatsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CalendarCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <CalendarX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {stats.cancelled}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leave Applications Table */}
        <div className="mt-6">
          <LeaveTable />
        </div>
      </div>
    </PermissionGuard>
  );
}

