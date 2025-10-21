"use client";

import { createTaskSchema } from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTaskMutations";
import { formatStatusText, getTaskStatusColor } from "@/lib/status-utils";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckSquare,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TaskDetails from "../task-components/task-details";
import UpdateTask from "../task-components/UpdateTask";

interface SingleTaskProps {
  task: Task;
  onTaskUpdate?: () => void;
}

export default function SingleTask({ task, onTaskUpdate }: SingleTaskProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  // Form for quick inline editing
  const quickEditForm = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      estimatedHours: task.estimatedHours,
    },
  });

  const getTaskStatusBadge = (status: string) => {
    const colors = getTaskStatusColor(status);
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors}`}
      >
        {formatStatusText(status)}
      </span>
    );
  };

  const handleQuickEdit = () => {
    setIsEditing(true);
    quickEditForm.reset({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      estimatedHours: task.estimatedHours,
    });
  };

  const handleQuickSave = async (data: Partial<Task>) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: data,
      });
      setIsEditing(false);
      onTaskUpdate?.();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleQuickCancel = () => {
    setIsEditing(false);
    quickEditForm.reset();
  };

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(task.id);
      setDeleteModalOpen(false);
      onTaskUpdate?.();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleViewDetails = () => {
    setViewModalOpen(true);
  };

  const handleEditDetails = () => {
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
        {isEditing ? (
          <div className="p-4">
            {/* Quick Edit Mode */}
            <Form {...quickEditForm}>
              <form onSubmit={quickEditForm.handleSubmit(handleQuickSave)}>
                <FormFieldset disabled={updateTaskMutation.isPending}>
                  <div className="space-y-3">
                    <FormField
                      control={quickEditForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Task title"
                              {...field}
                              className="font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={quickEditForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Task description"
                              rows={2}
                              {...field}
                              className="text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-2">
                      <FormField
                        control={quickEditForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="BLOCKED">Blocked</SelectItem>
                                <SelectItem value="REVIEW">Review</SelectItem>
                                <SelectItem value="DONE">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={quickEditForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="CRITICAL">
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={quickEditForm.control}
                        name="progress"
                        render={({ field }) => (
                          <FormItem className="w-20">
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                                className="h-8"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Progress: {quickEditForm.watch("progress")}%
                        </span>
                        {task.estimatedHours && (
                          <span>Est: {task.estimatedHours}h</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleQuickCancel}
                          disabled={updateTaskMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          isLoading={updateTaskMutation.isPending}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormFieldset>
              </form>
            </Form>
          </div>
        ) : (
          <>
            {/* Task Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        task.status === "DONE"
                          ? "bg-green-100"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-100"
                          : task.status === "REVIEW"
                          ? "bg-yellow-100"
                          : task.status === "BLOCKED"
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <CheckSquare
                        className={`h-4 w-4 ${
                          task.status === "DONE"
                            ? "text-green-600"
                            : task.status === "IN_PROGRESS"
                            ? "text-blue-600"
                            : task.status === "REVIEW"
                            ? "text-yellow-600"
                            : task.status === "BLOCKED"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        {getTaskStatusBadge(task.status)}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === "CRITICAL"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "HIGH"
                              ? "bg-orange-100 text-orange-700"
                              : task.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={handleViewDetails}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleQuickEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Quick Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditDetails}>
                      <Edit className="h-4 w-4 mr-2" />
                      Full Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteModalOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Task Content */}
            <div className="p-4">
              {task.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {task.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      task.progress === 100
                        ? "bg-green-500"
                        : task.progress >= 75
                        ? "bg-blue-500"
                        : task.progress >= 50
                        ? "bg-yellow-500"
                        : task.progress >= 25
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600">
                  {task.estimatedHours && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {task.estimatedHours}h
                      </span>
                    </div>
                  )}
                  {task.assignments && task.assignments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {task.assignments.length} assigned
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      <Modal open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Task Details</ModalTitle>
          </ModalHeader>
          <TaskDetails
            taskId={task.id}
            onClose={() => setViewModalOpen(false)}
          />
        </ModalContent>
      </Modal>

      {/* Edit Details Modal */}
      <Modal open={editModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Edit Task</ModalTitle>
          </ModalHeader>
          <UpdateTask
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            task={task}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Task</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteTaskMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                isLoading={deleteTaskMutation.isPending}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
