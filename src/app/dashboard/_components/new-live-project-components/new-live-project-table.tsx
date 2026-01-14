"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Plus,
  Trash,
  Calendar,
  MessageSquare,
  FileText,
  Upload,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomModal as Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/context/UserContext";
import apiClient from "@/lib/axios";
import { NewLiveProject, TargetedDeadline, ProjectDocument } from "@/types";
import {
  CreateNewLiveProjectFormData,
  createNewLiveProjectSchema,
} from "@/components/modules/admin/projectValidation";
import {
  useNewLiveProjects,
  useCreateNewLiveProject,
  useDeleteNewLiveProject,
  useUpdateNewLiveProject,
  useProjectActions,
  useAddProjectAction,
  useUploadDocument,
  useHourLogs,
  useAddHourLog,
} from "@/hooks/useNewLiveProjectMutations";
import { useQueries } from "@tanstack/react-query";
import { newLiveProjectService } from "@/services/NewLiveProjectService";
import UpdateNewLiveProject from "./UpdateNewLiveProject";

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

// Component to display last action for a project
const NextActionCell = ({ project, onViewActions }: { project: NewLiveProject; onViewActions: () => void }) => {
  const { data: actionsData } = useProjectActions(project.id);
  const actions = actionsData?.data || [];

  // Also check if actions are already in the project object
  const projectActions = project.actions || [];
  const allActions = actions.length > 0 ? actions : projectActions;

  let lastAction = null;
  let displayText = "No actions";

  if (allActions && Array.isArray(allActions) && allActions.length > 0) {
    // Sort by actionDate or createdAt descending to get the most recent
    const sortedActions = [...allActions].sort((a: { actionDate?: string; createdAt?: string; date?: string }, b: { actionDate?: string; createdAt?: string; date?: string }) => {
      const dateA = new Date(a.actionDate || a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.actionDate || b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
    lastAction = sortedActions[0];
    if (lastAction) {
      displayText = lastAction.actionText || "Action";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 !p-0 hover:bg-transparent"
        onClick={onViewActions}
        title={lastAction ? `View all actions - Last: ${displayText}` : "View all actions"}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        <span className={`max-w-[150px] truncate text-xs ${lastAction ? "" : "text-muted-foreground"}`}>
          {displayText}
        </span>
      </Button>
    </div>
  );
};

// Component to display today's hour entry for a project
const TodayEntryCell = ({ project, onViewHourLogs }: { project: NewLiveProject; onViewHourLogs: () => void }) => {
  const { data: hourLogsData } = useHourLogs(project.id);
  const fetchedHourLogs = hourLogsData?.data || [];
  
  // Also check if hourLogs are already in the project object
  const projectHourLogs = project.hourLogs || [];
  const allHourLogs = fetchedHourLogs.length > 0 ? fetchedHourLogs : projectHourLogs;
  
  // Calculate today's hours
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayHours = allHourLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= today && logDate < tomorrow;
    })
    .reduce((sum, log) => sum + Number(log.submittedHours), 0);
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 !p-0 hover:bg-transparent"
      onClick={onViewHourLogs}
      title="View all hour logs"
    >
      <Clock className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">
        {todayHours > 0 ? `${todayHours.toFixed(1)}h` : "0h"}
      </span>
    </Button>
  );
};

export const NewLiveProjectTable = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [updateProjectModalOpen, setUpdateProjectModalOpen] = useState(false);
  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [todaysActionsModalOpen, setTodaysActionsModalOpen] = useState(false);
  const [hourLogsModalOpen, setHourLogsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<NewLiveProject | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>("");
  const [newActionText, setNewActionText] = useState("");
  const [newHourEntry, setNewHourEntry] = useState<string>("");
  const [hourEntryDate, setHourEntryDate] = useState<string>("");
  
  // Deadline editing states
  const [editingDeadlines, setEditingDeadlines] = useState(false);
  const [tempCommittedDeadline, setTempCommittedDeadline] = useState<string>("");
  const [tempBackendDeadline, setTempBackendDeadline] = useState<string>("");
  const [tempFrontendDeadline, setTempFrontendDeadline] = useState<string>("");
  const [tempUiDeadline, setTempUiDeadline] = useState<string>("");

  const handleOpenAddModal = React.useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAddProjectModalOpen(true);
  }, []);

  // Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending_active"); // Default: PENDING and ACTIVE
  const [typeFilter, setTypeFilter] = useState<string>("FIXED"); // Default: FIXED

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Get new live projects data
  // For default filter (pending_active), we'll fetch all and filter on frontend
  const {
    data: projectsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useNewLiveProjects({
    page: 1,
    limit: 10000, // Show all items
    search: debouncedSearch || undefined,
    projectStatus: statusFilter !== "all" && statusFilter !== "pending_active" ? statusFilter : undefined,
    projectType: typeFilter !== "all" ? typeFilter : undefined,
  });

  // Add Project Form
  const addProjectForm = useForm<CreateNewLiveProjectFormData>({
    resolver: zodResolver(createNewLiveProjectSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      projectName: "",
      clientName: "",
      clientLocation: "",
      projectType: "FIXED",
      projectBudget: undefined,
      paidAmount: 0,
      dueAmount: undefined,
      weeklyLimit: undefined,
      hourlyRate: undefined,
      assignedMembers: [],
      projectStatus: "PENDING",
      committedDeadline: undefined,
      targetedDeadline: undefined,
      documents: undefined,
    },
  });

  const createProject = useCreateNewLiveProject();
  const deleteProject = useDeleteNewLiveProject();
  const addAction = useAddProjectAction();
  const uploadDocument = useUploadDocument();

  // Get project actions for the selected project
  const { data: actionsData, refetch: refetchActions } = useProjectActions(projectId || "");
  const projectActions = actionsData?.data || [];
  
  // Get hour logs for the selected project (only when modal is open)
  const { data: hourLogsData, isLoading: isLoadingHourLogs, refetch: refetchHourLogs } = useHourLogs(
    hourLogsModalOpen && projectId ? projectId : ""
  );
  const hourLogs = hourLogsData?.data || [];
  
  // Add hour log mutation
  const addHourLog = useAddHourLog();
  
  // Handle adding hour entry
  const handleAddHourEntry = async () => {
    if (!projectId || !newHourEntry.trim()) {
      toast.error("Please enter hours");
      return;
    }
    
    const hours = parseFloat(newHourEntry);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter a valid number of hours");
      return;
    }
    
    // Use selected date or today's date
    const entryDate = hourEntryDate || new Date().toISOString().split("T")[0];
    const dateISO = new Date(entryDate).toISOString();
    
    try {
      await addHourLog.mutateAsync({
        projectId,
        date: dateISO,
        submittedHours: hours,
      });
      setNewHourEntry("");
      setHourEntryDate("");
      await refetchHourLogs();
      await refetch(); // Refresh the main project list to update today's entry
    } catch (error) {
      console.error("Error adding hour entry:", error);
    }
  };
  
  // Set default date to today when modal opens
  useEffect(() => {
    if (hourLogsModalOpen && !hourEntryDate) {
      setHourEntryDate(new Date().toISOString().split("T")[0]);
    }
  }, [hourLogsModalOpen, hourEntryDate]);

  // Handle adding a new action
  const handleAddAction = async () => {
    if (!projectId || !newActionText.trim()) return;
    try {
      await addAction.mutateAsync({
        projectId,
        actionText: newActionText.trim(),
      });
      setNewActionText("");
      await refetchActions();
    } catch (error) {
      console.error("Error adding action:", error);
    }
  };

  // Get update mutation
  const updateProject = useUpdateNewLiveProject();

  // Handle saving deadlines
  const handleSaveDeadlines = async () => {
    if (!selectedProject) return;
    try {
      const targetedDeadline: Partial<TargetedDeadline> = {};
      if (tempBackendDeadline && tempBackendDeadline !== "") {
        const backendDate = new Date(tempBackendDeadline);
        if (!isNaN(backendDate.getTime())) {
          targetedDeadline.backend = backendDate.toISOString();
        }
      }
      if (tempFrontendDeadline && tempFrontendDeadline !== "") {
        const frontendDate = new Date(tempFrontendDeadline);
        if (!isNaN(frontendDate.getTime())) {
          targetedDeadline.frontend = frontendDate.toISOString();
        }
      }
      if (tempUiDeadline && tempUiDeadline !== "") {
        const uiDate = new Date(tempUiDeadline);
        if (!isNaN(uiDate.getTime())) {
          targetedDeadline.ui = uiDate.toISOString();
        }
      }

      const updateData: Partial<NewLiveProject> = {};
      if (tempCommittedDeadline && tempCommittedDeadline !== "") {
        const committedDate = new Date(tempCommittedDeadline);
        if (!isNaN(committedDate.getTime())) {
          updateData.committedDeadline = committedDate.toISOString();
        }
      } else {
        updateData.committedDeadline = null;
      }

      if (Object.keys(targetedDeadline).length > 0) {
        updateData.targetedDeadline = targetedDeadline as TargetedDeadline;
      } else {
        updateData.targetedDeadline = null;
      }

      await updateProject.mutateAsync({
        projectId: selectedProject.id,
        projectData: updateData,
      });
      setEditingDeadlines(false);
      setDeadlineModalOpen(false);
      setSelectedProject(null);
      await refetch();
      toast.success("Deadlines updated successfully");
    } catch (error) {
      console.error("Error saving deadlines:", error);
      toast.error("Failed to update deadlines");
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;

    try {
      await uploadDocument.mutateAsync({
        projectId: selectedProject.id,
        file: file,
      });
      await refetch();
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      e.target.value = "";
    }
  };

  // Handle form submission
  const handleAddProject = async (data: CreateNewLiveProjectFormData) => {
    try {
      const payload: {
        projectName: string;
        clientName?: string;
        clientLocation?: string;
        projectType: "FIXED" | "HOURLY";
        assignedMembers: string[];
        projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCEL" | "ARCHIVED";
        projectBudget?: number;
        paidAmount?: number;
        dueAmount?: number;
        weeklyLimit?: number;
        hourlyRate?: number;
        committedDeadline?: string;
        targetedDeadline?: TargetedDeadline;
        documents?: ProjectDocument[];
      } = {
        projectName: data.projectName,
        clientName: data.clientName || undefined,
        clientLocation: data.clientLocation || undefined,
        projectType: data.projectType,
        assignedMembers: data.assignedMembers,
        projectStatus: data.projectStatus || "PENDING",
      };

      if (data.projectType === "FIXED") {
        payload.projectBudget = data.projectBudget;
        payload.paidAmount = data.paidAmount ?? 0;
        payload.dueAmount = data.dueAmount;
      } else if (data.projectType === "HOURLY") {
        payload.weeklyLimit = data.weeklyLimit;
        payload.hourlyRate = data.hourlyRate;
      }

      if (data.committedDeadline) {
        // Convert to ISO datetime string
        const deadlineDate = new Date(data.committedDeadline);
        payload.committedDeadline = deadlineDate.toISOString();
      }

      if (data.targetedDeadline) {
        payload.targetedDeadline = data.targetedDeadline;
      }

      if (data.documents && data.documents.length > 0) {
        payload.documents = data.documents;
      }

      await createProject.mutateAsync(payload);
      addProjectForm.reset();
      setAddProjectModalOpen(false);
      // Manually refetch to ensure new projects appear
      await refetch();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!projectId) return;
    try {
      await deleteProject.mutateAsync(projectId);
      setDeleteModalOpen(false);
      setProjectId("");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Get projects list
  let projects = projectsData?.data || [];
  
  // Apply frontend filtering for default "pending_active" status filter
  if (statusFilter === "pending_active") {
    projects = projects.filter((project: NewLiveProject) => 
      project.projectStatus === "PENDING" || project.projectStatus === "ACTIVE"
    );
  }
  
  // Debug: Log first project to check structure
  React.useEffect(() => {
    if (projects.length > 0) {
      const firstProject = projects[0];
      console.log("First project structure:", firstProject);
      console.log("Has actions?", !!firstProject?.actions);
      console.log("Actions:", firstProject?.actions);
      console.log("All project keys:", Object.keys(firstProject));
      // Check if actions are nested somewhere else
      if (!firstProject?.actions) {
        console.log("Actions not found in project, checking nested structures...");
      }
    }
  }, [projects]);
  
  // Sort by createdAt ascending (oldest first, newest last) - default sort
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Fetch actions for all projects when modal is open
  const actionsQueries = useQueries({
    queries: todaysActionsModalOpen
      ? sortedProjects.map((project) => ({
          queryKey: ["new-live-project-actions", project.id],
          queryFn: () => newLiveProjectService.getProjectActions(project.id),
          enabled: todaysActionsModalOpen,
          staleTime: 1 * 60 * 1000,
        }))
      : [],
  });

  // Get today's actions for all projects
  const getTodaysActions = (): Array<{
    project: NewLiveProject;
    action: { actionText: string; actionDate: string; createdAt: string; creator?: { user: { name: string } } };
  }> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysActions: Array<{
      project: NewLiveProject;
      action: { actionText: string; actionDate: string; createdAt: string; creator?: { user: { name: string } } };
    }> = [];

    sortedProjects.forEach((project, index) => {
      // Try to get actions from fetched queries first
      const fetchedActions = actionsQueries[index]?.data?.data || [];
      // Fallback to actions in project object
      const projectActions = project.actions || [];
      const allActions = fetchedActions.length > 0 ? fetchedActions : projectActions;

      if (allActions.length > 0) {
        // Get the most recent action
        const sortedActions = [...allActions].sort((a: { actionDate?: string; createdAt?: string }, b: { actionDate?: string; createdAt?: string }) => {
          const dateA = new Date(a.actionDate || a.createdAt || 0).getTime();
          const dateB = new Date(b.actionDate || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        const lastAction = sortedActions[0];
        if (lastAction) {
          const actionDate = new Date(lastAction.actionDate || lastAction.createdAt || 0);
          // Check if action is from today
          if (actionDate >= today && actionDate < tomorrow) {
            todaysActions.push({
              project,
              action: lastAction as { actionText: string; actionDate: string; createdAt: string; creator?: { user: { name: string } } },
            });
          }
        }
      }
    });

    // Sort by action date (most recent first)
    return todaysActions.sort((a, b) => {
      const dateA = new Date(a.action.actionDate || a.action.createdAt || 0).getTime();
      const dateB = new Date(b.action.actionDate || b.action.createdAt || 0).getTime();
      return dateB - dateA;
    });
  };

  // Helper function to create sortable header
  const createSortableHeader = (label: string) => {
    const SortableHeader = ({ column }: { column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void } }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>{label}</span>
          {isSorted === "asc" ? (
            <ArrowUp className="h-4 w-4 text-primary" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-4 w-4 text-primary" />
          ) : (
            <ArrowUp className="h-4 w-4 text-muted-foreground opacity-50" />
          )}
        </div>
      );
    };
    SortableHeader.displayName = `SortableHeader-${label}`;
    return SortableHeader;
  };

  // Define all possible columns
  const allColumns = [
    {
      header: "Project Name",
      accessorKey: "projectName",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        return (
          <div className="font-medium max-w-[120px] truncate" title={row.original.projectName}>
            {row.original.projectName}
          </div>
        );
      },
    },
    {
      header: "Client Name",
      accessorKey: "clientName",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const clientName = row.original.clientName || "N/A";
        return (
          <div className="font-medium max-w-[150px] truncate" title={clientName}>
            {clientName}
          </div>
        );
      },
    },
    {
      header: "Next Actions",
      accessorKey: "nextActions",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        return <NextActionCell project={project} onViewActions={() => {
          setSelectedProject(project);
          setProjectId(project.id);
          setActionsModalOpen(true);
        }} />;
      },
    },
    {
      header: "Assigned Members",
      accessorKey: "assignedMembers",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const members = row.original.assignedMembers;
        if (!members || members.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        const membersStr = members.join(", ");
        return (
          <div className="max-w-[200px] truncate" title={membersStr}>
            {membersStr}
          </div>
        );
      },
    },
    // Hourly columns - only show for HOURLY projects
    {
      header: "Hourly Rate",
      accessorKey: "hourlyRate",
      showForType: "HOURLY",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const hourlyRate = project.hourlyRate;
        return (
          <div className="font-medium">
            {hourlyRate ? `$${hourlyRate.toLocaleString()}/hr` : <span className="text-muted-foreground">-</span>}
          </div>
        );
      },
    },
    {
      header: "Weekly Limit",
      accessorKey: "weeklyLimit",
      showForType: "HOURLY",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const weeklyLimit = project.weeklyLimit;
        return (
          <div className="font-medium">
            {weeklyLimit ? `${weeklyLimit} hrs/week` : <span className="text-muted-foreground">-</span>}
          </div>
        );
      },
    },
    {
      header: "Today's Entry",
      accessorKey: "todayEntry",
      showForType: "HOURLY",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        return (
          <TodayEntryCell 
            project={project} 
            onViewHourLogs={() => {
              setSelectedProject(project);
              setProjectId(project.id);
              setHourLogsModalOpen(true);
            }} 
          />
        );
      },
    },
    // Fixed columns - only show for FIXED projects
    {
      header: createSortableHeader("Deadline"),
      accessorKey: "committedDeadline",
      showForType: "FIXED",
      enableSorting: true,
      sortingFn: (rowA: { original: NewLiveProject }, rowB: { original: NewLiveProject }) => {
        const projectA = rowA.original as NewLiveProject;
        const projectB = rowB.original as NewLiveProject;
        
        // Get the earliest deadline (committed or targeted)
        const getEarliestDeadline = (project: NewLiveProject): number => {
          const deadlines: number[] = [];
          if (project.committedDeadline) {
            deadlines.push(new Date(project.committedDeadline).getTime());
          }
          if (project.targetedDeadline) {
            if (project.targetedDeadline.backend) {
              deadlines.push(new Date(project.targetedDeadline.backend).getTime());
            }
            if (project.targetedDeadline.frontend) {
              deadlines.push(new Date(project.targetedDeadline.frontend).getTime());
            }
            if (project.targetedDeadline.ui) {
              deadlines.push(new Date(project.targetedDeadline.ui).getTime());
            }
          }
          return deadlines.length > 0 ? Math.min(...deadlines) : Infinity;
        };
        
        const deadlineA = getEarliestDeadline(projectA);
        const deadlineB = getEarliestDeadline(projectB);
        
        return deadlineA - deadlineB;
      },
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const deadline = project.committedDeadline;
        const targetedDeadline = project.targetedDeadline;
        
        // Get all deadline labels
        const deadlineLabels: string[] = [];
        if (deadline) {
          deadlineLabels.push("Committed");
        }
        if (targetedDeadline?.backend) deadlineLabels.push("Backend");
        if (targetedDeadline?.frontend) deadlineLabels.push("Frontend");
        if (targetedDeadline?.ui) deadlineLabels.push("UI");

        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 !p-0 hover:bg-transparent"
            onClick={() => {
              setSelectedProject(project);
              setDeadlineModalOpen(true);
            }}
            title="View deadline details"
          >
            <Calendar className="h-4 w-4 mr-1" />
            {deadline ? (
              <span className="text-sm">
                {new Date(deadline).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">Not set</span>
            )}
            {deadlineLabels.length > 1 && (
              <span className="ml-1 text-xs text-blue-600" title={deadlineLabels.join(", ")}>
                +{deadlineLabels.length - 1}
              </span>
            )}
          </Button>
        );
      },
    },
    {
      header: "Documents",
      accessorKey: "documents",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const documents = project.documents || [];
        const documentCount = Array.isArray(documents) ? documents.length : 0;

        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 !p-0 hover:bg-transparent"
            onClick={() => {
              setSelectedProject(project);
              setProjectId(project.id);
              setDocumentsModalOpen(true);
            }}
            title="View documents"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {documentCount} {documentCount === 1 ? "doc" : "docs"}
            </span>
          </Button>
        );
      },
    },
    {
      header: "Paid / Project Budget",
      accessorKey: "price",
      showForType: "FIXED",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const paidAmount = project.paidAmount ?? 0;
        const projectBudget = project.projectBudget ?? 0;
        
        if (projectBudget === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        
        return (
          <div className="font-medium">
            ${paidAmount.toLocaleString()} / ${projectBudget.toLocaleString()}
          </div>
        );
      },
    },
    {
      header: createSortableHeader("Progress"),
      accessorKey: "progress",
      enableSorting: true,
      sortingFn: (_rowA: { original: NewLiveProject }, _rowB: { original: NewLiveProject }) => {
        // Note: NewLiveProject doesn't have progress in schema, but we can sort by 0 for now
        const progressA = 0; // TODO: Add progress tracking
        const progressB = 0;
        return progressA - progressB;
      },
      cell: ({ row: _row }: { row: { original: NewLiveProject } }) => {
        // Note: NewLiveProject doesn't have progress in schema, but we can show 0% for now
        const progress = 0; // TODO: Add progress tracking
        
        return (
          <div className="w-full max-w-[100px]">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[35px]">
                {progress}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const { id } = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                router.push(`/dashboard/live-projects/${id}`);
              }}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setSelectedProject(row.original);
                setProjectId(id);
                setUpdateProjectModalOpen(true);
              }}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                setProjectId(id);
                setDeleteModalOpen(true);
              }}
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter columns based on project type filter
  type ColumnWithType = typeof allColumns[number] & { showForType?: "FIXED" | "HOURLY" };
  const columns = allColumns.filter((col) => {
    // If column has showForType, only include it if typeFilter matches
    const columnWithType = col as ColumnWithType;
    if (columnWithType.showForType) {
      return typeFilter === columnWithType.showForType || typeFilter === "all";
    }
    // Always show columns without showForType (common columns)
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }


  if (isError) {
    interface ApiError extends Error {
      response?: {
        data?: {
          message?: string;
          error?: string | unknown[];
        };
        status?: number;
      };
    }
    const apiError = error as ApiError;
    const apiErrorMessage =
      apiError?.response?.data?.message ||
      apiError?.message ||
      "An unknown error occurred";
    const statusCode = apiError?.response?.status;

    // Check if it's a permission error
    const isPermissionError =
      apiErrorMessage.toLowerCase().includes("permission") ||
      apiErrorMessage.toLowerCase().includes("don't have permission") ||
      statusCode === 403;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Live Projects</h2>
          <Button
            onClick={handleOpenAddModal}
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Failed to load projects</p>
          <p className="text-sm mt-1">{apiErrorMessage}</p>
          {isPermissionError && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
              <p className="font-medium mb-1">Permission Issue Detected:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure the backend endpoint <code className="bg-yellow-100 px-1 rounded">/new-live-projects</code> exists</li>
                <li>Create permissions: <code className="bg-yellow-100 px-1 rounded">read_new_live_project</code>, <code className="bg-yellow-100 px-1 rounded">create_new_live_project</code></li>
                <li>Assign these permissions to SUPER_ADMIN role</li>
                <li>Or configure backend to allow SUPER_ADMIN to bypass permission checks</li>
              </ul>
            </div>
          )}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-2 border-red-300 text-red-800 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Projects</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setTodaysActionsModalOpen(true)}
            type="button"
            variant="outline"
          >
            <Clock className="mr-2 h-4 w-4" />
            Today&apos;s Actions
          </Button>
          <Button
            onClick={handleOpenAddModal}
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending_active">Pending & Active</SelectItem>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCEL">Cancel</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FIXED">Fixed</SelectItem>
            <SelectItem value="HOURLY">Hourly</SelectItem>
            <SelectItem value="all">All Types</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedProjects}
        hidePagination={true}
      />

      {/* Add Project Modal */}
      <Modal
        isOpen={addProjectModalOpen}
        onClose={() => {
          setAddProjectModalOpen(false);
          addProjectForm.reset();
        }}
        title="Add New Live Project"
        className="max-w-5xl"
      >
        <Form {...addProjectForm}>
          <form
            onSubmit={addProjectForm.handleSubmit(handleAddProject)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={addProjectForm.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addProjectForm.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter client name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addProjectForm.control}
                name="clientLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter client location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addProjectForm.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear related fields when type changes
                        if (value === "FIXED") {
                          addProjectForm.setValue("weeklyLimit", undefined);
                        } else {
                          addProjectForm.setValue("projectBudget", undefined);
                          addProjectForm.setValue("paidAmount", 0);
                          addProjectForm.setValue("dueAmount", undefined);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                        <SelectItem value="HOURLY">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {addProjectForm.watch("projectType") === "FIXED" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addProjectForm.control}
                  name="projectBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Budget *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          placeholder="Enter project budget"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProjectForm.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : parseFloat(value));
                          }}
                          placeholder="Enter paid amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProjectForm.control}
                  name="dueAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          placeholder="Enter due amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {addProjectForm.watch("projectType") === "HOURLY" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addProjectForm.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          placeholder="Enter hourly rate"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addProjectForm.control}
                  name="weeklyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Limit (hours) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          placeholder="Enter weekly limit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={addProjectForm.control}
                name="assignedMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Members *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Split by comma and trim each member
                          const members = value
                            .split(",")
                            .map((m) => m.trim())
                            .filter((m) => m.length > 0);
                          field.onChange(members);
                        }}
                        placeholder="Enter member names (comma-separated)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addProjectForm.control}
                name="committedDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Committed Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? new Date(value).toISOString() : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddProjectModalOpen(false);
                  addProjectForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      {/* Update Project Modal */}
      {selectedProject && (
        <UpdateNewLiveProject
          isOpen={updateProjectModalOpen}
          onClose={() => {
            setUpdateProjectModalOpen(false);
            setSelectedProject(null);
            setProjectId("");
          }}
          project={selectedProject}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectId("");
        }}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setProjectId("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deadline Details Modal */}
      <Modal
        isOpen={deadlineModalOpen}
        onClose={() => {
          setDeadlineModalOpen(false);
          setSelectedProject(null);
          setEditingDeadlines(false);
          setTempCommittedDeadline("");
          setTempBackendDeadline("");
          setTempFrontendDeadline("");
          setTempUiDeadline("");
        }}
        title="Deadline Management"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {selectedProject && (
            <>
              {/* Committed Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Committed Deadline</label>
                {editingDeadlines ? (
                  <Input
                    type="datetime-local"
                    value={tempCommittedDeadline && tempCommittedDeadline !== "" 
                      ? new Date(tempCommittedDeadline).toISOString().slice(0, 16) 
                      : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTempCommittedDeadline(value ? new Date(value).toISOString() : "");
                    }}
                  />
                ) : (
                  <div className="text-sm p-2 bg-gray-50 rounded">
                    {selectedProject.committedDeadline
                      ? new Date(selectedProject.committedDeadline).toLocaleString()
                      : "Not set"}
                  </div>
                )}
              </div>

              {/* Targeted Deadlines */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Targeted Deadlines</label>
                
                {/* Backend Deadline */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Backend</label>
                  {editingDeadlines ? (
                    <Input
                      type="datetime-local"
                      value={tempBackendDeadline && tempBackendDeadline !== ""
                        ? new Date(tempBackendDeadline).toISOString().slice(0, 16)
                        : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTempBackendDeadline(value ? new Date(value).toISOString() : "");
                      }}
                    />
                  ) : (
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      {selectedProject.targetedDeadline?.backend
                        ? new Date(selectedProject.targetedDeadline.backend).toLocaleString()
                        : "Not set"}
                    </div>
                  )}
                </div>

                {/* Frontend Deadline */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Frontend</label>
                  {editingDeadlines ? (
                    <Input
                      type="datetime-local"
                      value={tempFrontendDeadline && tempFrontendDeadline !== ""
                        ? new Date(tempFrontendDeadline).toISOString().slice(0, 16)
                        : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTempFrontendDeadline(value ? new Date(value).toISOString() : "");
                      }}
                    />
                  ) : (
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      {selectedProject.targetedDeadline?.frontend
                        ? new Date(selectedProject.targetedDeadline.frontend).toLocaleString()
                        : "Not set"}
                    </div>
                  )}
                </div>

                {/* UI Deadline */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">UI</label>
                  {editingDeadlines ? (
                    <Input
                      type="datetime-local"
                      value={tempUiDeadline && tempUiDeadline !== ""
                        ? new Date(tempUiDeadline).toISOString().slice(0, 16)
                        : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTempUiDeadline(value ? new Date(value).toISOString() : "");
                      }}
                    />
                  ) : (
                    <div className="text-sm p-2 bg-gray-50 rounded">
                      {selectedProject.targetedDeadline?.ui
                        ? new Date(selectedProject.targetedDeadline.ui).toLocaleString()
                        : "Not set"}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                {editingDeadlines ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingDeadlines(false);
                        // Reset temp values to current values
                        setTempCommittedDeadline(selectedProject.committedDeadline || "");
                        setTempBackendDeadline(selectedProject.targetedDeadline?.backend || "");
                        setTempFrontendDeadline(selectedProject.targetedDeadline?.frontend || "");
                        setTempUiDeadline(selectedProject.targetedDeadline?.ui || "");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveDeadlines}
                      disabled={updateProject.isPending}
                    >
                      {updateProject.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeadlineModalOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingDeadlines(true);
                        // Initialize temp values with current values
                        setTempCommittedDeadline(selectedProject.committedDeadline || "");
                        setTempBackendDeadline(selectedProject.targetedDeadline?.backend || "");
                        setTempFrontendDeadline(selectedProject.targetedDeadline?.frontend || "");
                        setTempUiDeadline(selectedProject.targetedDeadline?.ui || "");
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Deadlines
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Actions/Notes Modal */}
      <Modal
        isOpen={actionsModalOpen}
        onClose={() => {
          setActionsModalOpen(false);
          setSelectedProject(null);
          setProjectId("");
          setNewActionText("");
        }}
        title="Project Actions & Notes"
      >
        <div className="space-y-4">
          {/* Actions List */}
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {projectActions.length > 0 ? (
              projectActions.map((action) => (
                <div
                  key={action.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <p className="text-sm">{action.actionText}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(action.actionDate).toLocaleDateString()}
                    </span>
                    {action.creator && (
                      <>
                        <span>•</span>
                        <span>{action.creator.user.name}</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No actions recorded yet
              </p>
            )}
          </div>

          {/* Add New Action */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium mb-2 block">
              Add New Action
            </label>
            <Textarea
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              placeholder="Enter action or note..."
              rows={3}
              className="mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActionsModalOpen(false);
                  setSelectedProject(null);
                  setProjectId("");
                  setNewActionText("");
                }}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleAddAction}
                disabled={!newActionText.trim() || addAction.isPending}
              >
                {addAction.isPending ? "Adding..." : "Add Action"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={documentsModalOpen}
        onClose={() => {
          setDocumentsModalOpen(false);
          setSelectedProject(null);
          setProjectId("");
        }}
        title="Project Documents"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Upload Document</h4>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                onChange={handleDocumentUpload}
                disabled={uploadDocument.isPending}
                className="cursor-pointer"
              />
              {uploadDocument.isPending && <span className="text-xs text-blue-500">Uploading...</span>}
            </div>
            <p className="text-xs text-muted-foreground">Supported formats: PDF, Images, Docx</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents</h4>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {selectedProject?.documents && selectedProject.documents.length > 0 ? (
                selectedProject.documents.map((doc: ProjectDocument, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" title={doc.fileName}>{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.uploadedAt).toLocaleDateString()} • {(doc.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={async () => {
                          if (!selectedProject) return;
                          const updatedDocs = selectedProject.documents?.filter((_, i) => i !== index);
                          try {
                            await updateProject.mutateAsync({
                              projectId: selectedProject.id,
                              projectData: { documents: updatedDocs },
                            });
                            await refetch();
                            toast.success("Document deleted");
                          } catch (error) {
                            toast.error("Failed to delete document");
                          }
                        }}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Hour Logs Modal */}
      <Modal
        isOpen={hourLogsModalOpen}
        onClose={() => {
          setHourLogsModalOpen(false);
          setSelectedProject(null);
          setProjectId("");
          setNewHourEntry("");
          setHourEntryDate("");
        }}
        title={`Hour Logs - ${selectedProject?.projectName || ""}`}
        className="max-w-4xl"
      >
        {isLoadingHourLogs ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading hour logs...</div>
          </div>
        ) : (
          (() => {
            // Calculate totals
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Get start of week (Monday)
            const startOfWeek = new Date(today);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);
            
            // Get start of month
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            
            // Calculate totals
            const todayHours = hourLogs
              .filter((log) => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate >= today && logDate < tomorrow;
              })
              .reduce((sum, log) => sum + Number(log.submittedHours), 0);
            
            const weekHours = hourLogs
              .filter((log) => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate >= startOfWeek;
              })
              .reduce((sum, log) => sum + Number(log.submittedHours), 0);
            
            const monthHours = hourLogs
              .filter((log) => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate >= startOfMonth;
              })
              .reduce((sum, log) => sum + Number(log.submittedHours), 0);
            
            // Sort logs by date (most recent first)
            const sortedLogs = [...hourLogs].sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });
            
            return (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Today</div>
                    <div className="text-2xl font-bold text-blue-900">{todayHours.toFixed(1)}h</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">This Week</div>
                    <div className="text-2xl font-bold text-green-900">{weekHours.toFixed(1)}h</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium mb-1">This Month</div>
                    <div className="text-2xl font-bold text-purple-900">{monthHours.toFixed(1)}h</div>
                  </div>
                </div>
                
                {/* Add Hour Entry Form */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Add Hour Entry</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={hourEntryDate}
                        onChange={(e) => setHourEntryDate(e.target.value)}
                        className="w-full"
                        max={new Date().toISOString().split("T")[0]} // Can't select future dates
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Hours</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newHourEntry}
                        onChange={(e) => setNewHourEntry(e.target.value)}
                        placeholder="e.g., 8.5"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNewHourEntry("");
                        setHourEntryDate(new Date().toISOString().split("T")[0]);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddHourEntry}
                      disabled={!newHourEntry.trim() || addHourLog.isPending}
                    >
                      {addHourLog.isPending ? "Adding..." : "Add Entry"}
                    </Button>
                  </div>
                </div>
                
                {/* Previous Days Entries */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Previous Days Entries</h4>
                  <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-lg p-4">
                    {sortedLogs.length > 0 ? (
                      sortedLogs.map((log) => {
                        const logDate = new Date(log.date);
                        const isToday = logDate >= today && logDate < tomorrow;
                        
                        return (
                          <div
                            key={log.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isToday ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">
                                  {logDate.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                  {isToday && (
                                    <Badge className="ml-2 bg-blue-500 text-white">Today</Badge>
                                  )}
                                </div>
                                {log.user?.user?.name && (
                                  <div className="text-xs text-muted-foreground">
                                    By: {log.user.user.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-lg font-bold">
                              {Number(log.submittedHours).toFixed(1)}h
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">No hour logs recorded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </Modal>

      {/* Today's Actions Modal */}
      <Modal
        isOpen={todaysActionsModalOpen}
        onClose={() => setTodaysActionsModalOpen(false)}
        title="Today's Actions"
        className="max-w-4xl"
      >
        <div className="space-y-4">
          {(() => {
            // Check if queries are still loading
            const isLoadingActions = actionsQueries.some((query) => query.isLoading);
            
            if (isLoadingActions) {
              return (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">Loading today&apos;s actions...</div>
                </div>
              );
            }

            const todaysActions = getTodaysActions();
            if (todaysActions.length > 0) {
              return (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {todaysActions.map((item: { project: NewLiveProject; action: { actionText: string; actionDate: string; createdAt: string; creator?: { user: { name: string } } } }, index: number) => (
                    <div
                      key={`${item.project.id}-${index}`}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {item.project.projectName}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {item.project.projectStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {item.action.actionText}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.action.actionDate || item.action.createdAt).toLocaleString()}
                            </span>
                            {item.action.creator?.user?.name && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {item.action.creator.user.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTodaysActionsModalOpen(false);
                            router.push(`/dashboard/live-projects/${item.project.id}`);
                          }}
                          title="View Project"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No actions recorded today</p>
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};
