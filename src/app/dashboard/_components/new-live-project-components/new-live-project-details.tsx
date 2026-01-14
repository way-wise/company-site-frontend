"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  useAddProjectAction,
  useDeleteProjectAction,
  useAddHourLog,
  useDeleteHourLog,
  useProjectActions,
  useHourLogs,
} from "@/hooks/useNewLiveProjectMutations";
import { useAuth } from "@/context/UserContext";
import { NewLiveProject } from "@/types";
import { ArrowLeft, FileText, DollarSign, StickyNote, Calendar, Users, Clock, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { newLiveProjectQueryKeys } from "@/hooks/useNewLiveProjectMutations";
import { newLiveProjectService } from "@/services/NewLiveProjectService";

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCEL: "bg-red-100 text-red-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge
      className={colors[status] || "bg-gray-100 text-gray-800"}
      variant="outline"
    >
      {status}
    </Badge>
  );
};

const getProjectTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    FIXED: "bg-purple-100 text-purple-800",
    HOURLY: "bg-blue-100 text-blue-800",
  };
  return (
    <Badge
      className={colors[type] || "bg-gray-100 text-gray-800"}
      variant="outline"
    >
      {type}
    </Badge>
  );
};

interface NewLiveProjectDetailsProps {
  project: NewLiveProject;
}

