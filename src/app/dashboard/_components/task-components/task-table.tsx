"use client";

import {
  CreateTaskFormData,
  createTaskSchema,
} from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMilestones } from "@/hooks/useMilestoneMutations";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
} from "@/hooks/useTaskMutations";
import {
  formatStatusText,
  getTaskPriorityColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import { Milestone, Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, MoreVertical, Pencil, Plus, Trash, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateTask from "./UpdateTask";
import AssignTaskModal from "./assign-task-modal";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string) => {
  const colors = getTaskStatusColor(status);
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${colors}`}
    >
      {formatStatusText(status)}
    </span>
  );
};

const getPriorityBadge = (priority: string) => {
  const colors = getTaskPriorityColor(priority);
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${colors}`}
    >
      {formatStatusText(priority)}
    </span>
  );
};

export const TaskTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);
  const [assignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskId, setTaskId] = useState<string | undefined>("");

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [milestoneFilter, setMilestoneFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get milestones for the milestone filter dropdown
  const { data: milestonesData } = useMilestones({
    page: 1,
    limit: 100,
  });

  const {
    data: tasksData,
    isLoading,
    refetch,
  } = useTasks({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status: statusFilter === "all" ? "" : statusFilter,
    priority: priorityFilter === "all" ? "" : priorityFilter,
    milestoneId: milestoneFilter === "all" ? "" : milestoneFilter,
  });

  const addTaskForm = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      milestoneId: "",
      status: "TODO",
      priority: "MEDIUM",
      progress: 0,
      estimatedHours: 0,
      spentHours: 0,
    },
  });

  const deleteForm = useForm();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleAddTask = async (values: CreateTaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(values);
      setAddTaskModalOpen(false);
      addTaskForm.reset();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId) return;

    try {
      await deleteTaskMutation.mutateAsync(taskId);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: { row: { original: Task } }) => {
        const description = row.original.description;
        return description && description.length > 50
          ? `${description.substring(0, 50)}...`
          : description || "-";
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Task } }) =>
        getStatusBadge(row.original.status),
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: ({ row }: { row: { original: Task } }) =>
        getPriorityBadge(row.original.priority),
    },
    {
      header: "Progress",
      accessorKey: "progress",
      cell: ({ row }: { row: { original: Task } }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.progress} className="w-16" />
          <span className="text-sm text-gray-600">
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      header: "Milestone",
      accessorKey: "milestone",
      cell: ({ row }: { row: { original: Task } }) =>
        row.original.milestone?.name || "-",
    },
    {
      header: "Creator",
      accessorKey: "creator",
      cell: ({ row }: { row: { original: Task } }) =>
        row.original.creator?.user?.name || "-",
    },
    {
      header: "Assignees",
      accessorKey: "_count",
      cell: ({ row }: { row: { original: Task } }) =>
        row.original._count?.assignments || 0,
    },
    {
      header: "Time",
      accessorKey: "time",
      cell: ({ row }: { row: { original: Task } }) => {
        const task = row.original;
        return (
          <div className="text-sm">
            <div>
              {task.spentHours || 0}h / {task.estimatedHours || 0}h
            </div>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: Task } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Task } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setUpdateTaskModalOpen(true);
                  setSelectedTask(row.original);
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedTask(row.original);
                  setAssignTaskModalOpen(true);
                }}
              >
                <Users />
                <span>Assign Employees</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement task details view
                  console.log("View task details:", row.original);
                }}
              >
                <Eye />
                <span>View Details</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setTaskId(id);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Tasks</h1>
        <Button onClick={() => setAddTaskModalOpen(true)}>
          <Plus />
          <span>Add Task</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search tasks..."
              className="max-w-xs"
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(value) => {
                setPriorityFilter(value);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={milestoneFilter}
              onValueChange={(value) => {
                setMilestoneFilter(value);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by milestone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Milestones</SelectItem>
                {milestonesData?.data &&
                  Array.isArray(milestonesData.data) &&
                  milestonesData.data.map((milestone: Milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          data={(tasksData as any)?.data || []}
          columns={columns}
          isPending={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={(newPagination) => {
            setPagination({
              pageIndex: newPagination.pageIndex,
              pageSize: newPagination.pageSize,
            });
          }}
        />
      </div>

      {/* Add Task Modal */}
      <Modal open={addTaskModalOpen} onOpenChange={setAddTaskModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Task</ModalTitle>
          </ModalHeader>
          <Form {...addTaskForm}>
            <form onSubmit={addTaskForm.handleSubmit(handleAddTask)}>
              <FormFieldset disabled={createTaskMutation.isPending}>
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

                <FormField
                  control={addTaskForm.control}
                  name="milestoneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select milestone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {milestonesData?.data &&
                            Array.isArray(milestonesData.data) &&
                            milestonesData.data.map((milestone: Milestone) => (
                              <SelectItem
                                key={milestone.id}
                                value={milestone.id}
                              >
                                {milestone.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addTaskForm.control}
                    name="estimatedHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addTaskForm.control}
                    name="spentHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spent Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddTaskModalOpen(false);
                      addTaskForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createTaskMutation.isPending}
                  >
                    Add Task
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete Task Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Task</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteTask)}>
              <FormFieldset disabled={deleteTaskMutation.isPending}>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the
                  task and remove associated data.
                </p>
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    isLoading={deleteTaskMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Update Task Modal */}
      <UpdateTask
        isOpen={updateTaskModalOpen}
        onClose={() => {
          setUpdateTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={assignTaskModalOpen}
        onClose={() => {
          setAssignTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </>
  );
};

export default TaskTable;
