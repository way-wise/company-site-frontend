"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatStatusText, getProjectStatusColor } from "@/lib/status-utils";
import { ArrowLeft, Calendar, Settings, Target, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectDetailsProps {
  project: any;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const router = useRouter();
  const statusColors = getProjectStatusColor(project.status);

  const getProjectStats = () => {
    const milestones = project.milestones || [];
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (m: any) => m.status === "COMPLETED"
    ).length;
    const ongoingMilestones = milestones.filter(
      (m: any) => m.status === "ONGOING"
    ).length;
    const pendingMilestones = milestones.filter(
      (m: any) => m.status === "PENDING"
    ).length;

    return {
      totalMilestones,
      completedMilestones,
      ongoingMilestones,
      pendingMilestones,
    };
  };

  const stats = getProjectStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors}>
              {formatStatusText(project.status)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {project.description || "No description provided"}
            </p>
          </Card>

          {/* Project Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Project Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalMilestones}
                </div>
                <div className="text-sm text-gray-600">Total Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedMilestones}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.ongoingMilestones}
                </div>
                <div className="text-sm text-gray-600">Ongoing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {stats.pendingMilestones}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Project Information</h3>
            <div className="space-y-4">
              {/* Owner */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Owner
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <div className="bg-primary text-primary-foreground text-xs font-medium">
                      {project.userProfile?.user?.name
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </div>
                  </Avatar>
                  <span className="text-sm">
                    {project.userProfile?.user?.name || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  <Badge className={statusColors}>
                    {formatStatusText(project.status)}
                  </Badge>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created
                </label>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Target className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Team
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Project Settings
              </Button>
            </div>
          </Card>

          {/* Team Members */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </h3>
            <div className="space-y-3">
              {/* Get unique team members from all milestones */}
              {(() => {
                const teamMembers = new Map();
                project.milestones?.forEach((milestone: any) => {
                  milestone.employeeMilestones?.forEach((em: any) => {
                    if (em.userProfile?.user) {
                      teamMembers.set(
                        em.userProfile.user.id,
                        em.userProfile.user
                      );
                    }
                  });
                });

                const members = Array.from(teamMembers.values());

                return members.length > 0 ? (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary text-primary-foreground text-xs font-medium">
                          {member.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No team members assigned
                  </div>
                );
              })()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
