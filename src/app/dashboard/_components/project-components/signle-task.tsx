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
import { Clock, Edit, Eye, MoreVertical, Trash, User } from "lucide-react";
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

  const handleQuickSave = async (data: any) => {
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
      <div className="p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
        {isEditing ? (
          // Quick Edit Mode
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
                              <SelectItem value="CRITICAL">Critical</SelectItem>
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
                      <span>Progress: {quickEditForm.watch("progress")}%</span>
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
        ) : (
          // View Mode
          <>
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-medium text-sm flex-1 pr-2">{task.title}</h5>
              <div className="flex items-center gap-2">
                {getTaskStatusBadge(task.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={handleViewDetails}>
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleQuickEdit}>
                      <Edit className="h-3 w-3 mr-2" />
                      Quick Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditDetails}>
                      <Edit className="h-3 w-3 mr-2" />
                      Full Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteModalOpen(true)}
                      className="text-red-600"
                    >
                      <Trash className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Progress: {task.progress}%</span>
                {task.estimatedHours && (
                  <span>Est: {task.estimatedHours}h</span>
                )}
                {task.assignments && task.assignments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{task.assignments.length} assigned</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(task.createdAt).toLocaleDateString()}
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