export default function NewLiveProjectDetails({
  project: initialProject,
}: NewLiveProjectDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [project, setProject] = useState(initialProject);
  const [newActionText, setNewActionText] = useState("");
  const [newHourLogDate, setNewHourLogDate] = useState("");
  const [newHourLogHours, setNewHourLogHours] = useState("");

  const addActionMutation = useAddProjectAction();
  const deleteActionMutation = useDeleteProjectAction();
  const addHourLogMutation = useAddHourLog();
  const deleteHourLogMutation = useDeleteHourLog();

  const { data: actionsData } = useProjectActions(project.id);
  const { data: hourLogsData } = useHourLogs(project.id);

  const actions = actionsData?.data || [];
  const hourLogs = hourLogsData?.data || [];

  // Refetch project data when it might have changed
  const refetchProject = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: newLiveProjectQueryKeys.detail(project.id),
      queryFn: () => newLiveProjectService.getNewLiveProjectById(project.id),
    });
    if (data?.success && data.data) {
      setProject(data.data);
    }
  };

  const handleAddAction = async () => {
    if (!newActionText.trim()) return;
    try {
      await addActionMutation.mutateAsync({
        projectId: project.id,
        actionText: newActionText.trim(),
      });
      setNewActionText("");
      await refetchProject();
    } catch (error) {
      console.error("Error adding action:", error);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    try {
      await deleteActionMutation.mutateAsync({
        projectId: project.id,
        actionId,
      });
      await refetchProject();
    } catch (error) {
      console.error("Error deleting action:", error);
    }
  };

  const handleAddHourLog = async () => {
    if (!newHourLogDate || !newHourLogHours) return;
    try {
      const date = new Date(newHourLogDate).toISOString();
      const hours = parseFloat(newHourLogHours);
      if (isNaN(hours) || hours <= 0) return;

      await addHourLogMutation.mutateAsync({
        projectId: project.id,
        date,
        submittedHours: hours,
      });
      setNewHourLogDate("");
      setNewHourLogHours("");
      await refetchProject();
    } catch (error) {
      console.error("Error adding hour log:", error);
    }
  };

  const handleDeleteHourLog = async (hourLogId: string) => {
    try {
      await deleteHourLogMutation.mutateAsync({
        projectId: project.id,
        hourLogId,
      });
      await refetchProject();
    } catch (error) {
      console.error("Error deleting hour log:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.projectName}</h1>
          <p className="text-muted-foreground mt-1">{project.clientName || "No client name"}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Go Back</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            <span>Actions</span>
            {actions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {actions.length}
              </Badge>
            )}
          </TabsTrigger>
          {project.projectType === "HOURLY" ? (
            <TabsTrigger value="hourLogs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Hour Logs</span>
              {hourLogs.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {hourLogs.length}
                </Badge>
              )}
            </TabsTrigger>
          ) : (
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Financial</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Name</p>
                  <p className="text-base font-semibold">{project.projectName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                  <p className="text-base">{project.clientName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client Location</p>
                  <p className="text-base">{project.clientLocation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Type</p>
                  <div className="mt-1">{getProjectTypeBadge(project.projectType)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Status</p>
                  <div className="mt-1">{getStatusBadge(project.projectStatus)}</div>
                </div>
                {project.projectType === "FIXED" && project.progress !== undefined && project.progress !== null && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team & Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Members</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.assignedMembers && project.assignedMembers.length > 0 ? (
                      project.assignedMembers.map((member, index) => (
                        <Badge key={index} variant="outline">
                          {member}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No members assigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Committed Deadline</p>
                  <p className="text-base">
                    {project.committedDeadline
                      ? new Date(project.committedDeadline).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                {project.targetedDeadline && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Targeted Deadlines</p>
                    <div className="mt-1 space-y-1">
                      {project.targetedDeadline.backend && (
                        <p className="text-sm">
                          Backend: {new Date(project.targetedDeadline.backend).toLocaleDateString()}
                        </p>
                      )}
                      {project.targetedDeadline.frontend && (
                        <p className="text-sm">
                          Frontend: {new Date(project.targetedDeadline.frontend).toLocaleDateString()}
                        </p>
                      )}
                      {project.targetedDeadline.ui && (
                        <p className="text-sm">
                          UI: {new Date(project.targetedDeadline.ui).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-base">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Project Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Action */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter a new action..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  rows={3}
                  className="bg-white text-black placeholder:text-gray-900"
                />
                <Button
                  onClick={handleAddAction}
                  disabled={!newActionText.trim() || addActionMutation.isPending}
                  size="sm"
                >
                  {addActionMutation.isPending ? "Adding..." : "Add Action"}
                </Button>
              </div>

              {/* Actions List */}
              <div className="space-y-3">
                {actions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No actions yet</p>
                ) : (
                  actions
                    .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime())
                    .map((action) => (
                      <div
                        key={action.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{action.actionText}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(action.actionDate).toLocaleString()} by{" "}
                            {action.creator?.user?.name || "Unknown"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteAction(action.id)}
                          disabled={deleteActionMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hour Logs Tab (for HOURLY projects) */}
        {project.projectType === "HOURLY" && (
          <TabsContent value="hourLogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hour Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Hour Log */}
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="date"
                    value={newHourLogDate}
                    onChange={(e) => setNewHourLogDate(e.target.value)}
                    placeholder="Date"
                  />
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newHourLogHours}
                    onChange={(e) => setNewHourLogHours(e.target.value)}
                    placeholder="Hours"
                  />
                  <Button
                    onClick={handleAddHourLog}
                    disabled={!newHourLogDate || !newHourLogHours || addHourLogMutation.isPending}
                    size="sm"
                  >
                    {addHourLogMutation.isPending ? "Adding..." : "Add Log"}
                  </Button>
                </div>

                {/* Hour Logs List */}
                <div className="space-y-3">
                  {hourLogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hour logs yet</p>
                  ) : (
                    hourLogs
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {new Date(log.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.submittedHours} hours by {log.user?.user?.name || "Unknown"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteHourLog(log.id)}
                            disabled={deleteHourLogMutation.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Financial Tab (for FIXED projects) */}
        {project.projectType === "FIXED" && (
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Budget</p>
                  <p className="text-2xl font-bold">
                    ${project.projectBudget?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${project.paidAmount?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Amount</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${project.dueAmount?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining Amount</p>
                  <p className="text-2xl font-bold">
                    $
                    {(
                      (project.projectBudget || 0) -
                      (project.paidAmount || 0)
                    ).toLocaleString()}
                  </p>
                </div>
                {project.progress !== undefined && project.progress !== null && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
