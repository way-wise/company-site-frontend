"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLiveProject } from "@/hooks/useLiveProjectMutations";
import { useAuth } from "@/context/UserContext";
import { LiveProject } from "@/types";
import { ArrowLeft, FileText, DollarSign, StickyNote, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { liveProjectQueryKeys } from "@/hooks/useLiveProjectMutations";

// Helper function to format date
const formatDateHelper = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    ON_HOLD: "bg-gray-100 text-gray-800",
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
    MONTHLY: "bg-indigo-100 text-indigo-800",
    CUSTOM: "bg-pink-100 text-pink-800",
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

interface LiveProjectDetailsProps {
  liveProject: LiveProject;
}

export default function LiveProjectDetails({
  liveProject: initialLiveProject,
}: LiveProjectDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const updateLiveProjectMutation = useUpdateLiveProject();
  
  // Use state to track the current project data (will be updated when notes are added/deleted)
  const [liveProject, setLiveProject] = useState(initialLiveProject);

  // Refetch project data when it might have changed
  const refetchProject = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: liveProjectQueryKeys.detail(liveProject.id),
    });
    if (data?.success && data.data) {
      setLiveProject(data.data);
    }
  };

  // Get all notes from dailyNotes
  const dailyNotes = liveProject.dailyNotes && Array.isArray(liveProject.dailyNotes) 
    ? liveProject.dailyNotes 
    : [];
  
  // Check if nextActions exists and is not already in dailyNotes
  const nextActionsNote = liveProject.nextActions 
    ? dailyNotes.find(note => note.note === liveProject.nextActions)
    : null;
  
  // Combine all notes - include nextActions if it's not already in dailyNotes
  const allNotes = [...dailyNotes];
  if (liveProject.nextActions && !nextActionsNote) {
    // Add nextActions as a note if it's not already in the list
    allNotes.push({
      note: liveProject.nextActions,
      createdAt: new Date().toISOString(), // Use current time as fallback
      userId: user?.id || "system",
      userName: "System",
      type: "action" as const,
    });
  }
  
  // Sort by createdAt (newest first)
  allNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{liveProject.projectName}</h1>
          <p className="text-muted-foreground mt-1">{liveProject.clientName}</p>
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
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            <span>Notes</span>
            {allNotes.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {allNotes.length}
              </Badge>
            )}
          </TabsTrigger>
          {liveProject.projectType !== "HOURLY" && (
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
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Project Name
                  </h4>
                  <p className="text-base font-medium">{liveProject.projectName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Client Name
                  </h4>
                  <p className="text-base font-medium">{liveProject.clientName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Location
                  </h4>
                  <p className="text-base">{liveProject.clientLocation || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Project Type
                    </h4>
                    <div className="mt-1">
                      {getProjectTypeBadge(liveProject.projectType)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </h4>
                    <div className="mt-1">
                      {getStatusBadge(liveProject.projectStatus)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveProject.deadline && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Deadline
                    </h4>
                    <p className="text-base">
                      {new Date(liveProject.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {liveProject.progress !== undefined &&
                  liveProject.progress !== null && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Progress
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all"
                            style={{ width: `${liveProject.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {liveProject.progress}%
                        </span>
                      </div>
                    </div>
                  )}
                {liveProject.assignedMembers && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assigned Members
                    </h4>
                    <p className="text-base">{liveProject.assignedMembers}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">
                    Created At
                  </h4>
                  <p>{formatDateHelper(liveProject.createdAt)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">
                    Updated At
                  </h4>
                  <p>{formatDateHelper(liveProject.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Project Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* All Notes History */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                  Previous Notes
                </h4>
                <div className="max-h-[500px] overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                  {allNotes.length > 0 ? (
                    allNotes.map((note, index) => {
                      // Create a unique key for each note using createdAt and userId
                      const noteKey = `${note.createdAt}-${note.userId}-${index}`;
                      
                      return (
                        <div key={noteKey} className="border-b pb-3 last:border-b-0 last:pb-0 group hover:bg-gray-100 rounded p-3 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{note.userName}</span>
                              {note.type && (
                                <Badge variant="outline" className="text-xs">
                                  {note.type}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={async () => {
                                  if (!liveProject) return;
                                  
                                  try {
                                    // Remove the note from the array
                                    const updatedNotes = liveProject.dailyNotes?.filter(
                                      (n) => !(
                                        n.createdAt === note.createdAt &&
                                        n.userId === note.userId &&
                                        n.note === note.note
                                      )
                                    ) || [];

                                    // Update nextActions to the latest note if we're deleting the current nextAction
                                    let updatedNextActions = liveProject.nextActions;
                                    if (liveProject.nextActions === note.note && updatedNotes.length > 0) {
                                      // Get the most recent note
                                      const sortedNotes = [...updatedNotes].sort(
                                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                      );
                                      updatedNextActions = sortedNotes[0]?.note || null;
                                    } else if (liveProject.nextActions === note.note && updatedNotes.length === 0) {
                                      updatedNextActions = null;
                                    }

                                    // Update the project
                                    const response = await updateLiveProjectMutation.mutateAsync({
                                      liveProjectId: liveProject.id,
                                      liveProjectData: {
                                        dailyNotes: updatedNotes,
                                        nextActions: updatedNextActions,
                                      },
                                    });

                                    // Update local state and refetch
                                    if (response.success && response.data) {
                                      setLiveProject(response.data);
                                      await refetchProject();
                                    }
                                  } catch (error) {
                                    // Error is handled by the mutation hook
                                  }
                                }}
                                disabled={updateLiveProjectMutation.isPending}
                              >
                                <span className="text-xs">×</span>
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
                            {note.note}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No notes yet. Add your first note below.
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Note Input */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Add New Note
                </h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user || !liveProject) return;

                    const formData = new FormData(e.currentTarget);
                    const newNote = formData.get("newNote") as string;

                    if (!newNote || newNote.trim() === "") {
                      return;
                    }

                    try {
                      // Get existing notes or create empty array
                      const existingNotes = liveProject.dailyNotes || [];
                      const updatedNotes = [
                        ...existingNotes,
                        {
                          note: newNote.trim(),
                          createdAt: new Date().toISOString(),
                          userId: user.id,
                          userName: user.name || user.email || "Unknown User",
                          type: "action" as const,
                        },
                      ];

                      // Update the project with new notes and nextActions
                      const response = await updateLiveProjectMutation.mutateAsync({
                        liveProjectId: liveProject.id,
                        liveProjectData: {
                          dailyNotes: updatedNotes,
                          nextActions: newNote.trim(),
                        },
                      });

                      // Update local state and refetch
                      if (response.success && response.data) {
                        setLiveProject(response.data);
                        await refetchProject();
                      }

                      // Clear the input
                      e.currentTarget.reset();
                    } catch (error) {
                      // Error is handled by the mutation hook
                    }
                  }}
                >
                  <Textarea
                    name="newNote"
                    placeholder="Enter your note or action here..."
                    rows={4}
                    className="bg-white text-black placeholder:text-gray-900"
                    required
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      type="submit"
                      isLoading={updateLiveProjectMutation.isPending}
                    >
                      Save Note
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        {liveProject.projectType !== "HOURLY" && (
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="text-xs text-muted-foreground mb-2">Budget</h5>
                    <p className="text-2xl font-semibold">
                      ${(liveProject.projectBudget || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h5 className="text-xs text-muted-foreground mb-2">Paid Amount</h5>
                    <p className="text-2xl font-semibold text-green-600">
                      ${(liveProject.paidAmount ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <h5 className="text-xs text-muted-foreground mb-2">Due Amount</h5>
                    <p className="text-2xl font-semibold text-orange-600">
                      ${(liveProject.dueAmount ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-4 border rounded-lg ${
                    (liveProject.projectBudget || 0) - (liveProject.paidAmount ?? 0) > 0
                      ? "bg-orange-50"
                      : "bg-green-50"
                  }`}>
                    <h5 className="text-xs text-muted-foreground mb-2">Remaining</h5>
                    <p
                      className={`text-2xl font-semibold ${
                        (liveProject.projectBudget || 0) - (liveProject.paidAmount ?? 0) > 0
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      ${(
                        (liveProject.projectBudget || 0) -
                        (liveProject.paidAmount ?? 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Hourly Rate (if HOURLY) */}
        {liveProject.projectType === "HOURLY" && liveProject.hourlyRate && (
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Hourly Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  ${liveProject.hourlyRate.toLocaleString()}/hour
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
