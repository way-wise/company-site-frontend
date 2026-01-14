"use client";

import {
  CreateLiveProjectFormData,
  createLiveProjectSchema,
} from "@/components/modules/admin/projectValidation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { CustomModal as Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateLiveProject,
  useDeleteLiveProject,
  useLiveProjects,
  useUpdateLiveProject,
} from "@/hooks/useLiveProjectMutations";
import { LiveProject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateLiveProject from "./UpdateLiveProject";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";

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

export const LiveProjectTable = () => {
  // Get current user for notes
  const { user } = useAuth();
  const router = useRouter();
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addLiveProjectModalOpen, setAddLiveProjectModalOpen] = useState(false);
  const [updateLiveProjectModalOpen, setUpdateLiveProjectModalOpen] =
    useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedLiveProject, setSelectedLiveProject] =
    useState<LiveProject | null>(null);
  const [liveProjectId, setLiveProjectId] = useState<string | undefined>("");

  // Handler for opening add modal - wrapped to ensure it works in production
  const handleOpenAddModal = React.useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAddLiveProjectModalOpen(true);
  }, []);

  // Search states (no pagination - show all items)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("FIXED");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get live projects data using TanStack Query (fetch all items - no pagination)
  const {
    data: liveProjectsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useLiveProjects({
    page: 1,
    limit: 10000, // Fetch all items
    search: debouncedSearch || undefined,
    projectStatus: statusFilter !== "all" ? statusFilter : undefined,
    projectType: typeFilter !== "all" ? typeFilter : undefined,
  });

  // Add Live Project Form
  const addLiveProjectForm = useForm<CreateLiveProjectFormData>({
    resolver: zodResolver(createLiveProjectSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      projectName: "",
      clientName: "",
      clientLocation: "",
      projectType: "FIXED",
      projectBudget: undefined,
      hourlyRate: undefined,
      paidAmount: 0,
      dueAmount: 0,
      assignedMembers: [],
      projectStatus: "PENDING",
      deadline: undefined,
      progress: undefined,
      nextActions: "",
    },
  });

  // Watch project type to show/hide appropriate fields
  const projectType = addLiveProjectForm.watch("projectType");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Custom hooks for mutations
  const createLiveProjectMutation = useCreateLiveProject();
  const deleteLiveProjectMutation = useDeleteLiveProject();
  const updateLiveProjectMutation = useUpdateLiveProject();

  // Handle Add Live Project
  const handleAddLiveProject = async (values: CreateLiveProjectFormData) => {
    try {
      // Convert assignedMembers to string (API expects comma-separated string)
      let assignedMembersString: string = "";
      if (Array.isArray(values.assignedMembers)) {
        assignedMembersString = values.assignedMembers.join(", ");
      } else if (typeof values.assignedMembers === "string") {
        assignedMembersString = values.assignedMembers;
      }

      // Convert deadline from date string to ISO datetime string
      let deadlineISO: string | undefined = undefined;
      if (values.deadline) {
        // If deadline is just a date (YYYY-MM-DD), convert to ISO datetime
        // Set time to end of day (23:59:59) in UTC
        const dateStr = values.deadline;
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // It's a date string, convert to ISO datetime
          deadlineISO = new Date(dateStr + "T23:59:59.000Z").toISOString();
        } else {
          // Already an ISO string, use as-is
          deadlineISO = dateStr;
        }
      }

      // Build payload based on project type
      const basePayload = {
        projectName: values.projectName,
        clientName: values.clientName,
        clientLocation: values.clientLocation ? values.clientLocation : undefined,
        projectType: values.projectType,
        assignedMembers: assignedMembersString,
        projectStatus: values.projectStatus || "PENDING",
        nextActions: values.nextActions || undefined,
        ...(deadlineISO && { deadline: deadlineISO }),
        ...(values.progress !== undefined && { progress: values.progress }),
      };

      // Add fields based on project type
      if (values.projectType === "HOURLY") {
        // For HOURLY projects, hourlyRate is required
        if (!values.hourlyRate || values.hourlyRate <= 0) {
          addLiveProjectForm.setError("hourlyRate", {
            type: "manual",
            message: "Hourly rate must be a positive number",
          });
          return;
        }
        const payload = {
          ...basePayload,
          hourlyRate: values.hourlyRate,
        };
        await createLiveProjectMutation.mutateAsync(payload);
      } else {
        // For FIXED and other types, projectBudget is required
        if (!values.projectBudget || values.projectBudget <= 0) {
          addLiveProjectForm.setError("projectBudget", {
            type: "manual",
            message: "Project budget must be a positive number",
          });
          return;
        }
        // Ensure paidAmount and dueAmount are always numbers (including 0) for FIXED projects
        const paidAmountValue = typeof values.paidAmount === "number" ? values.paidAmount : 0;
        const dueAmountValue = typeof values.dueAmount === "number" ? values.dueAmount : 0;
        
        const payload = {
          ...basePayload,
          projectBudget: values.projectBudget,
          paidAmount: paidAmountValue,
          dueAmount: dueAmountValue,
        };
        await createLiveProjectMutation.mutateAsync(payload);
      }
      setAddLiveProjectModalOpen(false);
      addLiveProjectForm.reset();
    } catch (error: unknown) {
      // Parse validation errors and set them on form fields
      const apiError = error as {
        response?: {
          data?: {
            error?: Array<{
              code: string;
              path: string[];
              message: string;
            }>;
          };
        };
      };

      if (Array.isArray(apiError.response?.data?.error)) {
        const validationErrors = apiError.response.data.error;
        validationErrors.forEach((err) => {
          // Extract field name from path (e.g., ["body", "projectType"] -> "projectType")
          const fieldName = err.path[err.path.length - 1] as keyof CreateLiveProjectFormData;
          
          // Format the error message to be more user-friendly
          let friendlyMessage = err.message;
          if (err.message.includes("expected one of")) {
            const match = err.message.match(/expected one of "([^"]+)"/);
            if (match) {
              const options = match[1].split("|").map(opt => opt.trim());
              friendlyMessage = `Please select one of: ${options.join(", ")}`;
            }
          }
          
          // Set error on the form field
          addLiveProjectForm.setError(fieldName, {
            type: "manual",
            message: friendlyMessage,
          });
        });
      }
    }
  };

  // Handle Live Project Deletion
  const handleDeleteLiveProject = async () => {
    if (!liveProjectId) return;

    try {
      await deleteLiveProjectMutation.mutateAsync(liveProjectId);
      setDeleteModalOpen(false);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  // Extract data from API response (matching blogs pattern)
  const liveProjectsRaw = liveProjectsData?.data || [];
  // Sort by updatedAt ascending (oldest first, newest last)
  const liveProjects = [...liveProjectsRaw].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateA - dateB; // Ascending order (oldest first, newest last)
  });
  const meta = liveProjectsData?.meta;
  const totalItems = meta?.total || 0;

  // Check if we have data
  const hasData = liveProjects.length > 0;

  // Helper function to extract error message
  const getErrorMessage = (err: unknown): string => {
    // Check if it's an Error object
    if (err && typeof err === "object" && "message" in err) {
      // Check if it's an API error with response data
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      
      // Try to get message from API response first
      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }
      if (apiError.response?.data?.error) {
        return apiError.response.data.error;
      }
      // Fall back to error message
      if (apiError.message && typeof apiError.message === "string") {
        return apiError.message;
      }
    }
    return "An unexpected error occurred while loading live projects";
  };

  // Handle error state (matching blogs pattern)
  if (error) {
    const errorMessage = getErrorMessage(error);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Projects</h2>
            <p className="text-gray-600">Manage your live projects</p>
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAddLiveProjectModalOpen(true);
            }}
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Live Project
          </Button>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error loading live projects</p>
          <p className="text-sm mt-1">{errorMessage}</p>
          <p className="text-xs mt-2 text-red-600 mb-3">
            Please check your connection and try again. If the problem persists, contact support.
          </p>
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

  // Handle API response failure (matching blogs pattern)
  if (liveProjectsData && !liveProjectsData.success) {
    const apiErrorMessage = liveProjectsData.message || 
      "An unexpected error occurred while loading live projects";
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Projects</h2>
            <p className="text-gray-600">Manage your live projects</p>
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAddLiveProjectModalOpen(true);
            }}
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Live Project
          </Button>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Failed to load live projects</p>
          <p className="text-sm mt-1">{apiErrorMessage}</p>
          <p className="text-xs mt-2 text-red-600 mb-3">
            The server returned an error. Please check your permissions or contact support if this issue persists.
          </p>
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

  // Table columns - simplified view
  const columns = [
    {
      header: "Project Name",
      accessorKey: "projectName",
      cell: ({ row }: { row: { original: LiveProject } }) => {
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
      cell: ({ row }: { row: { original: LiveProject } }) => {
        return (
          <div className="font-medium max-w-[150px] truncate" title={row.original.clientName}>
            {row.original.clientName}
          </div>
        );
      },
    },
    // {
    //   header: "Location",
    //   accessorKey: "clientLocation",
    //   cell: ({ row }: { row: { original: LiveProject } }) => {
    //     const location = row.original.clientLocation || "N/A";
    //     return (
    //       <div className="max-w-[120px] truncate" title={location}>
    //         {location}
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Type",
      accessorKey: "projectType",
      cell: ({ row }: { row: { original: LiveProject } }) =>
        getProjectTypeBadge(row.original.projectType),
    },
    {
      header: "Assigned Members",
      accessorKey: "assignedMembers",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const members = row.original.assignedMembers;
        if (!members || members.trim() === "") {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="max-w-[200px] truncate" title={members}>
            {members}
          </div>
        );
      },
    },
    {
      header: "Next Action",
      accessorKey: "nextActions",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const project = row.original;
        // Get last note from dailyNotes or fallback to nextActions
        let lastNote = "";
        if (project.dailyNotes && Array.isArray(project.dailyNotes) && project.dailyNotes.length > 0) {
          // Sort by createdAt (newest first) and get the first one
          const sortedNotes = [...project.dailyNotes].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          lastNote = sortedNotes[0].note;
        } else if (project.nextActions) {
          lastNote = project.nextActions;
        }
        
        if (!lastNote || lastNote.trim() === "") {
          return <span className="text-muted-foreground">-</span>;
        }
        
        return (
          <div 
            className="max-w-[250px] truncate cursor-pointer hover:text-primary transition-colors" 
            title={lastNote}
            onClick={() => {
              setSelectedLiveProject(project);
              setNotesModalOpen(true);
            }}
          >
            {lastNote}
          </div>
        );
      },
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const deadline = row.original.deadline;
        if (!deadline) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="text-sm">
            {new Date(deadline).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      header: "Progress",
      accessorKey: "progress",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const progress = row.original.progress;
        // Default to 0 if null/undefined, but still show the progress bar
        const progressValue = progress === undefined || progress === null ? 0 : progress;
        
        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 bg-gray-200 rounded-full h-2 border border-gray-300">
              <div
                className="!bg-balck h-2 rounded-full transition-all"
                style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
              />
            </div>
            <span className="text-sm font-medium w-10">
              {progressValue}%
            </span>
          </div>
        );
      },
    },
    {
      header: "Paid / Project Budget",
      accessorKey: "price",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const project = row.original;
        // Only show price for non-HOURLY projects
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
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const { id } = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                router.push(`/dashboard/old-live-projects/${id}`);
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
                setUpdateLiveProjectModalOpen(true);
                setSelectedLiveProject(row.original);
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
                setLiveProjectId(id);
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

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Live Projects</h1>
        <Button 
          onClick={handleOpenAddModal}
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Live Project</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search live projects..."
              className="max-w-xs"
              value={search}
              onChange={handleSearchChange}
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
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="HOURLY">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && !liveProjectsData && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
              <p className="text-muted-foreground">Loading live projects...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && !hasData && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No live projects found
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Get started by creating your first live project
            </p>
            <Button
              onClick={handleOpenAddModal}
              type="button"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Live Project
            </Button>
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !isError && hasData && (
          <DataTable
            data={liveProjects}
            columns={columns}
            isPending={isLoading}
            hidePagination={true}
          />
        )}
      </div>

      {/* Live Project Creation Modal */}
      <Modal
        isOpen={addLiveProjectModalOpen}
        onClose={() => setAddLiveProjectModalOpen(false)}
        title="Add Live Project"
        isPending={createLiveProjectMutation.isPending}
      >
          <Form {...addLiveProjectForm}>
            <form
              onSubmit={addLiveProjectForm.handleSubmit(handleAddLiveProject)}
            >
              <FormFieldset disabled={createLiveProjectMutation.isPending}>
                <div className="space-y-4">
                  <FormField
                    control={addLiveProjectForm.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Website Redesign Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addLiveProjectForm.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addLiveProjectForm.control}
                      name="clientLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Location</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, USA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addLiveProjectForm.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Clear budget/paid/due fields when switching to HOURLY
                              if (value === "HOURLY") {
                                addLiveProjectForm.setValue("projectBudget", undefined);
                                addLiveProjectForm.setValue("paidAmount", undefined);
                                addLiveProjectForm.setValue("dueAmount", undefined);
                                addLiveProjectForm.clearErrors("projectBudget");
                                addLiveProjectForm.clearErrors("paidAmount");
                                addLiveProjectForm.clearErrors("dueAmount");
                              } else {
                                // Clear hourlyRate when switching from HOURLY
                                addLiveProjectForm.setValue("hourlyRate", undefined);
                                addLiveProjectForm.clearErrors("hourlyRate");
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

                    <FormField
                      control={addLiveProjectForm.control}
                      name="projectStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Status</FormLabel>
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
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className={`grid gap-4 ${projectType === "HOURLY" ? "grid-cols-1" : "grid-cols-3"}`}>
                    {projectType === "HOURLY" ? (
                      <FormField
                        control={addLiveProjectForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                }}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <>
                        <FormField
                          control={addLiveProjectForm.control}
                          name="projectBudget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Budget</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="50000"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                  }}
                                  value={field.value !== undefined && field.value !== null ? field.value : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addLiveProjectForm.control}
                          name="paidAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Paid Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow empty string (will default to 0), or parse the number (including 0)
                                    if (value === "") {
                                      field.onChange(0);
                                    } else {
                                      const numValue = parseFloat(value);
                                      field.onChange(isNaN(numValue) ? 0 : numValue);
                                    }
                                  }}
                                  value={field.value !== undefined && field.value !== null ? field.value : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addLiveProjectForm.control}
                          name="dueAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow empty string (will default to 0), or parse the number (including 0)
                                    if (value === "") {
                                      field.onChange(0);
                                    } else {
                                      const numValue = parseFloat(value);
                                      field.onChange(isNaN(numValue) ? 0 : numValue);
                                    }
                                  }}
                                  value={field.value !== undefined && field.value !== null ? field.value : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addLiveProjectForm.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addLiveProjectForm.control}
                      name="progress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Progress (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === "" ? undefined : parseInt(value) || undefined);
                              }}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={addLiveProjectForm.control}
                    name="assignedMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Members</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Habib, Arif, Robin"
                            {...field}
                            value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                            onChange={(e) => {
                              const names = e.target.value
                                .split(",")
                                .map((name) => name.trim())
                                .filter((name) => name.length > 0);
                              field.onChange(names);
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Enter member names separated by commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addLiveProjectForm.control}
                    name="nextActions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Actions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Review design mockups and provide feedback"
                            rows={3}
                            {...field}
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
                      setAddLiveProjectModalOpen(false);
                      addLiveProjectForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createLiveProjectMutation.isPending}
                  >
                    Add Live Project
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
      </Modal>

      {/* Delete Live Project Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Live Project"
        isPending={deleteLiveProjectMutation.isPending}
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this live project? This action cannot be
            undone.
          </p>
          {selectedLiveProject && (
            <div className="rounded bg-gray-50 p-3">
              <h4 className="font-medium">{selectedLiveProject.clientName}</h4>
              <p className="text-sm text-gray-600">
                {selectedLiveProject.clientLocation}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLiveProject}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <UpdateLiveProject
        isOpen={updateLiveProjectModalOpen}
        onClose={() => {
          setUpdateLiveProjectModalOpen(false);
          setSelectedLiveProject(null);
        }}
        liveProject={selectedLiveProject}
      />

      {/* Notes Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => {
          setNotesModalOpen(false);
          setSelectedLiveProject(null);
        }}
        title={`Notes - ${selectedLiveProject?.projectName || ""}`}
        isPending={updateLiveProjectMutation.isPending}
        className="max-w-4xl"
      >
        {selectedLiveProject && (() => {
          // Get all notes from dailyNotes
          const dailyNotes = selectedLiveProject.dailyNotes && Array.isArray(selectedLiveProject.dailyNotes) 
            ? selectedLiveProject.dailyNotes 
            : [];
          
          // Check if nextActions exists and is not already in dailyNotes
          const nextActionsNote = selectedLiveProject.nextActions 
            ? dailyNotes.find(note => note.note === selectedLiveProject.nextActions)
            : null;
          
          // Combine all notes - include nextActions if it's not already in dailyNotes
          const allNotes = [...dailyNotes];
          if (selectedLiveProject.nextActions && !nextActionsNote) {
            // Add nextActions as a note if it's not already in the list
            allNotes.push({
              note: selectedLiveProject.nextActions,
              createdAt: new Date().toISOString(), // Use current time as fallback
              userId: user?.id || "system",
              userName: "System",
              type: "action" as const,
            });
          }
          
          // Sort by createdAt (newest first)
          allNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          return (
            <div className="space-y-4">
              {/* All Notes History */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                  Previous Notes
                </h4>
                <div className="max-h-[400px] overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                  {allNotes.length > 0 ? (
                    allNotes.map((note, index) => {
                      // Create a unique key for each note using createdAt and userId
                      const noteKey = `${note.createdAt}-${note.userId}-${index}`;
                      
                      return (
                        <div key={noteKey} className="border-b pb-3 last:border-b-0 last:pb-0 group hover:bg-gray-100 rounded p-2 transition-colors">
                          <div className="flex items-start justify-between mb-1">
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
                                  if (!selectedLiveProject) return;
                                  
                                  try {
                                    // Remove the note from the array
                                    const updatedNotes = selectedLiveProject.dailyNotes?.filter(
                                      (n) => !(
                                        n.createdAt === note.createdAt &&
                                        n.userId === note.userId &&
                                        n.note === note.note
                                      )
                                    ) || [];

                                    // Update nextActions to the latest note if we're deleting the current nextAction
                                    let updatedNextActions = selectedLiveProject.nextActions;
                                    if (selectedLiveProject.nextActions === note.note && updatedNotes.length > 0) {
                                      // Get the most recent note
                                      const sortedNotes = [...updatedNotes].sort(
                                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                      );
                                      updatedNextActions = sortedNotes[0]?.note || null;
                                    } else if (selectedLiveProject.nextActions === note.note && updatedNotes.length === 0) {
                                      updatedNextActions = null;
                                    }

                                    // Update the project
                                    const response = await updateLiveProjectMutation.mutateAsync({
                                      liveProjectId: selectedLiveProject.id,
                                      liveProjectData: {
                                        dailyNotes: updatedNotes,
                                        nextActions: updatedNextActions,
                                      },
                                    });

                                    // Update selected project with the response data
                                    if (response.success && response.data) {
                                      setSelectedLiveProject(response.data);
                                    }
                                  } catch (error) {
                                    // Error is handled by the mutation hook
                                  }
                                }}
                                disabled={updateLiveProjectMutation.isPending}
                              >
                                <Trash className="h-3 w-3" />
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
                    <p className="text-sm text-muted-foreground text-center py-4">
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
                  if (!user || !selectedLiveProject) return;

                  const formData = new FormData(e.currentTarget);
                  const newNote = formData.get("newNote") as string;

                  if (!newNote || newNote.trim() === "") {
                    return;
                  }

                  try {
                    // Get existing notes or create empty array
                    const existingNotes = selectedLiveProject.dailyNotes || [];
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
                      liveProjectId: selectedLiveProject.id,
                      liveProjectData: {
                        dailyNotes: updatedNotes,
                        nextActions: newNote.trim(),
                      },
                    });

                    // Update selected project with the response data
                    if (response.success && response.data) {
                      setSelectedLiveProject(response.data);
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
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setNotesModalOpen(false);
                      setSelectedLiveProject(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    isLoading={updateLiveProjectMutation.isPending}
                  >
                    Save Note
                  </Button>
                </div>
              </form>
              </div>
            </div>
          );
        })()}
      </Modal>

    </>
  );
};
