"use client";

import { updateTaskSchema } from "@/components/modules/admin/projectValidation";
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
import { useDeleteTask, useUpdateTask } from "@/hooks/useTaskMutations";
import { formatStatusText, getTaskStatusColor } from "@/lib/status-utils";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, MoreVertical, Trash, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SingleTaskProps {
  task: Task;
  onTaskUpdate?: () => void;
}

export default function SingleTask({ task, onTaskUpdate }: SingleTaskProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  // Form for quick status and progress editing
  const quickEditForm = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      status: task.status,
      progress: task.progress,
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
      status: task.status,
      progress: task.progress,
    });
  };

  const handleQuickSave = async (data: any) => {
    try {
      console.log("Updating task with data:", data);
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

  return (
    <>
      <div className="p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
        {isEditing ? (
          // Quick Edit Mode - Status and Progress only
          <Form {...quickEditForm}>
            <form onSubmit={quickEditForm.handleSubmit(handleQuickSave)}>
              <FormFieldset disabled={updateTaskMutation.isPending}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm flex-1 pr-2">
                      {task.title}
                    </h5>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={quickEditForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 w-32">
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
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>Progress:</span>
                        <FormField
                          control={quickEditForm.control}
                          name="progress"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="h-6 w-16 text-xs"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <span>%</span>
                      </div>
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
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleQuickEdit}>
                      Update
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
