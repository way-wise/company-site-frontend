import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { LeaveTable } from "../_components/leave-components/leave-table";
const page = () => {
  return (
    <PermissionGuard permissions={["read_leave"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Leave Management", href: "/dashboard/leave_management" },
            { label: "All Leaves", current: true },
          ]}
        />
        <LeaveTable />
      </div>
    </PermissionGuard>
  );
};

export default page;
