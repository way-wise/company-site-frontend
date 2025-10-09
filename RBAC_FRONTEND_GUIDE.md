# Frontend RBAC Integration Guide

This guide explains how to use the new Role-Based Access Control (RBAC) system in the frontend.

## Overview

The frontend now supports:

- Permission-based route protection
- Role-based component rendering
- Dynamic permission checking
- User permission management UI

## Features

### 1. Permission Guard Component

Protect entire pages or components based on permissions:

```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export default function UsersManagementPage() {
  return (
    <PermissionGuard
      permissions={["read_user", "create_user"]}
      requireAll={false} // Requires ANY of the permissions
      fallback={<AccessDenied />}
      redirectTo="/login"
    >
      <UserManagementContent />
    </PermissionGuard>
  );
}
```

### 2. Role Guard Component

Protect content based on roles:

```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminDashboard() {
  return (
    <RoleGuard
      roles={["ADMIN", "SUPER_ADMIN"]}
      requireAll={false} // Requires ANY of the roles
    >
      <AdminContent />
    </RoleGuard>
  );
}
```

### 3. Auth Context Hooks

Use permission checks in your components:

```tsx
import { useAuth } from "@/context/UserContext";

function MyComponent() {
  const {
    user,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = useAuth();

  // Check single permission
  if (hasPermission("create_user")) {
    // Show create user button
  }

  // Check multiple permissions (any)
  if (hasAnyPermission(["read_user", "update_user"])) {
    // Show user management section
  }

  // Check multiple permissions (all)
  if (hasAllPermissions(["read_user", "update_user", "delete_user"])) {
    // Show full user management
  }

  // Check role
  if (hasRole("ADMIN")) {
    // Show admin features
  }

  // Check multiple roles
  if (hasAnyRole(["ADMIN", "SUPER_ADMIN"])) {
    // Show admin/super admin features
  }

  return <div>...</div>;
}
```

### 4. Permission Check Hook

For conditional rendering:

```tsx
import { usePermissionCheck } from "@/components/auth/PermissionGuard";

function Toolbar() {
  const { hasPermission, hasRole } = usePermissionCheck();

  return (
    <div className="toolbar">
      {hasPermission("create_user") && <Button>Create User</Button>}

      {hasPermission("delete_user") && (
        <Button variant="destructive">Delete User</Button>
      )}

      {hasRole("ADMIN") && <AdminSettings />}
    </div>
  );
}
```

## Admin Pages

### Permission Management

Navigate to `/admin/permissions` to:

- View all permissions
- Create new permissions
- Edit existing permissions
- Delete permissions
- Filter by permission group

### Role Management

Navigate to `/admin/roles` to:

- View all roles
- Create new roles
- Edit role details
- Delete roles
- Manage role permissions

### Role Details

Navigate to `/admin/roles/[id]` to:

- View role information
- Assign/remove permissions from role
- See grouped permissions
- Save permission changes

## API Services

### Permission Service

```tsx
import { PermissionService } from "@/services/PermissionService";

// Get all permissions
const permissions = await PermissionService.getAllPermissions({
  page: 1,
  limit: 10,
  search: "user",
  group: "user_management",
});

// Get single permission
const permission = await PermissionService.getPermissionById(id);

// Get permission groups
const groups = await PermissionService.getPermissionGroups();

// Create permission
const newPermission = await PermissionService.createPermission({
  name: "view_reports",
  group: "report_management",
  description: "Can view system reports",
});

// Update permission
await PermissionService.updatePermission(id, { description: "Updated" });

// Delete permission
await PermissionService.deletePermission(id);
```

### Role Service

```tsx
import { RoleService } from "@/services/RoleService";

// Get all roles
const roles = await RoleService.getAllRoles({
  page: 1,
  limit: 10,
  search: "admin",
});

// Get single role
const role = await RoleService.getRoleById(id);

// Get user roles
const userRoles = await RoleService.getUserRoles(userId);

// Get user permissions (from all roles)
const userPermissions = await RoleService.getUserPermissions(userId);

// Create role
const newRole = await RoleService.createRole({
  name: "MANAGER",
  description: "Manager role",
  permissionIds: ["perm1", "perm2"],
});

// Assign permissions to role
await RoleService.assignPermissionsToRole(roleId, {
  permissionIds: ["perm1", "perm2", "perm3"],
});

// Assign role to user
await RoleService.assignRoleToUser({
  userId: "user123",
  roleId: "role456",
});

// Remove role from user
await RoleService.removeRoleFromUser({
  userId: "user123",
  roleId: "role456",
});
```

## React Query Hooks

### Permission Hooks

