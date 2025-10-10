import { StaticImageData } from "next/image";

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  group: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: RolePermission[];
  _count?: {
    userRoles: number;
    rolePermissions: number;
  };
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  assignedAt: string;
}

// Admin, Client, Employee Types
export interface Admin {
  id: string;
  userId: string;
  profilePhoto?: string;
  contactNumber?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  gender: "MALE" | "FEMALE";
  isDeleted: boolean;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedIn?: string;
  facebook?: string;
  language?: string;
  education?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  gender: "MALE" | "FEMALE";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  contactNumber: string;
  gender: "MALE" | "FEMALE";
  roles: UserRoleAssignment[]; // Backend returns UserRoleAssignment[] from /auth/me
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
  emailVerified?: boolean;
  totalPoints?: number;
  // User relationships from backend
  admin?: Admin | null;
  client?: Client | null;
  employee?: Employee | null;
}

// Pagination Types
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// User Management Types
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  adminUsers: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  password: string;
  client: {
    name: string;
    email: string;
    gender: "MALE" | "FEMALE";
  };
}

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  url: string;
  image: StaticImageData;
};

// Service Types for API (matching backend Prisma model)
export interface Service {
  id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types for forms (with File support)
export interface ServiceFormData {
  name: string;
  image?: File | string;
  description?: string;
}

// Service Types for Frontend Display (with images)
export type ServiceDisplay = {
  id: number;
  title: string;
  description: string;
  bgImage: StaticImageData;
  url: string;
  icon: StaticImageData;
  slug: string;
};

export type ExpertiseArea = {
  number: string;
  title: string;
  description: string;
};

export type ServiceDetail = ServiceDisplay & {
  detailedDescription: string;
  videoImage: StaticImageData;
  expertiseAreas: ExpertiseArea[];
  serviceOutcomes: string[];
};

// Service Management Types
export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
}

export interface ServicesQueryParams {
  page: number;
  limit: number;
  search?: string;
}

// Permission Management Types
export interface PermissionFormData {
  name: string;
  group: string;
  description?: string;
}

export interface PermissionStats {
  totalPermissions: number;
  totalGroups: number;
}

export interface PermissionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  group?: string;
}

// Role Management Types
export interface RoleFormData {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface RoleStats {
  totalRoles: number;
  totalAssignments: number;
}

export interface RolesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AssignRoleToUserData {
  userId: string;
  roleId: string;
}

export interface AssignPermissionsToRoleData {
  permissionIds: string[];
}
