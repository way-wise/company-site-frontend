"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatStatusText, getTaskPriorityColor } from "@/lib/status-utils";
import { Task } from "@/types";
import { Clock, Users } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors = getTaskPriorityColor(task.priority);
  // const statusColors = getTaskStatusColor(task.status);

  // Get border color class based on priority
  const getBorderColorClass = () => {
    if (priorityColors.includes("red")) return "border-l-red-500";
    if (priorityColors.includes("orange")) return "border-l-orange-500";
    if (priorityColors.includes("blue")) return "border-l-blue-500";
    return "border-l-gray-500";
  };

  return (
    <Card
      className={`p-2.5 cursor-pointer hover:shadow-md transition-shadow bg-white border-l-4 ${getBorderColorClass()}`}
      onClick={onClick}
    >
      <div className="space-y-1.5">
        {/* Header with priority badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-xs text-gray-900 line-clamp-2 leading-tight">
            {task.title}
          </h3>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors} shrink-0`}>
            {formatStatusText(task.priority)}
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[11px] text-gray-600 line-clamp-1 leading-tight">
            {task.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-1" />
        </div>

        {/* Bottom row: Time and Assignees */}
        <div className="flex items-center justify-between">
          {/* Time tracking */}
          {task.estimatedHours ? (
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Clock className="h-2.5 w-2.5" />
              <span>{task.estimatedHours}h</span>
            </div>
          ) : (
            <div />
          )}

          {/* Assignees */}
          {task.assignments && task.assignments.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-2.5 w-2.5 text-gray-400" />
              <div className="flex -space-x-1">
                {task.assignments.slice(0, 2).map((assignment, index) => (
                  <Avatar key={index} className="h-5 w-5 border border-white">
                    <div className="bg-primary text-primary-foreground text-[9px] font-medium">
                      {assignment.userProfile?.user?.name
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </div>
                  </Avatar>
                ))}
                {task.assignments.length > 2 && (
                  <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center">
                    <span className="text-[9px] text-gray-600">
                      +{task.assignments.length - 2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comments count */}
        {task._count?.comments && task._count.comments > 0 && (
          <div className="text-[10px] text-gray-500 pt-0.5 border-t border-gray-100">
            {task._count.comments} comment
            {task._count.comments !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </Card>
  );
}
