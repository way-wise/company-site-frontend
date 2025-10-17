"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { formatStatusText, getMilestoneStatusColor } from "@/lib/status-utils";
import { Milestone } from "@/types";
import {
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Settings,
  Users,
} from "lucide-react";

interface MilestoneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export default function MilestoneDetailModal({
  isOpen,
  onClose,
  milestone,
}: MilestoneDetailModalProps) {
  if (!milestone) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = getMilestoneStatusColor(status);
    return (
      <Badge className={`${colors} border`} variant="secondary">
        {formatStatusText(status)}
      </Badge>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const statusColors = {
      TODO: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      BLOCKED: "bg-red-100 text-red-800",
      REVIEW: "bg-yellow-100 text-yellow-800",
      DONE: "bg-green-100 text-green-800",
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={
          priorityColors[priority as keyof typeof priorityColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {priority}
      </Badge>
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {milestone.name}
          </ModalTitle>
        </ModalHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              {getStatusBadge(milestone.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {milestone.description || "No description provided"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Project
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {milestone.project?.name || "No project assigned"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(milestone.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDateTime(milestone.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assigned Employees */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assigned Employees ({milestone.employeeMilestones?.length || 0})
            </h3>

            {milestone.employeeMilestones &&
            milestone.employeeMilestones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {milestone.employeeMilestones.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {employee.userProfile?.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.userProfile?.user?.email || "No email"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {employee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No employees assigned to this milestone
              </p>
            )}
          </div>

          <Separator />

          {/* Assigned Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Assigned Services ({milestone.serviceMilestones?.length || 0})
            </h3>

            {milestone.serviceMilestones &&
            milestone.serviceMilestones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {milestone.serviceMilestones.map((service) => (
                  <div
                    key={service.id}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <p className="font-medium text-sm">
                      {service.service?.name || "Unknown Service"}
                    </p>
                    {service.service?.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {service.service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No services assigned to this milestone
              </p>
            )}
          </div>

          <Separator />

          {/* Tasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks ({milestone.Task?.length || 0})
            </h3>

            {milestone.Task && milestone.Task.length > 0 ? (
              <div className="space-y-3">
                {milestone.Task.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex gap-2">
                        {getTaskStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mb-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Progress: {task.progress}%</span>
                        {task.estimatedHours && (
                          <span>Est: {task.estimatedHours}h</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(task.createdAt)}
                      </div>
                    </div>

                    {task.assignments && task.assignments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Assigned to:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {task.assignments.map((assignment) => (
                            <Badge
                              key={assignment.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {assignment.userProfile?.user?.name || "Unknown"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No tasks created for this milestone
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
