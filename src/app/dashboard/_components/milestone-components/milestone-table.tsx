"use client";

import {
  CreateMilestoneFormData,
  createMilestoneSchema,
} from "@/components/modules/admin/projectValidation";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
} from "@/hooks/useMilestoneMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { formatStatusText, getMilestoneStatusColor } from "@/lib/status-utils";
import { Milestone } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExternalLink,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Settings,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateMilestone from "./UpdateMilestone";
import AssignEmployeeModal from "./assign-employee-modal";
import AssignServiceModal from "./assign-service-modal";
import MilestoneDetailModal from "./milestone-detail-modal";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string) => {
  const colors = getMilestoneStatusColor(status);
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${colors}`}
    >
      {formatStatusText(status)}
    </span>
  );
};

export const MilestoneTable = () => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addMilestoneModalOpen, setAddMilestoneModalOpen] = useState(false);
  const [updateMilestoneModalOpen, setUpdateMilestoneModalOpen] =
    useState(false);
  const [assignEmployeeModalOpen, setAssignEmployeeModalOpen] = useState(false);
  const [assignServiceModalOpen, setAssignServiceModalOpen] = useState(false);
  const [viewMilestoneModalOpen, setViewMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [milestoneId, setMilestoneId] = useState<string | undefined>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get projects for the project filter dropdown
  const { data: projectsData } = useProjects({
    page: 1,
    limit: 100,
  });

  const { data: milestonesData, isLoading } = useMilestones({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    projectId: selectedProjectId === "all" ? undefined : selectedProjectId,
  });

  const addMilestoneForm = useForm<CreateMilestoneFormData>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "PENDING",
      projectId: "",
    },
  });

  const deleteForm = useForm();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  const createMilestoneMutation = useCreateMilestone();
  const deleteMilestoneMutation = useDeleteMilestone();

  const handleAddMilestone = async (values: CreateMilestoneFormData) => {
    try {
      await createMilestoneMutation.mutateAsync(values);
      setAddMilestoneModalOpen(false);
      addMilestoneForm.reset();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteMilestone = async () => {
    if (!milestoneId) return;

    try {
      await deleteMilestoneMutation.mutateAsync(milestoneId);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const milestone = row.original;
        const handleClick = () => {
          if (milestone.project?.id) {
            router.push(
              `/dashboard/projects/${milestone.project.id}/milestones/${milestone.id}`
            );
          }
        };

        return (
          <button
            onClick={handleClick}
            className="text-left hover:text-blue-600 hover:underline transition-colors"
            disabled={!milestone.project?.id}
          >
            <div className="font-medium text-gray-900">{milestone.name}</div>
            {milestone.project?.id && (
              <div className="text-xs text-gray-500">Click to view details</div>
            )}
          </button>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const description = row.original.description;
        return description && description.length > 50
          ? `${description.substring(0, 50)}...`
          : description || "-";
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Milestone } }) =>
        getStatusBadge(row.original.status),
    },
    {
      header: "Project",
      accessorKey: "project",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const project = row.original.project;
        return project ? (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{project.name}</div>
            <div className="text-xs text-gray-500">ID: {project.id}</div>
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      header: "Employees",
      accessorKey: "employees",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const employees = row.original.employeeMilestones || [];
        if (employees.length === 0) return "No employees";

        const employeeNames = employees
          .map((em) => em.userProfile?.user?.name)
          .filter(Boolean)
          .slice(0, 2); // Show max 2 names

        const displayText = employeeNames.join(", ");
        const hasMore = employees.length > 2;

        return (
          <div className="max-w-[200px]">
            <div className="truncate" title={displayText}>
              {displayText}
              {hasMore && ` +${employees.length - 2} more`}
            </div>
          </div>
        );
      },
    },
    {
      header: "Services",
      accessorKey: "services",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const services = row.original.serviceMilestones || [];
        if (services.length === 0) return "No services";

        const serviceNames = services
          .map((sm) => sm.service?.name)
          .filter(Boolean)
          .slice(0, 2); // Show max 2 names

        const displayText = serviceNames.join(", ");
        const hasMore = services.length > 2;

        return (
          <div className="max-w-[200px]">
            <div className="truncate" title={displayText}>
              {displayText}
              {hasMore && ` +${services.length - 2} more`}
            </div>
          </div>
        );
      },
    },
    {
      header: "Tasks",
      accessorKey: "taskCount",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const taskCount = row.original._count?.Task || 0;
        const tasks = row.original.Task || [];
        const completedTasks = tasks.filter(
          (task) => task.status === "COMPLETED"
        ).length;

        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{taskCount} total</div>
            <div className="text-xs text-gray-500">
              {completedTasks} completed
            </div>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: Milestone } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Milestone } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMilestone(row.original);
                  setViewMilestoneModalOpen(true);
                }}
              >
                <Eye />
                <span>View Details</span>
              </DropdownMenuItem>

              {row.original.project && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/projects/${row.original.project.id}`}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View in Project</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  setUpdateMilestoneModalOpen(true);
                  setSelectedMilestone(row.original);
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedMilestone(row.original);
                  setAssignEmployeeModalOpen(true);
                }}
              >
                <Users />
                <span>Assign Employees</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedMilestone(row.original);
                  setAssignServiceModalOpen(true);
                }}
              >
                <Settings />
                <span>Assign Services</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setMilestoneId(id);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash />
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
        <h1 className="text-2xl font-medium">Milestones</h1>
        <Button onClick={() => setAddMilestoneModalOpen(true)}>
          <Plus />
          <span>Add Milestone</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search milestones..."
              className="max-w-xs"
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedProjectId}
              onValueChange={(value) => {
                setSelectedProjectId(value);
                setPagination({ pageIndex: 1, pageSize: 10 });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(projectsData?.data?.result as any[] | undefined)?.map(
                  (project: any) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <DataTable
          key={`milestones-${milestonesData?.data?.result?.length || 0}`}
          data={(milestonesData as any)?.data?.result || []}
          columns={columns}
          isPending={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={(newPagination) => {
            setPagination({
              pageIndex: newPagination.pageIndex,
              pageSize: newPagination.pageSize,
            });
          }}
        />
      </div>

      {/* Add Milestone Modal */}
      <Modal
        open={addMilestoneModalOpen}
        onOpenChange={setAddMilestoneModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Milestone</ModalTitle>
          </ModalHeader>
          <Form {...addMilestoneForm}>
            <form onSubmit={addMilestoneForm.handleSubmit(handleAddMilestone)}>
              <FormFieldset disabled={createMilestoneMutation.isPending}>
                <FormField
                  control={addMilestoneForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Milestone Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addMilestoneForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Milestone Description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addMilestoneForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="REVIEW">Review</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addMilestoneForm.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(
                            projectsData?.data?.result as any[] | undefined
                          )?.map((project: any) => (
                            <SelectItem
                              key={project.id}
                              value={project.id.toString()}
                            >
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddMilestoneModalOpen(false);
                      addMilestoneForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createMilestoneMutation.isPending}
                  >
                    Add Milestone
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete Milestone Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Milestone</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteMilestone)}>
              <FormFieldset disabled={deleteMilestoneMutation.isPending}>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the
                  milestone and remove associated data.
                </p>
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    isLoading={deleteMilestoneMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Update Milestone Modal */}
      <UpdateMilestone
        isOpen={updateMilestoneModalOpen}
        onClose={() => {
          setUpdateMilestoneModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      {/* Assign Employee Modal */}
      <AssignEmployeeModal
        isOpen={assignEmployeeModalOpen}
        onClose={() => {
          setAssignEmployeeModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      {/* Assign Service Modal */}
      <AssignServiceModal
        isOpen={assignServiceModalOpen}
        onClose={() => {
          setAssignServiceModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      {/* Milestone Detail Modal */}
      <MilestoneDetailModal
        isOpen={viewMilestoneModalOpen}
        onClose={() => {
          setViewMilestoneModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />
    </>
  );
};

export default MilestoneTable;
