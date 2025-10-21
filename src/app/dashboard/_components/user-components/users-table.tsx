"use client";

import {
  CreateAdminFormData,
  createAdminSchema,
} from "@/components/modules/auth/register/adminValidation";
import {
  CreateEmployeeFormData,
  createEmployeeSchema,
} from "@/components/modules/auth/register/employeeValidation";
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
import { useRoles } from "@/hooks/useRoleMutations";
import {
  useBanUser,
  useCreateAdmin,
  useCreateEmployee,
  useCreateUser,
  useDeleteUser,
  useUnbanUser,
  useUpdateUser,
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
  Phone,
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

// Schema for role update
const roleUpdateSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EMPLOYEE", "CLIENT"]),
});

type RoleUpdateFormData = z.infer<typeof roleUpdateSchema>;

// Gender options for the form
const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

// Role options for filtering and updating
const ROLE_OPTIONS = [
  { value: "CLIENT", label: "Client" },
  { value: "ADMIN", label: "Admin" },
  { value: "EMPLOYEE", label: "Employee" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

// Role filter options (excluding SUPER_ADMIN for filtering)
const ROLE_FILTER_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "CLIENT", label: "Client" },
  { value: "ADMIN", label: "Admin" },
  { value: "EMPLOYEE", label: "Employee" },
];

