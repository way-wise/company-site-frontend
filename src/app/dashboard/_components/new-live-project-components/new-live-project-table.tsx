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
import { NewLiveProject } from "@/types";
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
} from "@/hooks/useNewLiveProjectMutations";
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
  const [selectedProject, setSelectedProject] = useState<NewLiveProject | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>("");
  const [newActionText, setNewActionText] = useState("");
  
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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Get new live projects data
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
    projectStatus: statusFilter !== "all" ? statusFilter : undefined,
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
      const targetedDeadline: any = {};
      if (tempBackendDeadline) targetedDeadline.backend = new Date(tempBackendDeadline).toISOString();
      if (tempFrontendDeadline) targetedDeadline.frontend = new Date(tempFrontendDeadline).toISOString();
      if (tempUiDeadline) targetedDeadline.ui = new Date(tempUiDeadline).toISOString();

      await updateProject.mutateAsync({
        projectId: selectedProject.id,
        projectData: {
          committedDeadline: tempCommittedDeadline ? new Date(tempCommittedDeadline).toISOString() : undefined,
          targetedDeadline: Object.keys(targetedDeadline).length > 0 ? targetedDeadline : undefined,
        },
      });
      setEditingDeadlines(false);
      setDeadlineModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Error saving deadlines:", error);
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
      const payload: any = {
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
  const projects = projectsData?.data || [];
  
  // Debug: Check if actions are included
  React.useEffect(() => {
    if (projects.length > 0) {
      console.log("First project data:", projects[0]);
      console.log("Does first project have actions?", projects[0]?.actions);
    }
  }, [projects]);
  
  // Sort by createdAt ascending (oldest first, newest last)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Table columns
  const columns = [
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
        const lastAction = project.actions && project.actions.length > 0
          ? project.actions[project.actions.length - 1]
          : null;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-blue-50"
              onClick={() => {
                setSelectedProject(project);
                setProjectId(project.id);
                setActionsModalOpen(true);
              }}
              title="View all actions"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {lastAction ? (
                <span className="max-w-[150px] truncate text-xs">
                  {lastAction.actionText}
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">No actions</span>
              )}
            </Button>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "projectStatus",
      cell: ({ row }: { row: { original: NewLiveProject } }) =>
        getStatusBadge(row.original.projectStatus),
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
    {
      header: "Deadline",
      accessorKey: "committedDeadline",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        const deadline = project.committedDeadline;
        const hasTargetedDeadlines = project.targetedDeadline && 
          (project.targetedDeadline.backend || project.targetedDeadline.frontend || project.targetedDeadline.ui);

        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-blue-50"
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
            {hasTargetedDeadlines && (
              <span className="ml-1 text-xs text-blue-600">+</span>
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
            className="h-8 px-2 hover:bg-blue-50"
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
      header: "Price",
      accessorKey: "price",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
        const project = row.original;
        // Only show price for FIXED projects
        if (project.projectType === "HOURLY") {
          return <span className="text-muted-foreground">-</span>;
        }
        
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
      header: "Progress",
      accessorKey: "progress",
      cell: ({ row }: { row: { original: NewLiveProject } }) => {
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
                router.push(`/dashboard/new-live-projects/${id}`);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }


  if (isError) {
    const apiError = error as any;
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
          <h2 className="text-2xl font-bold">New Live Projects</h2>
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
        <h2 className="text-2xl font-bold">New Live Projects</h2>
        <Button
          onClick={handleOpenAddModal}
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
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
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FIXED">Fixed</SelectItem>
            <SelectItem value="HOURLY">Hourly</SelectItem>
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
      >
        <Form {...addProjectForm}>
          <form
            onSubmit={addProjectForm.handleSubmit(handleAddProject)}
            className="space-y-4"
          >
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

            {addProjectForm.watch("projectType") === "FIXED" && (
              <FormFieldset>
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
              </FormFieldset>
            )}

            {addProjectForm.watch("projectType") === "HOURLY" && (
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
            )}

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
        }}
        title="Deadline Details"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Deadline management coming soon...</p>
          <Button onClick={() => setDeadlineModalOpen(false)}>Close</Button>
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
                selectedProject.documents.map((doc: any, index: number) => (
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
    </div>
  );
};
