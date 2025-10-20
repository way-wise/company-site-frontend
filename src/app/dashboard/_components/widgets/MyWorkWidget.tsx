"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMilestones } from "@/hooks/useMilestoneMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { useTasks } from "@/hooks/useTaskMutations";
import {
  formatStatusText,
  getMilestoneStatusColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import {
  Activity,
  CheckSquare,
  Clock,
  ExternalLink,
  FolderOpen,
  Plus,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string, type: "task" | "milestone") => {
  const colors =
    type === "task"
      ? getTaskStatusColor(status)
      : getMilestoneStatusColor(status);
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${colors}`}
    >
      {formatStatusText(status)}
    </span>
  );
};

export default function MyWorkWidget() {
  const [activeTab, setActiveTab] = useState<
    "tasks" | "milestones" | "projects" | "activity"
  >("tasks");

  // Fetch data
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    page: 1,
    limit: 10,
    // Note: In a real app, this would filter by current user
  });

  const { data: milestonesData, isLoading: milestonesLoading } = useMilestones({
    page: 1,
    limit: 10,
    // Note: In a real app, this would filter by current user
  });

  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    page: 1,
    limit: 10,
    // Note: In a real app, this would filter by current user
  });

  const tasks = tasksData?.data?.result || [];
  const milestones = milestonesData?.data?.result || [];
  const projects = projectsData?.data?.result || [];

  // Calculate stats
  const myTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(
    (task) => task.status === "DONE"
  ).length;
  const myMilestonesCount = milestones.length;
  const completedMilestonesCount = milestones.filter(
    (milestone) => milestone.status === "COMPLETED"
  ).length;
  const myProjectsCount = projects.length;

  const tabs = [
    { id: "tasks", label: "My Tasks", count: myTasksCount, icon: CheckSquare },
    {
      id: "milestones",
      label: "My Milestones",
      count: myMilestonesCount,
      icon: Target,
    },
    {
      id: "projects",
      label: "My Projects",
      count: myProjectsCount,
      icon: FolderOpen,
    },
    { id: "activity", label: "Recent Activity", count: 0, icon: Activity },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          My Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* My Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Tasks</h3>
                <Button size="sm" asChild>
                  <Link href="/dashboard/tasks">
                    <Plus className="h-4 w-4 mr-1" />
                    View All
                  </Link>
                </Button>
              </div>

              {tasksLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks assigned to you</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {task.title}
                          </h4>
                          {getStatusBadge(task.status, "task")}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Progress: {task.progress}%</span>
                          {task.estimatedHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.estimatedHours}h
                            </span>
                          )}
                          {task.milestone?.project && (
                            <span>{task.milestone.project.name}</span>
                          )}
                        </div>
                        <Progress value={task.progress} className="h-1 mt-2" />
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/projects/${task.milestone?.project?.id}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Milestones Tab */}
          {activeTab === "milestones" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Milestones</h3>
                <Button size="sm" asChild>
                  <Link href="/dashboard/milestones">
                    <Plus className="h-4 w-4 mr-1" />
                    View All
                  </Link>
                </Button>
              </div>

              {milestonesLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading milestones...
                </div>
              ) : milestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No milestones assigned to you</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {milestones.slice(0, 5).map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {milestone.name}
                          </h4>
                          {getStatusBadge(milestone.status, "milestone")}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tasks: {milestone._count?.Task || 0}</span>
                          <span>
                            Created: {formatDate(milestone.createdAt)}
                          </span>
                          {milestone.project && (
                            <span>{milestone.project.name}</span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/projects/${milestone.project?.id}/milestones/${milestone.id}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Projects</h3>
                <Button size="sm" asChild>
                  <Link href="/dashboard/projects">
                    <Plus className="h-4 w-4 mr-1" />
                    View All
                  </Link>
                </Button>
              </div>

              {projectsLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No projects assigned to you</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {project.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Milestones: {project._count?.milestones || 0}
                          </span>
                          <span>Created: {formatDate(project.createdAt)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Activity feed coming soon</p>
                <p className="text-sm">Track your recent actions and updates</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
