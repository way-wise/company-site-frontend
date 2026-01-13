"use client";

import NewLiveProjectDetails from "@/app/dashboard/_components/new-live-project-components/new-live-project-details";
import { useNewLiveProject } from "@/hooks/useNewLiveProjectMutations";
import { useParams } from "next/navigation";

export default function NewLiveProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data, isLoading, isError } = useNewLiveProject(projectId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </div>
    );
  }

  if (isError || !data?.success || !data.data) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Failed to load project</p>
          <p className="text-sm mt-1">
            {!data?.success
              ? data?.message || "Project not found"
              : "An error occurred while loading the project"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NewLiveProjectDetails project={data.data} />
    </div>
  );
}
