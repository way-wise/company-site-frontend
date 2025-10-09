"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateRole,
  useDeleteRole,
  useRoles,
  useUpdateRole,
} from "@/hooks/useRoleMutations";
import { Role } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Lock,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RolesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data: rolesData, isLoading } = useRoles({ search, page, limit });
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const roles = rolesData?.data?.result || [];
  const totalRoles = rolesData?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalRoles / limit);

  // Calculate stats
  const totalUsers = roles.reduce(
    (sum: number, role: Role) => sum + (role._count?.userRoles || 0),
    0
  );
  const totalPermissions = roles.reduce(
    (sum: number, role: Role) => sum + (role._count?.rolePermissions || 0),
    0
  );

  const handleCreateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    if (editingRole) {
      updateMutation.mutate(
        { id: editingRole.id, data },
        {
          onSuccess: () => {
            setEditingRole(null);
            setIsCreateModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
      });
    }
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete the role "${name}"? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PermissionGuard
      permissions={["read_role", "create_role"]}
      requireAll={false}
    >
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Role Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage roles and their permissions
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRole(null);
              setIsCreateModalOpen(true);
            }}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Role
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total Roles</CardDescription>
              <CardTitle className="text-3xl">{totalRoles}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="mr-2 h-4 w-4" />
                Active role configurations
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                Users with assigned roles
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Permissions</CardDescription>
              <CardTitle className="text-3xl">{totalPermissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="mr-2 h-4 w-4" />
                Across all roles
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  A list of all roles in the system
                </CardDescription>
              </div>
              <div className="w-72">
                <Input
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading roles...</span>
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No roles found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search
                    ? "Try adjusting your search"
                    : "Get started by creating a new role"}
                </p>
                {!search && (
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setEditingRole(null);
                        setIsCreateModalOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role: Role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            <span>{role.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          {role.description || (
                            <span className="text-gray-400">
                              No description
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50">
                            <Users className="h-3 w-3 mr-1" />
                            {role._count?.userRoles || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50">
                            <Lock className="h-3 w-3 mr-1" />
                            {role._count?.rolePermissions || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/roles/${role.id}`)
                              }
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingRole(role);
                                setIsCreateModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteRole(role.id, role.name)
                              }
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, totalRoles)} of {totalRoles}{" "}
                      roles
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, idx, arr) => (
                            <>
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span className="px-2">...</span>
                              )}
                              <Button
                                key={p}
                                variant={p === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(p)}
                              >
                                {p}
                              </Button>
                            </>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Role Dialog */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Edit Role" : "Create New Role"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  defaultValue={editingRole?.name}
                  required
                  placeholder="e.g., MANAGER, TEAM_LEAD"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use uppercase with underscores for multi-word names
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Input
                  name="description"
                  defaultValue={editingRole?.description}
                  placeholder="Brief description of this role"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingRole(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingRole ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingRole ? "Update Role" : "Create Role"}</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
