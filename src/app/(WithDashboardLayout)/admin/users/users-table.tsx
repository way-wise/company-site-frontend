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
import { apiClient } from "@/lib/axios";
import { User } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Eye, MoreVertical, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Schema for user creation
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// API functions
const fetchUsers = async (page: number, limit: number, search: string) => {
  const url = `/users?page=${page}&limit=${limit}${
    search.trim() ? `&search=${encodeURIComponent(search.trim())}` : ""
  }`;
  const response = await apiClient.get(url);
  return response.data;
};

const createUser = async (userData: SignUpFormData) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

const banUser = async (userId: string, banReason: string) => {
  const response = await apiClient.post(`/users/${userId}/ban`, { banReason });
  return response.data;
};

const unbanUser = async (userId: string) => {
  const response = await apiClient.post(`/users/${userId}/unban`);
  return response.data;
};

const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

export const UsersTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  // debounce search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get users data using TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: [
      "users",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
    ],
    queryFn: () =>
      fetchUsers(pagination.pageIndex, pagination.pageSize, debouncedSearch),
  });

  // Add User Form
  const addUserForm = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User added successfully");
      setAddUserModalOpen(false);
      addUserForm.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const banUserMutation = useMutation({
    mutationFn: ({
      userId,
      banReason,
    }: {
      userId: string;
      banReason: string;
    }) => banUser(userId, banReason),
    onSuccess: () => {
      toast.success("User banned successfully");
      setBanModalOpen(false);
      banForm.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      toast.success("User unbanned successfully");
      setUnbanModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  // Handle Add User
  const handleAddUser = (values: SignUpFormData) => {
    createUserMutation.mutate(values);
  };

  // Ban Form
  const banForm = useForm({
    defaultValues: {
      banReason: "",
    },
  });

  // Handle User Ban
  const handleBanUser = () => {
    if (userId) {
      banUserMutation.mutate({
        userId,
        banReason: banForm.getValues("banReason"),
      });
    }
  };

  // Unban Form
  const unbanForm = useForm();
  const handleUnbanUser = () => {
    if (userId) {
      unbanUserMutation.mutate(userId);
    }
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle User Deletion
  const handleDeleteUser = () => {
    if (userId) {
      deleteUserMutation.mutate(userId);
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
                  <Link href={`/client/users/${id}`}>
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
        <DataTable
          data={data}
          columns={columns}
          isPending={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
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
          <Form {...unbanForm}>
            <form onSubmit={unbanForm.handleSubmit(handleUnbanUser)}>
              <FormFieldset disabled={unbanUserMutation.isPending}>
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
                    type="submit"
                    variant="destructive"
                    isLoading={unbanUserMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete User Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete User</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteUser)}>
              <FormFieldset disabled={deleteUserMutation.isPending}>
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
                    type="submit"
                    variant="destructive"
                    isLoading={deleteUserMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
};