```tsx
import {
  usePermissions,
  usePermission,
  usePermissionGroups,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/usePermissionMutations";

function PermissionsManager() {
  // Fetch permissions
  const { data, isLoading } = usePermissions({
    search: "user",
    group: "user_management",
  });

  // Fetch single permission
  const { data: permission } = usePermission(permissionId);

  // Fetch groups
  const { data: groups } = usePermissionGroups();

  // Create mutation
  const createMutation = useCreatePermission();
  const handleCreate = () => {
    createMutation.mutate({
      name: "new_permission",
      group: "custom_group",
    });
  };

  // Update mutation
  const updateMutation = useUpdatePermission();
  const handleUpdate = () => {
    updateMutation.mutate({
      id: permissionId,
      data: { description: "Updated description" },
    });
  };

  // Delete mutation
  const deleteMutation = useDeletePermission();
  const handleDelete = () => {
    deleteMutation.mutate(permissionId);
  };

  return <div>...</div>;
}
```

### Role Hooks

```tsx
import {
  useRoles,
  useRole,
  useUserRoles,
  useUserPermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignPermissionsToRole,
  useAssignRoleToUser,
  useRemoveRoleFromUser,
} from "@/hooks/useRoleMutations";

function RoleManager() {
  // Fetch roles
  const { data: roles } = useRoles({ search: "admin" });

  // Fetch single role
  const { data: role } = useRole(roleId);

  // Fetch user roles
  const { data: userRoles } = useUserRoles(userId);

  // Fetch user permissions
  const { data: userPermissions } = useUserPermissions(userId);

  // Create role
  const createMutation = useCreateRole();
  createMutation.mutate({
    name: "MANAGER",
    description: "Manager role",
  });

  // Assign permissions to role
  const assignPermissions = useAssignPermissionsToRole();
  assignPermissions.mutate({
    roleId,
    data: { permissionIds: ["perm1", "perm2"] },
  });

  // Assign role to user
  const assignRole = useAssignRoleToUser();
  assignRole.mutate({
    userId: "user123",
    roleId: "role456",
  });

  return <div>...</div>;
}
```

## TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
// Permission types
Permission;
PermissionFormData;
PermissionStats;
PermissionsQueryParams;

// Role types
Role;
RoleFormData;
RolePermission;
UserRoleAssignment;
RoleStats;
RolesQueryParams;
AssignRoleToUserData;
AssignPermissionsToRoleData;

// User type (updated)
User; // Now includes roles: Role[] instead of single role
```

## Example: Complete Feature Implementation

Here's a complete example of implementing a feature with RBAC:

```tsx
// pages/admin/users/page.tsx
"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useAuth } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const { hasPermission, hasAnyPermission } = useAuth();

  return (
    <PermissionGuard permissions={["read_user"]} redirectTo="/dashboard">
      <div>
        <h1>User Management</h1>

        {/* Only show if user has create permission */}
        {hasPermission("create_user") && <Button>Create New User</Button>}

        {/* Show if user has any of these permissions */}
        {hasAnyPermission(["update_user", "delete_user"]) && (
          <UserActionButtons />
        )}

        <UsersList />
      </div>
    </PermissionGuard>
  );
}
```

## Best Practices

1. **Always use guards for page-level protection**
2. **Use hooks for component-level conditional rendering**
3. **Cache permission checks when possible**
4. **Handle loading states properly**
5. **Provide meaningful fallback UI**
6. **Test permission-based features thoroughly**

## Common Patterns

### Nested Protection

```tsx
<RoleGuard roles={["ADMIN"]}>
  <AdminPanel>
    <PermissionGuard permissions={["delete_user"]}>
      <DangerZone />
    </PermissionGuard>
  </AdminPanel>
</RoleGuard>
```

### Conditional Navigation

```tsx
function Navigation() {
  const { hasRole, hasPermission } = useAuth();

  return (
    <nav>
      <Link href="/">Home</Link>
      {hasRole("ADMIN") && <Link href="/admin">Admin</Link>}
      {hasPermission("read_user") && <Link href="/users">Users</Link>}
    </nav>
  );
}
```

### Dynamic Button States

```tsx
function ActionButton() {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("delete_user");

  return (
    <Button
      disabled={!canDelete}
      variant={canDelete ? "destructive" : "secondary"}
    >
      {canDelete ? "Delete" : "No Permission"}
    </Button>
  );
}
```

## Troubleshooting

### Permissions not updating

- Call `refreshUser()` from auth context after role/permission changes
- Clear browser cache and cookies
- Re-login to fetch fresh permissions

### Guards not working

- Ensure AuthProvider wraps your app
- Check that user is authenticated
- Verify permission names match backend

### TypeScript errors

- Update types from `src/types/index.ts`
- User type now has `roles: Role[]` instead of `role: string`
