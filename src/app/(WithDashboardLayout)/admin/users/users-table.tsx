"use client";

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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  useBanUser,
  useCreateUser,
  useDeleteUser,
  useUnbanUser,
  useUsers,
} from "@/hooks/useUserMutations";
import { User } from "@/types";
import { Ban, Eye, MoreVertical, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Schema for user creation
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for ban reason
const banReasonSchema = z.object({
  banReason: z.string().min(1, "Ban reason is required"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type BanReasonFormData = z.infer<typeof banReasonSchema>;

export const UsersTable = () => {
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");

  // Pagination and search states
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get users data using TanStack Query
  const {
    data: usersData,
    isLoading,
    error,
    isError,
    refetch,
  } = useUsers({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
  });

  // Add User Form
  const addUserForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Ban Reason Form
  const banForm = useForm({
    defaultValues: {
      banReason: "",
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Custom hooks for mutations
  const createUserMutation = useCreateUser();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const deleteUserMutation = useDeleteUser();

  // Handle Add User
  const handleAddUser = (values: CreateUserFormData) => {
    // Validate form data
    try {
      const validatedData = createUserSchema.parse(values);
      createUserMutation.mutate(validatedData, {
        onSuccess: () => {
          setAddUserModalOpen(false);
          addUserForm.reset();
        },
      });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  // Handle User Ban
  const handleBanUser = (values: BanReasonFormData) => {
    if (userId) {
      try {
        const validatedData = banReasonSchema.parse(values);
        banUserMutation.mutate(
          {
            userId,
            banData: validatedData,
          },
          {
            onSuccess: () => {
              setBanModalOpen(false);
              banForm.reset();
            },
          }
        );
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  // Handle User Unban
  const handleUnbanUser = () => {
    if (userId) {
      unbanUserMutation.mutate(userId, {
        onSuccess: () => {
          setUnbanModalOpen(false);
        },
      });
    }
  };

  // Handle User Deletion
  const handleDeleteUser = () => {
    if (userId) {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
        },
      });
    }
  };

  // Table columns
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }: { row: { original: User } }) => {
        return row.original.role === "ADMIN" ? (
          <Badge variant="success">Admin</Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }: { row: { original: User } }) => {
        return row.original.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: User } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => {
        const { id, isActive } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${id}`}>
                    <Eye />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>
                {!isActive ? (
                  <DropdownMenuItem
                    onClick={() => {
                      setUserId(id);
                      setUnbanModalOpen(true);
                    }}
                  >
                    <Ban />
                    <span>Activate</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      setUserId(id);
                      setBanModalOpen(true);
                    }}
                  >
                    <Ban />
                    <span>Deactivate</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setUserId(id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Users</h1>
        <Button onClick={() => setAddUserModalOpen(true)}>
          <Plus />
          <span>Add User</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input
            type="search"
            placeholder="Search name, email..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-xs"
          />
        </div>

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-destructive">
              <p className="text-lg font-medium">Failed to load users</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Something went wrong while fetching users"}
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !usersData && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !isError && usersData && (
          <DataTable
            data={usersData?.data || []}
            columns={columns}
            isPending={isLoading}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}

        {/* Empty State */}
        {!isLoading &&
          !isError &&
          usersData &&
          (!usersData.data || usersData.data.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4">
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm text-muted-foreground">
                  {debouncedSearch
                    ? "Try adjusting your search criteria"
                    : "No users have been created yet"}
                </p>
              </div>
              {!debouncedSearch && (
                <Button onClick={() => setAddUserModalOpen(true)}>
                  <Plus />
                  <span>Add First User</span>
                </Button>
              )}
            </div>
          )}
      </div>

      {/* User Creation Modal */}
      <Modal open={addUserModalOpen} onOpenChange={setAddUserModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add User</ModalTitle>
          </ModalHeader>
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)}>
              <FormFieldset disabled={createUserMutation.isPending}>
                <FormField
                  control={addUserForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddUserModalOpen(false);
                      addUserForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createUserMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Ban User Modal */}
      <Modal open={banModalOpen} onOpenChange={setBanModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Ban User</ModalTitle>
          </ModalHeader>
          <Form {...banForm}>
            <form onSubmit={banForm.handleSubmit(handleBanUser)}>
              <FormFieldset disabled={banUserMutation.isPending}>
                <p className="mb-5 text-muted-foreground">
                  This will prevent the user from logging in and using the
                  application.
                </p>
                <FormField
                  control={banForm.control}
                  name="banReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ban Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter ban reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setBanModalOpen(false);
                      banForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    isLoading={banUserMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Unban User Modal */}
      <Modal open={unbanModalOpen} onOpenChange={setUnbanModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Unban User</ModalTitle>
          </ModalHeader>
          <div className="p-6">
            <div className="space-y-4">
              <p className="mb-5 text-muted-foreground">
                This will allow the user to log in and use the application
                again.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setUnbanModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUnbanUser}
                  variant="destructive"
                  isLoading={unbanUserMutation.isPending}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete User Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete User</ModalTitle>
          </ModalHeader>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                user and remove associated data.
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
                  onClick={handleDeleteUser}
                  variant="destructive"
                  isLoading={deleteUserMutation.isPending}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
