"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatStatusText,
  getTaskPriorityColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import { Task } from "@/types";
import { Clock, Users } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors = getTaskPriorityColor(task.priority);
  const statusColors = getTaskStatusColor(task.status);

  // Get border color class based on priority
  const getBorderColorClass = () => {
    if (priorityColors.includes("red")) return "border-l-red-500";
    if (priorityColors.includes("orange")) return "border-l-orange-500";
    if (priorityColors.includes("blue")) return "border-l-blue-500";
    return "border-l-gray-500";
  };

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow bg-white border-l-4 ${getBorderColorClass()}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with priority badge */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
            {task.title}
          </h3>
          <Badge variant="outline" className={`text-xs ${priorityColors}`}>
            {formatStatusText(task.priority)}
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Time tracking */}
        {(task.estimatedHours || task.spentHours) && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {task.spentHours || 0}h / {task.estimatedHours || 0}h
            </span>
          </div>
        )}

        {/* Assignees */}
        {task.assignments && task.assignments.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-400" />
            <div className="flex -space-x-1">
              {task.assignments.slice(0, 3).map((assignment, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <div className="bg-primary text-primary-foreground text-xs font-medium">
                    {assignment.userProfile?.user?.name
                      ?.charAt(0)
                      .toUpperCase() || "?"}
                  </div>
                </Avatar>
              ))}
              {task.assignments.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{task.assignments.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestone info */}
        {task.milestone && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Milestone:</span>{" "}
            {task.milestone.name}
          </div>
        )}

        {/* Comments count */}
        {task._count?.comments && task._count.comments > 0 && (
          <div className="text-xs text-gray-500">
            {task._count.comments} comment
            {task._count.comments !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </Card>
  );
}
