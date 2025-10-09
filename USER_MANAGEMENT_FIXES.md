# User Management Fixes - Prisma Migration

This document outlines the fixes applied to the user management system after the Prisma schema migration from single-role to multi-role (UserRoleAssignment) system.

## Changes Made

### 1. Frontend: `admin/_components/user-components/users-table.tsx`

#### Fixed Role Display in Table

- **Before**: Expected single `role` field
- **After**: Uses `roles` array from backend
- Now displays primary role with badge showing additional roles count if user has multiple roles
- Example: "Admin +1" if user has 2 roles

#### Disabled Role Filtering

- **Reason**: Backend doesn't support filtering by role name with new UserRoleAssignment structure
- **Status**: Commented out, needs backend implementation
- **TODO**: Implement backend support for filtering users by role assignment

#### Disabled Role Update Feature

- **Reason**: Backend no longer has `role` field; uses UserRoleAssignment junction table
- **Status**: Menu item and handler commented out
- **TODO**: Create new backend endpoint to manage UserRoleAssignment (add/remove roles)

### 2. Frontend: `admin/_components/user-components/user-details.tsx`

#### Fixed Role Display

- **Before**: Displayed single `user.role`
- **After**: Maps over `user.roles` array and displays each role as a badge
- Handles empty roles array gracefully with "No Role" badge

### 3. Frontend: `employee/users/users-table.tsx`

#### Fixed Role Display in Table

- Same changes as admin users-table.tsx
- Now uses `roles` array and displays primary role with count badge

### 4. Frontend: `client/users/users-table.tsx`

#### Fixed Role Display in Table

- Same changes as admin users-table.tsx
- Now uses `roles` array and displays primary role with count badge

### 5. Frontend: `components/shared/Navbar.tsx`

#### Fixed Dashboard Link Logic

- **Before**: Used `user.role` to determine dashboard link
- **After**: Uses `user.roles[0]?.name` (primary role) to determine dashboard link
- Properly handles cases where user might not have roles

### 6. Backend: `user.service.ts`

#### Fixed `getSingleUserFromDB` Function

- **Before**: Returned raw Prisma data with nested structure
- **After**: Transforms data to match frontend expectations:
  ```typescript
  {
    id: string,
    name: string,
    email: string,
    roles: Role[], // Flattened from UserRoleAssignment
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    contactNumber: string,
    gender: "MALE" | "FEMALE",
    image: string | undefined,
    emailVerified: boolean
  }
  ```

## Database Schema Changes

### Old Schema (Before Migration)

```prisma
model User {
  id       String   @id
  name     String
  email    String
  role     UserRole // Single role enum
  isActive Boolean
  // ... other fields
}
```

### New Schema (After Migration)

```prisma
model User {
  id       String               @id
  name     String
  email    String
  status   UserStatus           // ACTIVE, BLOCKED, DELETED
  roles    UserRoleAssignment[] // Many-to-many relationship
  // ... other fields
}

model UserRoleAssignment {
  id         String   @id
  userId     String
  roleId     String
  assignedAt DateTime
  user       User     @relation(...)
  role       Role     @relation(...)
  @@unique([userId, roleId])
}

model Role {
  id              String             @id
  name            String             @unique
  description     String?
  rolePermissions RolePermission[]
  userRoles       UserRoleAssignment[]
}
```

## What Still Needs Implementation

### Backend Requirements

1. **Role Filtering Endpoint**

   - Endpoint: `GET /user/all-users?role=ADMIN`
   - Should filter users who have the specified role in their UserRoleAssignment

2. **Role Management Endpoints**
   - `POST /user/:userId/roles` - Assign role to user
   - `DELETE /user/:userId/roles/:roleId` - Remove role from user
   - `PUT /user/:userId/roles` - Replace all user roles

### Frontend Requirements

1. **Re-enable Role Filter**

   - Uncomment role filter UI in `users-table.tsx`
   - Update to use new backend filtering endpoint

2. **Implement Role Management UI**

   - Create modal for managing user roles
   - Allow assigning/removing multiple roles
   - Show all assigned roles with ability to remove each

3. **Update User Service**
   - Add methods for role assignment operations
   - Update types to support role management

## Testing Checklist

- [x] Users list displays correctly with roles
- [x] User details page shows all assigned roles
- [x] User creation (Client, Admin, Employee) works
- [x] User ban/unban functionality works
- [x] User delete functionality works
- [ ] Role filtering (pending backend support)
- [ ] Role update (pending backend support)

## Breaking Changes

1. **`user.role` no longer exists** - Use `user.roles[0]?.name` for primary role
2. **`user.isActive`** mapped from `user.status === "ACTIVE"`
3. **Role updates** require new API endpoints and cannot use the old PATCH /user/:id endpoint

## Migration Notes

All existing user role assignment operations will need to be updated to work with the new UserRoleAssignment system. The seed script should populate the UserRoleAssignment table for existing users.
