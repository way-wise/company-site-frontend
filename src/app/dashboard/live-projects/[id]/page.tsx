"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useLiveProject } from "@/hooks/useLiveProjectMutations";
import { useParams } from "next/navigation";
import LiveProjectDetails from "@/app/dashboard/_components/live-project-components/live-project-details";

export default function LiveProjectDetailsPage() {
  const params = useParams();
  const liveProjectId = params.id as string;

  const { data: liveProjectData, isLoading } = useLiveProject(liveProjectId);

  if (isLoading) {
    return (
      <PermissionGuard permissions={["read_live_project"]} requireAll={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading live project details...</div>
        </div>
      </PermissionGuard>
    );
  }

  if (!liveProjectData?.data) {
    return (
      <PermissionGuard permissions={["read_live_project"]} requireAll={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Live project not found</div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permissions={["read_live_project"]} requireAll={false}>
      <LiveProjectDetails liveProject={liveProjectData.data} />
    </PermissionGuard>
  );
}

