"use client";

import {
  CreateProjectFormData,
  createProjectSchema,
} from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
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
  useCreateProject,
  useDeleteProject,
  useProjects,
} from "@/hooks/useProjectMutations";
import { useUsers } from "@/hooks/useUserMutations";
import { Project, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateProject from "./UpdateProject";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export const ProjectTable = () => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [updateProjectModalOpen, setUpdateProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>("");

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // User search state
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserSearch(userSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearch]);

  const {
    data: projectsData,
    isLoading,
    refetch,
  } = useProjects({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
  });

  // Fetch users for owner selection (only clients)
  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    page: 1,
    limit: 50,
    search: debouncedUserSearch,
    role: "CLIENT",
  });

  const addProjectForm = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      status: "PENDING",
      userProfileId: "",
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

  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  // Create user options for combobox
  const userOptions: ComboboxOption[] =
    usersData?.data
      ?.filter((user: User) => user.userProfile?.id) // Only include users with userProfile
      ?.map((user: User) => ({
        value: user.userProfile!.id,
        label: `${user.name} (${user.email})`,
        searchText: `${user.name} ${user.email}`,
      })) || [];

  const handleAddProject = async (values: CreateProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync(values);
      setAddProjectModalOpen(false);
      addProjectForm.reset();
      setUserSearch(""); // Reset user search
      // Reset pagination to page 1 to show the new project
      setPagination({
        pageIndex: 1,
        pageSize: 10,
      });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    try {
      await deleteProjectMutation.mutateAsync(projectId);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: { row: { original: any } }) => {
        const description = row.original.description;
        return description && description.length > 50
          ? `${description.substring(0, 50)}...`
          : description || "-";
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: any } }) =>
        getStatusBadge(row.original.status),
    },
    {
      header: "Owner",
      accessorKey: "userProfile",
      cell: ({ row }: { row: { original: any } }) =>
        row.original.userProfile?.user?.name || "-",
    },
    {
      header: "Milestones",
      accessorKey: "_count",
      cell: ({ row }: { row: { original: any } }) =>
        row.original._count?.milestones || 0,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: any } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: any } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/projects/${id}`}
                  className="flex items-center gap-2"
                >
                  <Eye />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setUpdateProjectModalOpen(true);
                  setSelectedProject(row.original);
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setProjectId(id);
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
        <h1 className="text-2xl font-medium">Projects</h1>
        <Button onClick={() => setAddProjectModalOpen(true)}>
          <Plus />
          <span>Add Project</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input
            type="search"
            placeholder="Search projects..."
            className="max-w-xs"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <DataTable
          data={projectsData?.data?.result || []}
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

      <Modal
        open={addProjectModalOpen}
        onOpenChange={(open) => {
          setAddProjectModalOpen(open);
          if (open) {
            // Reset form when modal opens
            addProjectForm.reset({
              name: "",
              description: "",
              status: "PENDING",
              userProfileId: "",
            });
            setUserSearch("");
          }
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Project</ModalTitle>
          </ModalHeader>
          <Form {...addProjectForm}>
            <form onSubmit={addProjectForm.handleSubmit(handleAddProject)}>
              <FormFieldset disabled={createProjectMutation.isPending}>
                <FormField
                  control={addProjectForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProjectForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Project Description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProjectForm.control}
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
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProjectForm.control}
                  name="userProfileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Combobox
                          options={userOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          onSearchChange={setUserSearch}
                          placeholder="Search for a client..."
                          searchPlaceholder="Search by name or email..."
                          emptyText="No clients found."
                          isLoading={isUsersLoading}
                          disabled={createProjectMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddProjectModalOpen(false);
                      addProjectForm.reset();
                      setUserSearch(""); // Reset user search
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createProjectMutation.isPending}
                  >
                    Add Project
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Project</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteProject)}>
              <FormFieldset disabled={deleteProjectMutation.isPending}>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the
                  project and remove associated data.
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
                    isLoading={deleteProjectMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      <UpdateProject
        isOpen={updateProjectModalOpen}
        onClose={() => {
          setUpdateProjectModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectTable;
