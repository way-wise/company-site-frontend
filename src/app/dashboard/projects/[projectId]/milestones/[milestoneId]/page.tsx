"use client";

import MilestoneDetails from "@/app/dashboard/_components/milestone-components/milestone-details";
import MilestoneTasksView from "@/app/dashboard/_components/milestone-components/milestone-tasks-view";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useMilestone } from "@/hooks/useMilestoneMutations";
import { useProject } from "@/hooks/useProjectMutations";
import { useParams } from "next/navigation";

export default function MilestoneDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const milestoneId = params.milestoneId as string;

  const { data: projectData, isLoading: projectLoading } =
    useProject(projectId);
  const { data: milestoneData, isLoading: milestoneLoading } =
    useMilestone(milestoneId);

  if (projectLoading || milestoneLoading) {
    return (
      <PermissionGuard permissions={["read_milestone"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading milestone details...</div>
        </div>
      </PermissionGuard>
    );
  }

  if (!projectData?.data || !milestoneData?.data) {
    return (
      <PermissionGuard permissions={["read_milestone"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Milestone or project not found</div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permissions={["read_milestone"]}>
      <div className="space-y-6">
        <MilestoneDetails
          milestone={milestoneData.data}
          project={projectData.data}
        />
        <MilestoneTasksView milestoneId={milestoneId} projectId={projectId} />
      </div>
    </PermissionGuard>
  );
}
