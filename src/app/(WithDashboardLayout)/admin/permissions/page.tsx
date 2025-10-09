"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
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
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PermissionsPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );

  const { data: permissionsData, isLoading } = usePermissions({
    search,
    group: selectedGroup || undefined,
  });
  const { data: groupsData } = usePermissionGroups();
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  const handleCreatePermission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      group: formData.get("group") as string,
      description: formData.get("description") as string,
    };

    if (editingPermission) {
      updateMutation.mutate(
        { id: editingPermission.id, data },
        {
          onSuccess: () => {
            setEditingPermission(null);
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

  const handleDeletePermission = (id: string) => {
    if (confirm("Are you sure you want to delete this permission?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PermissionGuard
      permissions={["read_permission", "create_permission"]}
      requireAll={false}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Permission Management</h1>
          <Button
            onClick={() => {
              setEditingPermission(null);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Permission
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search permissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Groups</SelectItem>
                {groupsData?.data?.map((group: string) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionsData?.data?.result?.map(
                  (permission: Permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {permission.name}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {permission.group}
                        </span>
                      </TableCell>
                      <TableCell>{permission.description || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPermission(permission);
                              setIsCreateModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeletePermission(permission.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPermission ? "Edit Permission" : "Create Permission"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePermission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  defaultValue={editingPermission?.name}
                  required
                  placeholder="e.g., create_user"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group</label>
                <Input
                  name="group"
                  defaultValue={editingPermission?.group}
                  required
                  placeholder="e.g., user_management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  name="description"
                  defaultValue={editingPermission?.description}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPermission ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
