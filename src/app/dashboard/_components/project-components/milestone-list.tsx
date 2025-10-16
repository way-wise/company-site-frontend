"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMilestones } from "@/hooks/useMilestoneMutations";
import { formatStatusText, getMilestoneStatusColor } from "@/lib/status-utils";
import { Milestone } from "@/types";
import { Calendar, Plus, Settings, Target, Users } from "lucide-react";
import { useState } from "react";

interface MilestoneListProps {
  projectId: string;
}

export default function MilestoneList({ projectId }: MilestoneListProps) {
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);

  const { data: milestonesData, isLoading } = useMilestones({
    page: 1,
    limit: 100,
    projectId: projectId,
  });

  const milestones = milestonesData?.data || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading milestones...</div>
        </div>
      </Card>
    );
  }

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Project Milestones ({(milestones as any)?.data?.length || 0})
        </h2>
        <Button onClick={() => setAddMilestoneOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>

      {(milestones as any)?.data?.length > 0 ? (
        <div className="space-y-4">
          {(milestones as any)?.data?.map((milestone: any) => {
            const stats = getMilestoneStats(milestone);
            const statusColors = getMilestoneStatusColor(milestone.status);

            return (
              <Card
                key={milestone.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {milestone.name}
                        </h3>
                        {milestone.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <Badge className={statusColors}>
                        {formatStatusText(milestone.status)}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{stats.totalTasks} tasks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{stats.totalEmployees} employees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        <span>{stats.totalServices} services</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(milestone.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Team Members */}
                    {milestone.employeeMilestones &&
                      milestone.employeeMilestones.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Team:</span>
                          <div className="flex -space-x-1">
                            {milestone.employeeMilestones
                              .slice(0, 5)
                              .map((em: any, index: number) => (
                                <Avatar
                                  key={index}
                                  className="h-6 w-6 border-2 border-white"
                                >
                                  <div className="bg-primary text-primary-foreground text-xs font-medium">
                                    {em.userProfile?.user?.name
                                      ?.charAt(0)
                                      .toUpperCase() || "?"}
                                  </div>
                                </Avatar>
                              ))}
                            {milestone.employeeMilestones.length > 5 && (
                              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  +{milestone.employeeMilestones.length - 5}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Services */}
                    {milestone.serviceMilestones &&
                      milestone.serviceMilestones.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Services:
                          </span>
                          <div className="flex gap-1">
                            {milestone.serviceMilestones
                              .slice(0, 3)
                              .map((sm: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {sm.service?.name || "Unknown Service"}
                                </Badge>
                              ))}
                            {milestone.serviceMilestones.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{milestone.serviceMilestones.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      View Tasks
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No milestones yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first milestone for this project.
          </p>
          <Button onClick={() => setAddMilestoneOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create First Milestone
          </Button>
        </div>
      )}

      {/* Add Milestone Modal - TODO: Implement */}
      {addMilestoneOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Milestone</h2>
            <p className="text-gray-600 mb-4">
              This feature will be implemented in the next phase.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setAddMilestoneOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
