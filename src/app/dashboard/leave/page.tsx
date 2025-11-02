"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { Plus } from "lucide-react";
import { useState } from "react";
import ApplyLeaveModal from "../_components/leave-components/apply-leave-modal";
import { LeaveBalanceCard } from "../_components/leave-components/leave-balance-card";
import { LeaveTable } from "../_components/leave-components/leave-table";

export default function LeavePage() {
  const { user } = useAuth();
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState(false);

  return (
    <PermissionGuard permissions={["read_leave"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leave Management", current: true },
          ]}
        />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <PermissionGuard permissions={["create_leave"]}>
            <Button onClick={() => setApplyLeaveModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </PermissionGuard>
        </div>

        {user?.userProfile?.id && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LeaveBalanceCard
                userProfileId={user.userProfile.id}
                year={new Date().getFullYear()}
              />
            </div>
            <div className="lg:col-span-2">
              <LeaveTable />
            </div>
          </div>
        )}

        <ApplyLeaveModal
          isOpen={applyLeaveModalOpen}
          onClose={() => setApplyLeaveModalOpen(false)}
        />
      </div>
    </PermissionGuard>
  );
}
