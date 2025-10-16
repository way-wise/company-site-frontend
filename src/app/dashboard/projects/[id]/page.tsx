"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useProject } from "@/hooks/useProjectMutations";
import { useParams } from "next/navigation";
import MilestoneList from "../../_components/project-components/milestone-list";
import ProjectDetails from "../../_components/project-components/project-details";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: projectData, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <PermissionGuard permissions={["read_project"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading project details...</div>
        </div>
      </PermissionGuard>
    );
  }

  if (!projectData?.data) {
    return (
      <PermissionGuard permissions={["read_project"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Project not found</div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permissions={["read_project"]}>
      <div className="space-y-6">
        <ProjectDetails project={projectData.data} />
        <MilestoneList projectId={projectId} />
      </div>
    </PermissionGuard>
  );
}
