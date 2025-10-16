import { PermissionGuard } from "@/components/auth/PermissionGuard";
import UserDetails from "../../_components/user-components/user-details";

const UserDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <PermissionGuard permissions={["read_user"]} requireAll={false}>
      <UserDetails id={id} />
    </PermissionGuard>
  );
};

export default UserDetailsPage;
