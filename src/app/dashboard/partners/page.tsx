import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PartnersTable } from "../_components/partners-components/partners-table";

const PartnersPage = async () => {
  return (
    <PermissionGuard
      permissions={["read_partner", "create_partner"]}
      requireAll={false}
    >
      <PartnersTable />
    </PermissionGuard>
  );
};

export default PartnersPage;

