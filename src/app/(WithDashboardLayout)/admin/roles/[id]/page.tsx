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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/usePermissionMutations";
import {
  useAssignPermissionsToRole,
  useAssignRoleToUser,
  useRemoveRoleFromUser,
  useRole,
} from "@/hooks/useRoleMutations";
import { useUsers } from "@/hooks/useUserMutations";
import { Permission, User } from "@/types";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Plus,
  Save,
  Shield,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const { data: roleData, isLoading: isLoadingRole } = useRole(roleId);
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    usePermissions({ page: 1, limit: 100 });
  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const assignPermissionsMutation = useAssignPermissionsToRole();
  const assignRoleMutation = useAssignRoleToUser();
  const removeRoleMutation = useRemoveRoleFromUser();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const role = roleData?.data;
  const allPermissions = permissionsData?.data?.result || [];
  const allUsers = usersData?.data || [];

  // Get users with this role
  const usersWithRole =
    allUsers.filter((user: User) => user.roles?.some((r) => r.id === roleId)) ||
    [];

  // Get users without this role (for assignment)
  const availableUsers = allUsers.filter(
    (user: User) => !user.roles?.some((r) => r.id === roleId)
  );

  // Filter available users based on search
  const filteredAvailableUsers = availableUsers.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  useEffect(() => {
    if (role?.rolePermissions) {
      const initialPermissions = role.rolePermissions.map(
        (rp: any) => rp.permissionId
      );
      setSelectedPermissions(initialPermissions);
    }
  }, [role]);

  useEffect(() => {
    // Check if there are changes
    const initialPermissions =
      role?.rolePermissions?.map((rp: any) => rp.permissionId) || [];
    const hasPermissionChanges =
      selectedPermissions.length !== initialPermissions.length ||
      selectedPermissions.some((id) => !initialPermissions.includes(id));
    setHasChanges(hasPermissionChanges);
  }, [selectedPermissions, role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllInGroup = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map((p) => p.id);
    const allSelected = groupIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !groupIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...groupIds])]);
    }
  };

  const handleSavePermissions = () => {
    assignPermissionsMutation.mutate({
      roleId,
      data: { permissionIds: selectedPermissions },
    });
  };

  const handleAssignUser = (userId: string) => {
    assignRoleMutation.mutate(
      { userId, roleId },
      {
        onSuccess: () => {
          setIsAssignUserModalOpen(false);
          setSearchUser("");
        },
      }
    );
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this role from the user?")) {
      removeRoleMutation.mutate({ userId, roleId });
    }
  };

  // Group permissions by group
  const groupedPermissions = allPermissions.reduce(
    (acc: any, permission: Permission) => {
      if (!acc[permission.group]) {
        acc[permission.group] = [];
      }
      acc[permission.group].push(permission);
      return acc;
    },
    {}
  );

  if (isLoadingRole || isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <PermissionGuard
      permissions={["read_role", "update_role"]}
      requireAll={false}
    >
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  {role?.name}
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                {role?.description || "No description"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Assigned Permissions</CardDescription>
              <CardTitle className="text-3xl">
                {selectedPermissions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="mr-2 h-4 w-4" />
                Out of {allPermissions.length} total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Users with Role</CardDescription>
              <CardTitle className="text-3xl">{usersWithRole.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                Active assignments
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Permission Groups</CardDescription>
              <CardTitle className="text-3xl">
                {Object.keys(groupedPermissions).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="mr-2 h-4 w-4" />
                Organized categories
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="permissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="permissions">
              <Lock className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Assigned Users
            </TabsTrigger>
          </TabsList>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Permissions</CardTitle>
                    <CardDescription>
                      Select permissions to assign to this role
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleSavePermissions}
                    disabled={
                      !hasChanges || assignPermissionsMutation.isPending
                    }
                  >
                    {assignPermissionsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedPermissions).map(
                  ([group, permissions]: [string, any]) => {
                    const groupPermissionIds = permissions.map(
                      (p: Permission) => p.id
                    );
                    const selectedInGroup = groupPermissionIds.filter(
                      (id: string) => selectedPermissions.includes(id)
                    ).length;

                    return (
                      <div
                        key={group}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg capitalize">
                              {group.replace(/_/g, " ")}
                            </h3>
                            <Badge variant="outline">
                              {selectedInGroup} / {permissions.length}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAllInGroup(permissions)}
                          >
                            {selectedInGroup === permissions.length ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Deselect All
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Select All
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {permissions.map((permission: Permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={permission.id}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handleTogglePermission(permission.id)
                                }
                              />
                              <div className="grid gap-1 leading-none flex-1">
                                <label
                                  htmlFor={permission.id}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {permission.name}
                                </label>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assigned Users</CardTitle>
                    <CardDescription>
                      Users who have this role assigned
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAssignUserModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersWithRole.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No users assigned
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by assigning this role to a user
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => setIsAssignUserModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign User
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithRole.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isActive ? "success" : "destructive"
                              }
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                              disabled={removeRoleMutation.isPending}
                            >
                              {removeRoleMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign User Dialog */}
        <Dialog
          open={isAssignUserModalOpen}
          onOpenChange={setIsAssignUserModalOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign User to Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Search users by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {filteredAvailableUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {availableUsers.length === 0
                      ? "All users already have this role"
                      : "No users found matching your search"}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAvailableUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleAssignUser(user.id)}
                              disabled={assignRoleMutation.isPending}
                            >
                              {assignRoleMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Assign
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
