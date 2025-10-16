import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { UsersTable } from "../_components/user-components/users-table";

const UsersPage = async () => {
  return (
    <PermissionGuard
      permissions={["read_user", "create_user"]}
      requireAll={false}
    >
      <UsersTable />
    </PermissionGuard>
  );
};

export default UsersPage;
