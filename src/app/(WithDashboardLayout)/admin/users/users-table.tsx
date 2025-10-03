"use client";

import {
  CreateClientFormData,
  createClientSchema,
} from "@/components/modules/auth/register/registerValidation";
import { Badge, BadgeProps } from "@/components/ui/badge";
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
  useBanUser,
  useCreateUser,
  useDeleteUser,
  useUnbanUser,
  useUsers,
} from "@/hooks/useUserMutations";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ban,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MoreVertical,
  Plus,
  Trash,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Schema for ban reason
const banReasonSchema = z.object({
  banReason: z.string().min(1, "Ban reason is required"),
});

type BanReasonFormData = z.infer<typeof banReasonSchema>;

// Gender options for the form
const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

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
  const addUserForm = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      password: "",
      client: {
        name: "",
        email: "",
        gender: "MALE",
      },
    },
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

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
  const handleAddClient = (values: CreateClientFormData) => {
    createUserMutation.mutate(
      {
        client: {
          name: values.client.name,
          email: values.client.email,
          gender: values.client.gender,
        },

        password: values.password,
      },
      {
        onSuccess: () => {
          setAddUserModalOpen(false);
          addUserForm.reset();
        },
      }
    );
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
        const role = row.original.role;
        let badgeProps = {
          variant: "" as BadgeProps["variant"],
          label: "",
        };

        switch (role) {
          case "SUPER_ADMIN":
            badgeProps = { variant: "secondary", label: "Super Admin" };
            break;
          case "ADMIN":
            badgeProps = { variant: "secondary", label: "Admin" };
            break;
          case "EMPLOYEE":
            badgeProps = { variant: "secondary", label: "Employee" };
            break;
          case "CLIENT":
            badgeProps = { variant: "success", label: "Client" };
            break;
          default:
            badgeProps = { variant: "secondary", label: role };
        }

        return <Badge variant={badgeProps.variant}>{badgeProps.label}</Badge>;
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
          <span>Add Client</span>
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
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Add Client</ModalTitle>
          </ModalHeader>
          <Form {...addUserForm}>
            <form
              onSubmit={addUserForm.handleSubmit(handleAddClient)}
              className="space-y-6 p-6"
            >
              <FormFieldset disabled={createUserMutation.isPending}>
                {/* Full Name Field */}
                <FormField
                  control={addUserForm.control}
                  name="client.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Enter full name"
                            className="pl-10 h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={addUserForm.control}
                  name="client.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            className="pl-10 h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender Field */}
                <FormField
                  control={addUserForm.control}
                  name="client.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={addUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
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
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createUserMutation.isPending
                      ? "Creating..."
                      : "Create Client"}
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
