import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ProjectTable } from "../_components/project-components/project-table";

const ProjectsPage = async () => {
  return (
    <PermissionGuard
      permissions={["read_project", "create_project"]}
      requireAll={false}
    >
      <ProjectTable />
    </PermissionGuard>
  );
};

export default ProjectsPage;
