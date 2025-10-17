"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormFieldset } from "@/components/ui/form";
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
import { useMilestones } from "@/hooks/useMilestoneMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { useDeleteTask, useTasks } from "@/hooks/useTaskMutations";
import {
  formatStatusText,
  getTaskPriorityColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import { Milestone, Task } from "@/types";
import {
  ExternalLink,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateTask from "./UpdateTask";
import AssignTaskModal from "./assign-task-modal";
import CreateTaskModal from "./create-task-modal";

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
  const [projectFilter, setProjectFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [myTasksFilter, setMyTasksFilter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get projects for the project filter dropdown
  const { data: projectsData } = useProjects({
    page: 1,
    limit: 100,
  });

  // Get milestones for the milestone filter dropdown (filtered by project if selected)
  const { data: milestonesData } = useMilestones({
    page: 1,
    limit: 100,
    projectId: projectFilter === "all" ? undefined : projectFilter,
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
    // Note: projectId filter would need to be added to the backend API
    // For now, we'll filter on the frontend
  });

  const deleteForm = useForm();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Get raw tasks data and apply client-side filters
  const rawTasks = (tasksData as any)?.data?.result || [];

  const filteredTasks = Array.isArray(rawTasks)
    ? rawTasks.filter((task: Task) => {
        // Project filter
        if (projectFilter !== "all") {
          if (task.milestone?.project?.id !== projectFilter) {
            return false;
          }
        }

        // My Tasks filter (this would need to be implemented with current user context)
        if (myTasksFilter) {
          // For now, we'll show all tasks as we don't have current user context
          // This would need to be implemented with proper user authentication
          return true;
        }

        return true;
      })
    : [];

  const deleteTaskMutation = useDeleteTask();

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
      header: "Project",
      accessorKey: "project",
      cell: ({ row }: { row: { original: Task } }) => {
        const project = row.original.milestone?.project;
        return project ? (
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="text-sm hover:text-blue-600 hover:underline transition-colors"
          >
            <div className="font-medium text-gray-900">{project.name}</div>
            <div className="text-xs text-gray-500">ID: {project.id}</div>
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      header: "Milestone",
      accessorKey: "milestone",
      cell: ({ row }: { row: { original: Task } }) => {
        const milestone = row.original.milestone;
        const project = row.original.milestone?.project;
        return milestone && project ? (
          <Link
            href={`/dashboard/projects/${project.id}/milestones/${milestone.id}`}
            className="text-sm hover:text-blue-600 hover:underline transition-colors"
          >
            <div className="font-medium text-gray-900">{milestone.name}</div>
            <div className="text-xs text-gray-500">ID: {milestone.id}</div>
          </Link>
        ) : (
          "-"
        );
      },
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
            <div>{task.estimatedHours || 0}h estimated</div>
          </div>
        );
      },
    },
    {
      header: "Context",
      accessorKey: "context",
      cell: ({ row }: { row: { original: Task } }) => {
        const task = row.original;
        const project = task.milestone?.project;
        const milestone = task.milestone;

        if (!project || !milestone) return "-";

        return (
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="hover:text-blue-600 hover:underline transition-colors"
              >
                {project.name}
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/dashboard/projects/${project.id}/milestones/${milestone.id}`}
                className="hover:text-blue-600 hover:underline transition-colors"
              >
                {milestone.name}
              </Link>
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

              {row.original.milestone?.project && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/projects/${row.original.milestone.project.id}`}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View in Project</span>
                  </Link>
                </DropdownMenuItem>
              )}

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
            <Button
              variant={myTasksFilter ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMyTasksFilter(!myTasksFilter);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              My Tasks
            </Button>
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
              value={projectFilter}
              onValueChange={(value) => {
                setProjectFilter(value);
                setMilestoneFilter("all"); // Reset milestone filter when project changes
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectsData?.data?.result &&
                  Array.isArray(projectsData.data.result) &&
                  projectsData.data.result.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
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
                {milestonesData?.data?.result &&
                  Array.isArray(milestonesData.data.result) &&
                  milestonesData.data.result.map((milestone: Milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          data={filteredTasks}
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
      />

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
