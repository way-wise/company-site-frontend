"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTask, useUpdateTask } from "@/hooks/useTaskMutations";
import {
  formatStatusText,
  getTaskPriorityColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import { Priority, Task, TaskStatus } from "@/types";
import {
  Calendar,
  Clock,
  Edit,
  MessageSquare,
  Save,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import TaskCommentSection from "./task-comment-section";

interface TaskDetailsProps {
  taskId: string;
  onClose?: () => void;
}

export default function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { data: taskData, isLoading } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});

  const task = taskData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading task details...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Task not found</div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      estimatedHours: task.estimatedHours,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: editData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const statusColors = getTaskStatusColor(task.status);
  const priorityColors = getTaskPriorityColor(task.priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {isEditing ? (
            <input
              type="text"
              value={editData.title || ""}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="text-2xl font-bold border border-gray-300 rounded px-2 py-1 w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold">{task.title}</h1>
          )}
          <div className="flex items-center gap-2">
            <Badge className={statusColors}>
              {formatStatusText(task.status)}
            </Badge>
            <Badge className={priorityColors}>
              {formatStatusText(task.priority)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateTaskMutation.isPending}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Description</h3>
            {isEditing ? (
              <textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                placeholder="Task description..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || "No description provided"}
              </p>
            )}
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({task._count?.comments || 0})
            </h3>
            <TaskCommentSection taskId={task.id} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Task Information</h3>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={editData.status || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    <Badge className={statusColors}>
                      {formatStatusText(task.status)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={editData.priority || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    <Badge className={priorityColors}>
                      {formatStatusText(task.priority)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Progress
                </label>
                {isEditing ? (
                  <div className="mt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editData.progress || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          progress: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {editData.progress || 0}%
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    <Progress value={task.progress} className="mb-2" />
                    <div className="text-sm text-gray-500">
                      {task.progress}%
                    </div>
                  </div>
                )}
              </div>

              {/* Milestone */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Milestone
                </label>
                <div className="mt-1 text-sm">
                  {task.milestone?.name || "No milestone"}
                </div>
              </div>

              {/* Creator */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created by
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <div className="bg-primary text-primary-foreground text-xs font-medium">
                      {task.creator?.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  </Avatar>
                  <span className="text-sm">
                    {task.creator?.user?.name || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created
                </label>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>

              {task.startedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Started
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.startedAt).toLocaleDateString()}
                  </div>
                </div>
              )}

              {task.completedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Completed
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.completedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Time Tracking */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Tracking
            </h3>
          </Card>

          {/* Assignees */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assignees ({task._count?.assignments || 0})
            </h3>
            <div className="space-y-3">
              {task.assignments && task.assignments.length > 0 ? (
                task.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground text-xs font-medium">
                        {assignment.userProfile?.user?.name
                          ?.charAt(0)
                          .toUpperCase() || "?"}
                      </div>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {assignment.userProfile?.user?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.userProfile?.user?.email || ""}
                      </div>
                    </div>
                    {assignment.role && (
                      <Badge variant="outline" className="text-xs">
                        {assignment.role}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No assignees</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
