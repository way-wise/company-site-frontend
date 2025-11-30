"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  User,
  XCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/UserContext";
import { useUpdateTask } from "@/hooks/useTaskMutations";
import TaskCommentSection from "./task-comment-section";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  BLOCKED: "bg-red-100 text-red-800",
  REVIEW: "bg-orange-100 text-orange-800",
  DONE: "bg-green-100 text-green-800",
};

const priorityColors = {
  LOW: "bg-slate-100 text-slate-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

const priorityIcons = {
  LOW: null,
  MEDIUM: null,
  HIGH: <AlertCircle className="w-3 h-3" />,
  CRITICAL: <XCircle className="w-3 h-3" />,
};

export default function TaskDetailsModal({
  task,
  open,
  onOpenChange,
}: TaskDetailsModalProps) {
  const { hasPermission } = useAuth();
  const canUpdateTask = hasPermission("update_task");
  const updateTaskMutation = useUpdateTask();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localProgress, setLocalProgress] = useState(task?.progress || 0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update local progress when task changes
  useEffect(() => {
    if (task) {
      setLocalProgress(task.progress);
    }
  }, [task?.progress, task]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!task) return null;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!canUpdateTask || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: { status: newStatus },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProgressChange = (newProgress: number) => {
    if (!canUpdateTask) return;
    
    // Update local state immediately for smooth UI
    setLocalProgress(newProgress);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to update API after 500ms of no changes
    debounceTimerRef.current = setTimeout(async () => {
      setIsUpdating(true);
      try {
        await updateTaskMutation.mutateAsync({
          taskId: task.id,
          taskData: { progress: newProgress },
        });
      } finally {
        setIsUpdating(false);
      }
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {task.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        {/* Breadcrumb Navigation */}
        {task.milestone && (
          <Breadcrumb
            items={[
              { label: "Projects", href: "/dashboard/projects" },
              {
                label: task.milestone.project?.name || "Project",
                href: task.milestone.project?.id
                  ? `/dashboard/projects/${task.milestone.project.id}`
                  : undefined,
              },
              {
                label: task.milestone.name,
                href: task.milestone.project?.id
                  ? `/dashboard/projects/${task.milestone.project.id}/milestones/${task.milestone.id}`
                  : undefined,
              },
              { label: `Task: ${task.title}`, current: true },
            ]}
            className="mb-4"
          />
        )}

        <div className="space-y-6 mt-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 flex-wrap">
            {canUpdateTask ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Badge className={statusColors[task.status]}>
                {task.status.replace("_", " ")}
              </Badge>
            )}
            <Badge className={priorityColors[task.priority]}>
              <span className="flex items-center gap-1">
                {priorityIcons[task.priority]}
                {task.priority} Priority
              </span>
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="font-medium">{localProgress}%</span>
            </div>
            <Progress value={localProgress} className="h-2" />
            {canUpdateTask && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3">
                  <Slider
                    value={[localProgress]}
                    onValueChange={(values) => handleProgressChange(values[0])}
                    max={100}
                    step={1}
                    disabled={isUpdating}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={localProgress}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      handleProgressChange(value);
                    }}
                    disabled={isUpdating}
                    className="w-20 text-center"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {isUpdating ? "Saving..." : "Drag slider or enter value (auto-saves)"}
                </p>
              </div>
            )}
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Created</span>
              </div>
              <p className="text-sm font-medium">
                {format(new Date(task.createdAt), "PPP")}
              </p>
            </div>

            {task.completedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
                <p className="text-sm font-medium">
                  {format(new Date(task.completedAt), "PPP")}
                </p>
              </div>
            )}
          </div>

          {/* Time Tracking */}

          {/* Assigned Users */}
          {task.assignments && task.assignments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Assigned To</h3>
              <div className="flex flex-wrap gap-2">
                {task.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {assignment.userProfile?.user?.name || "Unknown User"}
                    </span>
                    {assignment.role && (
                      <Badge variant="outline" className="text-xs">
                        {assignment.role}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestone Information */}
          {task.milestone && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Milestone
              </h3>
              <p className="font-medium">{task.milestone.name}</p>
              {task.milestone.project && (
                <p className="text-sm text-gray-600 mt-1">
                  Project: {task.milestone.project.name}
                </p>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-4">
            <TaskCommentSection taskId={task.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
