"use client";

import { Button } from "@/components/ui/button";
import { useTasks, useUpdateTask } from "@/hooks/useTaskMutations";
import { Task, TaskStatus } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import TaskCard from "./task-card";

const KANBAN_COLUMNS = [
  { id: "TODO", title: "To Do", color: "bg-gray-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "BLOCKED", title: "Blocked", color: "bg-red-100" },
  { id: "REVIEW", title: "Review", color: "bg-orange-100" },
  { id: "DONE", title: "Done", color: "bg-green-100" },
];

interface TaskKanbanProps {
  milestoneId?: string;
  onTaskClick?: (task: Task) => void;
}

export default function TaskKanban({
  milestoneId,
  onTaskClick,
}: TaskKanbanProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const { data: tasksData, isLoading } = useTasks({
    page: 1,
    limit: 1000, // Get all tasks for Kanban
    search: search,
    priority: priorityFilter,
    milestoneId: milestoneId,
  });

  const updateTaskMutation = useUpdateTask();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        taskData: { status: newStatus as TaskStatus },
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const tasksByStatus = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] =
      (tasksData as any)?.data?.result?.filter(
        (task: Task) => task.status === column.id
      ) || [];
    return acc;
  }, {} as Record<string, Task[]>);

  const getColumnStats = (status: string) => {
    const tasks = tasksByStatus[status] || [];
    const totalEstimatedHours = tasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    return {
      count: tasks.length,
      totalEstimatedHours,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search tasks..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {KANBAN_COLUMNS.map((column) => {
          const tasks = tasksByStatus[column.id];
          const stats = getColumnStats(column.id);

          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className={`p-4 rounded-lg ${column.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {column.title}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {stats.count} task{stats.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      // TODO: Open add task modal with pre-selected status
                      console.log("Add task to", column.id);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Column Stats */}
                {stats.totalEstimatedHours > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <div>Est: {stats.totalEstimatedHours}h</div>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-3 min-h-[200px]">
                {tasks.map((task) => (
                  <div key={task.id}>
                    <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    No tasks in this column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Status Change Instructions */}
      <div className="text-sm text-gray-500 text-center">
        Click on a task card to view details. Status changes can be made from
        the task details view.
      </div>
    </div>
  );
}
