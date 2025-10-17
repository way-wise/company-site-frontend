"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMilestone } from "@/hooks/useMilestoneMutations";
import { useTasks } from "@/hooks/useTaskMutations";
import { Task } from "@/types";
import { CheckSquare, LayoutGrid, Plus, Table } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "../task-components/create-task-modal";
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        projectId={projectId}
        milestoneId={milestoneId}
      />
    </Card>
  );
}
