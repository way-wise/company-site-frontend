import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ServiceTable } from "../_components/services-components/service-table";

const ServicesPage = async () => {
  return (
    <PermissionGuard
      permissions={["read_service", "create_service"]}
      requireAll={false}
    >
      <ServiceTable />
    </PermissionGuard>
  );
};

export default ServicesPage;
