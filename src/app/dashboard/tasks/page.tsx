"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/types";
import { useState } from "react";
import TaskDetailsModal from "../_components/task-components/task-details-modal";
import TaskKanban from "../_components/task-components/task-kanban";
import TaskTable from "../_components/task-components/task-table";

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <PermissionGuard permissions={["read_task"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Projects", href: "/dashboard/projects" },
            { label: "All Tasks", current: true },
          ]}
        />
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-6">
            <TaskTable />
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <TaskKanban onTaskClick={setSelectedTask} />
          </TabsContent>
        </Tabs>

        {/* Task Details Modal */}
        <TaskDetailsModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      </div>
    </PermissionGuard>
  );
}
