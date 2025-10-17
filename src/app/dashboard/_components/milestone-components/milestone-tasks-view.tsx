"use client";

import {
  CreateTaskFormData,
  createTaskSchema,
} from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMilestone } from "@/hooks/useMilestoneMutations";
import { useCreateTask, useTasks } from "@/hooks/useTaskMutations";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, LayoutGrid, Plus, Table } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TaskKanban from "../task-components/task-kanban";
import TaskTable from "../task-components/task-table";

interface MilestoneTasksViewProps {
  milestoneId: string;
  projectId: string;
}

export default function MilestoneTasksView({
  milestoneId,
  projectId,
}: MilestoneTasksViewProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const { data: tasksData, isLoading } = useTasks({
    page: 1,
    limit: 100,
    milestoneId: milestoneId,
  });

  const { data: milestoneData } = useMilestone(milestoneId);
  const milestone = milestoneData?.data;

  const tasks = tasksData?.data?.result || [];

  // Form for creating tasks
  const addTaskForm = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      milestoneId: milestoneId,
      status: "TODO",
      priority: "MEDIUM",
      progress: 0,
      estimatedHours: 0,
    },
  });

  const createTaskMutation = useCreateTask();

  const handleCreateTask = async (data: CreateTaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(data);
      setAddTaskOpen(false);
      addTaskForm.reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskClick = (task: Task) => {
    // TODO: Open task detail modal
    console.log("Task clicked:", task);
  };

  const handleCreateTask = () => {
    setAddTaskOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading tasks...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tasks ({tasks.length})
        </h2>
        <Button onClick={handleCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as "table" | "kanban")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <TaskTable />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <TaskKanban milestoneId={milestoneId} onTaskClick={handleTaskClick} />
        </TabsContent>
      </Tabs>

      {/* Add Task Modal */}
      <Modal open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Task</ModalTitle>
          </ModalHeader>
          <Form {...addTaskForm}>
            <form onSubmit={addTaskForm.handleSubmit(handleCreateTask)}>
              <FormFieldset disabled={createTaskMutation.isPending}>
                {/* Project and Milestone Context Display */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Context
                  </div>
                  <div className="text-sm text-gray-900">
                    <div>
                      Project: {milestone?.project?.name || "Unknown Project"}
                    </div>
                    <div>
                      Milestone: {milestone?.name || "Unknown Milestone"}
                    </div>
                  </div>
                </div>

                <FormField
                  control={addTaskForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addTaskForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Task Description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addTaskForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TODO">Todo</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                            <SelectItem value="REVIEW">Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addTaskForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending
                      ? "Creating..."
                      : "Create Task"}
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </Card>
  );
}
