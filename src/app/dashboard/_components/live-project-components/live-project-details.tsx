"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveProject } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper function to format date
const formatDateHelper = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    ON_HOLD: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge
      className={colors[status] || "bg-gray-100 text-gray-800"}
      variant="outline"
    >
      {status}
    </Badge>
  );
};

const getProjectTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    FIXED: "bg-purple-100 text-purple-800",
    HOURLY: "bg-blue-100 text-blue-800",
    MONTHLY: "bg-indigo-100 text-indigo-800",
    CUSTOM: "bg-pink-100 text-pink-800",
  };
  return (
    <Badge
      className={colors[type] || "bg-gray-100 text-gray-800"}
      variant="outline"
    >
      {type}
    </Badge>
  );
};

interface LiveProjectDetailsProps {
  liveProject: LiveProject;
}

export default function LiveProjectDetails({
  liveProject,
}: LiveProjectDetailsProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Go Back</span>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
              Project Name
            </h4>
            <p className="text-base font-medium">{liveProject.projectName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Client Name
              </h4>
              <p className="text-base font-medium">{liveProject.clientName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Location
              </h4>
              <p className="text-base">{liveProject.clientLocation || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Project Type
              </h4>
              <div className="mt-1">
                {getProjectTypeBadge(liveProject.projectType)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Status
              </h4>
              <div className="mt-1">
                {getStatusBadge(liveProject.projectStatus)}
              </div>
            </div>
          </div>

          {liveProject.projectType !== "HOURLY" && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                Financial Information
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h5 className="text-xs text-muted-foreground mb-1">Budget</h5>
                  <p className="text-lg font-semibold">
                    ${(liveProject.projectBudget || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs text-muted-foreground mb-1">Paid Amount</h5>
                  <p className="text-lg font-semibold text-green-600">
                    ${(liveProject.paidAmount ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs text-muted-foreground mb-1">Due Amount</h5>
                  <p className="text-lg font-semibold text-orange-600">
                    ${(liveProject.dueAmount ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <h5 className="text-xs text-muted-foreground mb-1">Remaining</h5>
                <p
                  className={`text-lg font-semibold ${
                    (liveProject.projectBudget || 0) - (liveProject.paidAmount ?? 0) > 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  ${(
                    (liveProject.projectBudget || 0) -
                    (liveProject.paidAmount ?? 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {liveProject.projectType === "HOURLY" && liveProject.hourlyRate && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Hourly Rate
              </h4>
              <p className="text-lg font-semibold">
                ${liveProject.hourlyRate.toLocaleString()}/hour
              </p>
            </div>
          )}

          {(liveProject.deadline || liveProject.progress !== undefined) && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                Project Timeline & Progress
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {liveProject.deadline && (
                  <div>
                    <h5 className="text-xs text-muted-foreground mb-1">Deadline</h5>
                    <p className="text-base">
                      {new Date(liveProject.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {liveProject.progress !== undefined &&
                  liveProject.progress !== null && (
                    <div>
                      <h5 className="text-xs text-muted-foreground mb-1">Progress</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${liveProject.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {liveProject.progress}%
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {liveProject.assignedMembers && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Assigned Members
              </h4>
              <p className="text-base">{liveProject.assignedMembers}</p>
            </div>
          )}

          {liveProject.nextActions && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Next Actions
              </h4>
              <p className="text-base whitespace-pre-wrap">
                {liveProject.nextActions}
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-muted-foreground mb-1">
                  Created At
                </h4>
                <p>{formatDateHelper(liveProject.createdAt)}</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground mb-1">
                  Updated At
                </h4>
                <p>{formatDateHelper(liveProject.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

