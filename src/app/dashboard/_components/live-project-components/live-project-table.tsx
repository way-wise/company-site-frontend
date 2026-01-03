"use client";

import {
  CreateLiveProjectFormData,
  createLiveProjectSchema,
} from "@/components/modules/admin/projectValidation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/hooks/useLiveProjectMutations";
import { LiveProject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateLiveProject from "./UpdateLiveProject";

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
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addLiveProjectModalOpen, setAddLiveProjectModalOpen] = useState(false);
  const [updateLiveProjectModalOpen, setUpdateLiveProjectModalOpen] =
    useState(false);
  const [selectedLiveProject, setSelectedLiveProject] =
    useState<LiveProject | null>(null);
  const [liveProjectId, setLiveProjectId] = useState<string | undefined>("");

  // Pagination and search states
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
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

  // Get live projects data using TanStack Query
  const {
    data: liveProjectsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useLiveProjects({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    projectStatus: statusFilter !== "all" ? statusFilter : undefined,
    projectType: typeFilter !== "all" ? typeFilter : undefined,
  });

  // Add Live Project Form
  const addLiveProjectForm = useForm<CreateLiveProjectFormData>({
    resolver: zodResolver(createLiveProjectSchema),
    defaultValues: {
      clientName: "",
      clientLocation: "",
      projectType: "FIXED",
      projectBudget: 0,
      hourlyRate: 0,
      paidAmount: 0,
      assignedMembers: "",
      projectStatus: "PENDING",
      nextActions: "",
    },
  });

  // Watch project type to show/hide appropriate fields
  const projectType = addLiveProjectForm.watch("projectType");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Custom hooks for mutations
  const createLiveProjectMutation = useCreateLiveProject();
  const deleteLiveProjectMutation = useDeleteLiveProject();

  // Handle Add Live Project
  const handleAddLiveProject = async (values: CreateLiveProjectFormData) => {
    try {
      // Ensure assignedMembers is always an array
      const assignedMembersArray = Array.isArray(values.assignedMembers)
        ? values.assignedMembers
        : typeof values.assignedMembers === "string" && values.assignedMembers.trim()
        ? values.assignedMembers.split(",").map((m) => m.trim()).filter((m) => m.length > 0)
        : [];

      const payload: {
        clientName: string;
        clientLocation: string;
        projectType: "FIXED" | "HOURLY" | "MONTHLY" | "CUSTOM";
        paidAmount: number;
        assignedMembers: string[];
        projectStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
        nextActions?: string;
        projectBudget?: number;
        hourlyRate?: number;
      } = {
        clientName: values.clientName,
        clientLocation: values.clientLocation,
        projectType: values.projectType,
        paidAmount: values.paidAmount ?? 0,
        assignedMembers: assignedMembersArray,
        projectStatus: values.projectStatus || "PENDING",
        nextActions: values.nextActions || undefined,
      };

      // Add budget or hourly rate based on project type
      if (values.projectType === "HOURLY") {
        payload.hourlyRate = values.hourlyRate;
      } else {
        payload.projectBudget = values.projectBudget;
      }

      await createLiveProjectMutation.mutateAsync(payload);
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
  const liveProjects = liveProjectsData?.data || [];
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
          <Button onClick={() => setAddLiveProjectModalOpen(true)}>
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
          <Button onClick={() => setAddLiveProjectModalOpen(true)}>
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

  // Table columns
  const columns = [
    {
      header: "Client Name",
      accessorKey: "clientName",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        return (
          <div className="font-medium max-w-[200px] truncate" title={row.original.clientName}>
            {row.original.clientName}
          </div>
        );
      },
    },
    {
      header: "Location",
      accessorKey: "clientLocation",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        return (
          <div className="max-w-[150px] truncate" title={row.original.clientLocation}>
            {row.original.clientLocation}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "projectType",
      cell: ({ row }: { row: { original: LiveProject } }) =>
        getProjectTypeBadge(row.original.projectType),
    },
    {
      header: "Budget / Rate",
      accessorKey: "budgetOrRate",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const project = row.original;
        if (project.projectType === "HOURLY" && project.hourlyRate) {
          return (
            <div className="font-medium">
              ${project.hourlyRate.toLocaleString()}/hr
            </div>
          );
        } else if (project.projectBudget) {
          return (
            <div className="font-medium">
              ${project.projectBudget.toLocaleString()}
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      header: "Paid",
      accessorKey: "paidAmount",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        return (
          <div className="font-medium text-green-600">
            ${row.original.paidAmount.toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Remaining",
      accessorKey: "remaining",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const project = row.original;
        const budget = project.projectBudget || 0;
        const remaining = budget - project.paidAmount;
        
        // Only show remaining for non-hourly projects
        if (project.projectType === "HOURLY") {
          return <span className="text-muted-foreground">-</span>;
        }
        
        return (
          <div className={`font-medium ${remaining > 0 ? "text-orange-600" : "text-green-600"}`}>
            ${remaining.toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Members",
      accessorKey: "assignedMembers",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        // Handle both array and string formats (API might return either)
        const membersValue = row.original.assignedMembers as string[] | string | undefined;
        let members: string[] = [];
        
        if (Array.isArray(membersValue)) {
          members = membersValue;
        } else if (typeof membersValue === "string" && membersValue.trim()) {
          // If it's a string, split by comma and trim
          members = membersValue
            .split(",")
            .map((m: string) => m.trim())
            .filter((m: string) => m.length > 0);
        }
        
        if (members.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        
        // If members are IDs, show count. If they're names, show them
        const displayText = members.length > 3 
          ? `${members.slice(0, 3).join(", ")} +${members.length - 3} more`
          : members.join(", ");
        return (
          <div className="max-w-[200px] truncate" title={members.join(", ")}>
            {displayText}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "projectStatus",
      cell: ({ row }: { row: { original: LiveProject } }) =>
        getStatusBadge(row.original.projectStatus),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: LiveProject } }) =>
        formatDateHelper(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: LiveProject } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setUpdateLiveProjectModalOpen(true);
                  setSelectedLiveProject(row.original);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setLiveProjectId(id);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
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
        <h1 className="text-2xl font-medium">Live Projects</h1>
        <Button onClick={() => setAddLiveProjectModalOpen(true)}>
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
              onClick={() => setAddLiveProjectModalOpen(true)}
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
            pagination={{
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize,
              total: totalItems,
            }}
            onPaginationChange={(newPagination) => {
              setPagination({
                pageIndex: newPagination.pageIndex + 1,
                pageSize: newPagination.pageSize,
              });
            }}
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
                              // Clear the opposite field when switching types
                              if (value === "HOURLY") {
                                addLiveProjectForm.setValue("projectBudget", undefined);
                              } else {
                                addLiveProjectForm.setValue("hourlyRate", undefined);
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

                  <div className={`grid gap-4 ${projectType === "HOURLY" ? "grid-cols-1" : "grid-cols-2"}`}>
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
                                  value={field.value ?? ""}
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
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value) || 0)
                                  }
                                  value={field.value || 0}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
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
    </>
  );
};
