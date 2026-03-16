"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { SeoTable } from "./_components/seo-table";

const DashboardSeoPage = () => {
  return (
    <PermissionGuard permissions={["manage_seo"]} requireAll={false}>
      <div className="space-y-6">
        <SeoTable />
      </div>
    </PermissionGuard>
  );
};

export default DashboardSeoPage;
