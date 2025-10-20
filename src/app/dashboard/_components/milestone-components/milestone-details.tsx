"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatStatusText, getMilestoneStatusColor } from "@/lib/status-utils";
import { Milestone, Project } from "@/types";
import {
  Calendar,
  Edit,
  MoreVertical,
  Settings,
  Target,
  Trash,
  Users,
} from "lucide-react";

interface MilestoneDetailsProps {
  milestone: Milestone;
  project: Project;
}

export default function MilestoneDetails({
  milestone,
  project,
}: MilestoneDetailsProps) {
  const getMilestoneStats = (milestone: Milestone) => {
    const totalTasks = milestone._count?.Task || 0;
    const totalEmployees = milestone._count?.employeeMilestones || 0;
    const totalServices = milestone._count?.serviceMilestones || 0;

    return {
      totalTasks,
      totalEmployees,
      totalServices,
    };
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    const tasks = milestone.Task || [];
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) => task.status === "DONE"
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const stats = getMilestoneStats(milestone);
  const progress = getMilestoneProgress(milestone);
  const statusColors = getMilestoneStatusColor(milestone.status);

  return (
    <Card className="p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Projects", href: "/dashboard/projects" },
          { label: project.name, href: `/dashboard/projects/${project.id}` },
          { label: milestone.name, current: true },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {milestone.name}
              </h1>
              {milestone.description && (
                <p className="text-gray-600 leading-relaxed">
                  {milestone.description}
                </p>
              )}
            </div>
            <Badge className={statusColors}>
              {formatStatusText(milestone.status)}
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-gray-900">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-gray-500">
              {stats.totalTasks} tasks total
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tasks</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalTasks}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Team Members
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalEmployees}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Services
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalServices}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Created
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {new Date(milestone.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-6">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Team Members */}
      {milestone.employeeMilestones &&
        milestone.employeeMilestones.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Team Members
            </h3>
            <div className="flex flex-wrap gap-3">
              {milestone.employeeMilestones.map((em: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-primary-foreground text-sm font-medium">
                      {em.userProfile?.user?.name?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {em.userProfile?.user?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {em.userProfile?.user?.email || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Services */}
      {milestone.serviceMilestones &&
        milestone.serviceMilestones.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assigned Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {milestone.serviceMilestones.map((sm: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  {sm.service?.name || "Unknown Service"}
                </Badge>
              ))}
            </div>
          </div>
        )}
    </Card>
  );
}
