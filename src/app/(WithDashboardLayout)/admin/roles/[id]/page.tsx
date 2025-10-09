"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "@/hooks/usePermissionMutations";
import { useAssignPermissionsToRole, useRole } from "@/hooks/useRoleMutations";
import { Permission } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const { data: roleData, isLoading: isLoadingRole } = useRole(roleId);
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    usePermissions();
  const assignPermissionsMutation = useAssignPermissionsToRole();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (roleData?.data?.rolePermissions) {
      setSelectedPermissions(
        roleData.data.rolePermissions.map((rp: any) => rp.permissionId)
      );
    }
  }, [roleData]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    assignPermissionsMutation.mutate({
      roleId,
      data: { permissionIds: selectedPermissions },
    });
  };

  // Group permissions by group
  const groupedPermissions = permissionsData?.data?.result?.reduce(
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PermissionGuard
      permissions={["read_role", "update_role"]}
      requireAll={false}
    >
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{roleData?.data?.name}</h1>
              <p className="text-gray-600">{roleData?.data?.description}</p>
            </div>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Permissions
            </Button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedPermissions || {}).map(
              ([group, permissions]: [string, any]) => (
                <div key={group} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 capitalize">
                    {group.replace(/_/g, " ")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission: Permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-2"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() =>
                            handleTogglePermission(permission.id)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.name}
                          </label>
                          {permission.description && (
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
