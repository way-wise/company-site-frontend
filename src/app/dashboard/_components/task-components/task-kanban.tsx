"use client";

import { useAuth } from "@/context/UserContext";
import { useTasks, useUpdateTask } from "@/hooks/useTaskMutations";
import { Task, TaskStatus } from "@/types";
import { useState } from "react";
import TaskCard from "./task-card";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const KANBAN_COLUMNS = [
  { id: "TODO", title: "To Do", color: "bg-gray-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "BLOCKED", title: "Blocked", color: "bg-red-100" },
  { id: "REVIEW", title: "Review", color: "bg-orange-100" },
  { id: "DONE", title: "Done", color: "bg-green-100" },
];

interface TaskKanbanProps {
  milestoneId?: string;
  projectMilestoneIds?: string[];
  priorityFilter?: string;
  onTaskClick?: (task: Task) => void;
}

// Sortable Task Card Wrapper
function SortableTaskCard({
  task,
  onTaskClick,
}: {
  task: Task;
  onTaskClick?: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
    </div>
  );
}

// Droppable Column Wrapper
function DroppableColumn({
  column,
  tasks,
  children,
  isActivelyDragging,
  onTaskClick,
}: {
  column: { id: string; title: string; color: string };
  tasks: Task[];
  children: React.ReactNode;
  isActivelyDragging: boolean;
  onTaskClick?: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className="space-y-4">
      {children}
      {/* Droppable Area */}
      <div
        className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors"
        style={{
          borderColor: isOver
            ? "rgba(59, 130, 246, 0.5)"
            : isActivelyDragging
            ? "rgba(59, 130, 246, 0.2)"
            : "transparent",
          backgroundColor: isOver ? "rgba(59, 130, 246, 0.05)" : "transparent",
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No tasks</div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function TaskKanban({
  milestoneId,
  projectMilestoneIds,
  priorityFilter = "",
  onTaskClick,
}: TaskKanbanProps) {
  const { hasPermission } = useAuth();
  const canUpdateTask = hasPermission("update_task");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: tasksData, isLoading } = useTasks({
    page: 1,
    limit: 1000, // Get all tasks for Kanban
    search: "",
    priority: priorityFilter,
    milestoneId: milestoneId,
  });

  const updateTaskMutation = useUpdateTask();

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement before drag starts
      },
    })
  );

  const tasksByStatus = KANBAN_COLUMNS.reduce((acc, column) => {
    const allTasks = (tasksData as { data?: { result?: Task[] } })?.data?.result || [];
    
    // Filter tasks by status and optionally by project milestones
    acc[column.id] = allTasks.filter((task: Task) => {
      if (task.status !== column.id) return false;
      
      // If projectMilestoneIds is provided (for "All Milestones" view),
      // only show tasks from those milestones
      if (projectMilestoneIds && projectMilestoneIds.length > 0) {
        return task.milestone?.id && projectMilestoneIds.includes(task.milestone.id);
      }
      
      return true;
    });
    
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !canUpdateTask) return;

    const taskId = active.id as string;
    
    // Determine the new status
    let newStatus: TaskStatus;
    
    // Check if over.id is a status column or a task
    if (KANBAN_COLUMNS.some(col => col.id === over.id)) {
      // Dropped on a column
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped on a task - find that task's status
      const targetTask = Object.values(tasksByStatus)
        .flat()
        .find((t) => t.id === over.id);
      
      if (!targetTask) return;
      newStatus = targetTask.status;
    }

    // Find the task being dragged
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Update task status
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        taskData: { status: newStatus },
      });
    } catch (error) {
      // Error handled by mutation hook with toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {KANBAN_COLUMNS.map((column) => {
            const tasks = tasksByStatus[column.id];
            const stats = getColumnStats(column.id);

            return (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={tasks}
                isActivelyDragging={!!activeTask}
                onTaskClick={onTaskClick}
              >
                {/* Column Header */}
                <div className={`p-4 rounded-lg ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {column.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-700">
                        {stats.count}
                      </span>
                    </div>
                  </div>

                  {/* Column Stats */}
                  {stats.totalEstimatedHours > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <div>Est: {stats.totalEstimatedHours}h</div>
                    </div>
                  )}
                </div>
              </DroppableColumn>
            );
          })}
        </div>

        {/* Drag Instructions */}
        <div className="text-sm text-gray-500 text-center">
          {canUpdateTask
            ? "Drag and drop tasks between columns to change status, or click to view details."
            : "Click on a task card to view details."}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="cursor-grabbing opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
