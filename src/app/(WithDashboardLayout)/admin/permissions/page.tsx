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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreatePermission,
  useDeletePermission,
  usePermissionGroups,
  usePermissions,
  useUpdatePermission,
} from "@/hooks/usePermissionMutations";
import { Permission } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Key,
  Loader2,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function PermissionsPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [formGroup, setFormGroup] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const { data: permissionsData, isLoading } = usePermissions({
    search,
    group: selectedGroup || undefined,
    page,
    limit,
  });
  const { data: groupsData } = usePermissionGroups();
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  const permissions = permissionsData?.data?.result || [];
  const totalPermissions = permissionsData?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalPermissions / limit);

  // Calculate stats
  const groups = groupsData?.data || [];
  const totalGroups = groups.length;

  const handleCreatePermission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: formName,
      group: formGroup,
      description: formDescription,
    };

    if (editingPermission) {
      updateMutation.mutate(
        { id: editingPermission.id, data },
        {
          onSuccess: () => {
            setEditingPermission(null);
            setIsCreateModalOpen(false);
            setFormGroup("");
            setFormName("");
            setFormDescription("");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setFormGroup("");
          setFormName("");
          setFormDescription("");
        },
      });
    }
  };

  const handleDeletePermission = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete the permission "${name}"? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PermissionGuard
      permissions={["read_permission", "create_permission"]}
      requireAll={false}
    >
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Permission Management
            </h1>
            <p className="text-gray-600 mt-1">
              Define and manage system permissions
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingPermission(null);
              setFormGroup("");
              setFormName("");
              setFormDescription("");
              setIsCreateModalOpen(true);
            }}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Permission
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total Permissions</CardDescription>
              <CardTitle className="text-3xl">{totalPermissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Key className="mr-2 h-4 w-4" />
                System-wide permissions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Permission Groups</CardDescription>
              <CardTitle className="text-3xl">{totalGroups}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="mr-2 h-4 w-4" />
                Organized by functionality
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Average per Group</CardDescription>
              <CardTitle className="text-3xl">
                {totalGroups > 0
                  ? Math.round(totalPermissions / totalGroups)
                  : 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Key className="mr-2 h-4 w-4" />
                Permissions distribution
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  A list of all permissions in the system
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search permissions..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-64"
                />
                <Select
                  value={selectedGroup || "all"}
                  onValueChange={(value) => {
                    setSelectedGroup(value === "all" ? "" : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map((group: string) => (
                      <SelectItem key={group} value={group}>
                        {group.replace(/_/g, " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">
                  Loading permissions...
                </span>
              </div>
            ) : permissions.length === 0 ? (
              <div className="text-center py-12">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No permissions found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search || selectedGroup
                    ? "Try adjusting your filters"
                    : "Get started by creating a new permission"}
                </p>
                {!search && !selectedGroup && (
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setEditingPermission(null);
                        setFormGroup("");
                        setFormName("");
                        setFormDescription("");
                        setIsCreateModalOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Permission
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission Name</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission: Permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Key className="h-4 w-4 text-purple-600" />
                            </div>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {permission.name}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50">
                            {permission.group.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          {permission.description || (
                            <span className="text-gray-400">
                              No description
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingPermission(permission);
                                setFormGroup(permission.group);
                                setFormName(permission.name);
                                setFormDescription(
                                  permission.description || ""
                                );
                                setIsCreateModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeletePermission(
                                  permission.id,
                                  permission.name
                                )
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
                      {Math.min(page * limit, totalPermissions)} of{" "}
                      {totalPermissions} permissions
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
                                <span key={`ellipsis-${p}`} className="px-2">
                                  ...
                                </span>
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

        {/* Create/Edit Permission Dialog */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPermission
                  ? "Edit Permission"
                  : "Create New Permission"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePermission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Permission Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="e.g., create_user, read_service"
                  className="w-full font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use lowercase with underscores (snake_case)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Group <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  required
                  placeholder="e.g., user_management, service_management"
                  className="w-full font-mono"
                />
                {groups.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">
                      Existing groups (click to use):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {groups.map((group: string) => (
                        <Badge
                          key={group}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => setFormGroup(group)}
                        >
                          {group.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Type a new group or click an existing one above
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What this permission allows"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingPermission(null);
                    setFormGroup("");
                    setFormName("");
                    setFormDescription("");
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
                      {editingPermission ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingPermission
                        ? "Update Permission"
                        : "Create Permission"}
                    </>
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
