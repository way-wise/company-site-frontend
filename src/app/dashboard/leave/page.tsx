"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { leaveBalanceQueryKeys } from "@/hooks/useLeaveBalanceMutations";
import { leaveQueryKeys } from "@/hooks/useLeaveMutations";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AllocateYearlyLeaveModal from "../_components/leave-components/allocate-yearly-leave-modal";
import ApplyLeaveModal from "../_components/leave-components/apply-leave-modal";
import { LeaveBalanceCard } from "../_components/leave-components/leave-balance-card";
import LeaveStats from "../_components/leave-components/leave-stats";
import { LeaveSummaryTable } from "../_components/leave-components/leave-summary-table";
import { LeaveTable } from "../_components/leave-components/leave-table";

export default function LeavePage() {
  const { user, hasPermission, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canViewAllLeaves = !isAuthLoading && hasPermission("view_team_leaves");
  const canViewStats = !isAuthLoading && hasPermission("view_team_leaves");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch all leave-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.all }),
        queryClient.refetchQueries({ queryKey: leaveQueryKeys.all }),
        queryClient.refetchQueries({ queryKey: leaveBalanceQueryKeys.all }),
      ]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <PermissionGuard permissions={["read_leave"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leave Management", current: true },
          ]}
        />

        {/* Stats - Only for admins */}
        {canViewStats && <LeaveStats />}

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <PermissionGuard permissions={["manage_leave_balance"]}>
              <Button
                variant="outline"
                onClick={() => setAllocateModalOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Allocate Yearly Leave
              </Button>
            </PermissionGuard>
            <PermissionGuard permissions={["create_leave"]}>
              <Button onClick={() => setApplyLeaveModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {user?.userProfile?.id && (
          <div className="space-y-6">
            {/* Leave Balance Card - Always visible for logged-in users */}
            <LeaveBalanceCard
              userProfileId={user.userProfile.id}
              year={new Date().getFullYear()}
            />

            {/* Conditional Layout: Different for Admin vs Employee */}
            {canViewAllLeaves ? (
              // Admin View: Summary Table + All Leaves Table
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LeaveSummaryTable />
                <div className="lg:col-span-2">
                  <LeaveTable />
                </div>
              </div>
            ) : (
              // Employee View: Only My Leaves Table (full width)
              <LeaveTable />
            )}
          </div>
        )}

        <ApplyLeaveModal
          isOpen={applyLeaveModalOpen}
          onClose={() => setApplyLeaveModalOpen(false)}
        />
        <AllocateYearlyLeaveModal
          isOpen={allocateModalOpen}
          onClose={() => setAllocateModalOpen(false)}
        />
      </div>
    </PermissionGuard>
  );
}