export const UsersTable = () => {
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [roleUpdateModalOpen, setRoleUpdateModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");

  // Pagination and search states
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

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
    role: roleFilter === "ALL" ? undefined : roleFilter,
  });
  console.log(usersData);
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

  // Add Admin Form
  const addAdminForm = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      password: "",
      admin: {
        name: "",
        email: "",
        contactNumber: "",
      },
    },
  });

  // Add Employee Form
  const addEmployeeForm = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      password: "",
      employee: {
        name: "",
        email: "",
        gender: "MALE",
        contactNumber: "",
        address: "",
      },
    },
  });

  // Role Update Form
  const roleUpdateForm = useForm<RoleUpdateFormData>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      role: "CLIENT",
    },
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

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

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Fetch all roles for filter dropdown
  const { data: rolesData } = useRoles({ limit: 100 });
  const allRoles = rolesData?.data?.result || [];

  // Custom hooks for mutations
  const createUserMutation = useCreateUser();
  const createAdminMutation = useCreateAdmin();
  const createEmployeeMutation = useCreateEmployee();
  const updateUserMutation = useUpdateUser();
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

  // Handle Add Admin
  const handleAddAdmin = (values: CreateAdminFormData) => {
    createAdminMutation.mutate(
      {
        admin: {
          name: values.admin.name,
          email: values.admin.email,
          contactNumber: values.admin.contactNumber,
        },
        password: values.password,
      },
      {
        onSuccess: () => {
          setAddAdminModalOpen(false);
          addAdminForm.reset();
        },
      }
    );
  };

  // Handle Add Employee
  const handleAddEmployee = (values: CreateEmployeeFormData) => {
    createEmployeeMutation.mutate(
      {
        employee: {
          name: values.employee.name,
          email: values.employee.email,
          gender: values.employee.gender,
          contactNumber: values.employee.contactNumber,
          address: values.employee.address,
        },
        password: values.password,
      },
      {
        onSuccess: () => {
          setAddEmployeeModalOpen(false);
          addEmployeeForm.reset();
        },
      }
    );
  };

  // Handle Role Update - Temporarily disabled (needs backend UserRoleAssignment support)
  const handleRoleUpdate = (values: RoleUpdateFormData) => {
    // TODO: Implement role update with UserRoleAssignment API
    // This will require a new backend endpoint to manage user role assignments
    console.log("Role update not yet implemented", values);
    setRoleUpdateModalOpen(false);

    // if (userId) {
    //   updateUserMutation.mutate(
    //     {
    //       userId,
    //       userData: { roles: [values.role] }, // This needs proper implementation
    //     },
    //     {
    //       onSuccess: () => {
    //         setRoleUpdateModalOpen(false);
    //         roleUpdateForm.reset();
    //         refetch();
    //       },
    //     }
    //   );
    // }
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
              refetch();
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
          refetch();
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
          refetch();
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
      accessorKey: "roles",
      cell: ({ row }: { row: { original: User } }) => {
        const roles = row.original.roles || [];

        // Display the primary role (first role or highest priority)
        const primaryRole = roles[0]?.role?.name || "No Role";

        let badgeProps = {
          variant: "" as BadgeProps["variant"],
          label: "",
        };

        switch (primaryRole) {
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
            badgeProps = { variant: "secondary", label: primaryRole };
        }

        return (
          <div className="flex gap-1">
            {roles?.map((role) => (
              <Badge key={role.id} variant={badgeProps.variant}>
                {role.name}{" "}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: User } }) => {
        return row.original.status === "ACTIVE" ? (
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
        const { id, status } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/users/${id}`}>
                    <Eye />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>

                {status !== "ACTIVE" ? (
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
        <div className="flex gap-2">
          <Button onClick={() => setAddUserModalOpen(true)} variant="outline">
            <Plus />
            <span>Add Client</span>
          </Button>
          <Button onClick={() => setAddAdminModalOpen(true)} variant="outline">
            <Plus />
            <span>Add Admin</span>
          </Button>
          <Button onClick={() => setAddEmployeeModalOpen(true)}>
            <Plus />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search name, email..."
              value={search}
              onChange={handleSearchChange}
              className="max-w-xs"
            />
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {allRoles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            pagination={{
              pageIndex: usersData.pagination.currentPage - 1, // Convert to 0-based index
              pageSize: pagination.pageSize,
            }}
            onPaginationChange={(newPagination) => {
              setPagination({
                pageIndex: newPagination.pageIndex + 1, // Convert to 1-based index
                pageSize: newPagination.pageSize,
              });
            }}
          />
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

      {/* Add Admin Modal */}
      <Modal open={addAdminModalOpen} onOpenChange={setAddAdminModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Add Admin</ModalTitle>
          </ModalHeader>
          <Form {...addAdminForm}>
            <form
              onSubmit={addAdminForm.handleSubmit(handleAddAdmin)}
              className="space-y-6 p-6"
            >
              <FormFieldset disabled={createAdminMutation.isPending}>
                {/* Full Name Field */}
                <FormField
                  control={addAdminForm.control}
                  name="admin.name"
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
                  control={addAdminForm.control}
                  name="admin.email"
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

                {/* Contact Number Field */}
                <FormField
                  control={addAdminForm.control}
                  name="admin.contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Enter contact number"
                            className="pl-10 h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={addAdminForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showAdminPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowAdminPassword(!showAdminPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminPassword ? (
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
                      setAddAdminModalOpen(false);
                      addAdminForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createAdminMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createAdminMutation.isPending
                      ? "Creating..."
                      : "Create Admin"}
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Add Employee Modal */}
      <Modal open={addEmployeeModalOpen} onOpenChange={setAddEmployeeModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Add Employee</ModalTitle>
          </ModalHeader>
          <Form {...addEmployeeForm}>
            <form
              onSubmit={addEmployeeForm.handleSubmit(handleAddEmployee)}
              className="space-y-6 p-6"
            >
              <FormFieldset disabled={createEmployeeMutation.isPending}>
                {/* Full Name Field */}
                <FormField
                  control={addEmployeeForm.control}
                  name="employee.name"
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
                  control={addEmployeeForm.control}
                  name="employee.email"
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
                  control={addEmployeeForm.control}
                  name="employee.gender"
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
                            {GENDER_OPTIONS.filter(
                              (option) => option.value !== "OTHER"
                            ).map((option) => (
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

                {/* Contact Number Field */}
                <FormField
                  control={addEmployeeForm.control}
                  name="employee.contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Enter contact number"
                            className="pl-10 h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Field */}
                <FormField
                  control={addEmployeeForm.control}
                  name="employee.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter address"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={addEmployeeForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showEmployeePassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 h-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowEmployeePassword(!showEmployeePassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showEmployeePassword ? (
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
                      setAddEmployeeModalOpen(false);
                      addEmployeeForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createEmployeeMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createEmployeeMutation.isPending
                      ? "Creating..."
                      : "Create Employee"}
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Role Update Modal */}
      <Modal open={roleUpdateModalOpen} onOpenChange={setRoleUpdateModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Update User Role</ModalTitle>
          </ModalHeader>
          <Form {...roleUpdateForm}>
            <form onSubmit={roleUpdateForm.handleSubmit(handleRoleUpdate)}>
              <FormFieldset disabled={updateUserMutation.isPending}>
                <p className="mb-5 text-muted-foreground">
                  Select a new role for this user.
                </p>
                <FormField
                  control={roleUpdateForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((option) => (
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
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setRoleUpdateModalOpen(false);
                      roleUpdateForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={updateUserMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {updateUserMutation.isPending
                      ? "Updating..."
                      : "Update Role"}
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
