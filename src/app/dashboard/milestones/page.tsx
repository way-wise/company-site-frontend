"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import MilestoneTable from "../_components/milestone-components/milestone-table";

export default function MilestonesPage() {
  return (
    <PermissionGuard permissions={["read_milestone"]}>
      <div className="space-y-6">
        <MilestoneTable />
      </div>
    </PermissionGuard>
  );
}
