"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import MilestoneTable from "../_components/milestone-components/milestone-table";

export default function MilestonesPage() {
  return (
    <PermissionGuard permissions={["read_milestone"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Projects", href: "/dashboard/projects" },
            { label: "All Milestones", current: true },
          ]}
        />
        <MilestoneTable />
      </div>
    </PermissionGuard>
  );
}
