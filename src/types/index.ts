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
  name: string; // Direct access to role name
  assignedAt: string;
}

// User Profile Types (matches Prisma schema)
export interface UserProfile {
  id: string;
  userId: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  gender?: "MALE" | "FEMALE";
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

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  roles: UserRoleAssignment[]; // Backend returns UserRoleAssignment[] from /auth/me
  userProfile?: UserProfile | null;
  createdAt: string;
  updatedAt: string;
  isPasswordChangeRequired?: boolean;
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
  meta: PaginationMeta;
  result: T[];
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

export type PortfolioProject = {
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
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types for forms (with File support)
export interface ServiceFormData {
  name: string;
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

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  userProfileId: string;
  createdAt: string;
  updatedAt: string;
  userProfile?: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  milestones?: Milestone[];
  _count?: {
    milestones: number;
  };
}

export interface ProjectFormData {
  name: string;
  description?: string;
  status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  userProfileId: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
}

export interface ProjectsQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  userProfileId?: string;
}

// Milestone Types
export interface Milestone {
  id: string;
  name: string;
  description?: string;
  status:
    | "PENDING"
    | "ONGOING"
    | "COMPLETED"
    | "REVIEW"
    | "APPROVED"
    | "REJECTED";
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    status: string;
  };
  employeeMilestones?: EmployeeMilestone[];
  serviceMilestones?: ServiceMilestone[];
  Task?: Task[];
  _count?: {
    employeeMilestones: number;
    serviceMilestones: number;
    Task: number;
  };
}

export interface EmployeeMilestone {
  id: string;
  userProfileId: string;
  milestoneId: string;
  status: "ASSIGNED" | "ONGOING" | "COMPLETED" | "RELEASED";
  createdAt: string;
  updatedAt: string;
  userProfile?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface ServiceMilestone {
  id: string;
  serviceId: string;
  milestoneId: string;
  createdAt: string;
  updatedAt: string;
  service?: {
    id: string;
    name: string;
    image?: string;
    description?: string;
  };
}

export interface MilestoneFormData {
  name: string;
  description?: string;
  status?:
    | "PENDING"
    | "ONGOING"
    | "COMPLETED"
    | "REVIEW"
    | "APPROVED"
    | "REJECTED";
  projectId: string;
}

export interface MilestoneStats {
  totalMilestones: number;
  pendingMilestones: number;
  ongoingMilestones: number;
  completedMilestones: number;
}

export interface MilestonesQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  projectId?: string;
}

// Task Types
export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  title: string;
  description?: string;
  milestoneId: string;
  creatorId?: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progress: number;
  estimatedHours?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  milestone?: {
    id: string;
    name: string;
    status: string;
    project?: {
      id: string;
      name: string;
    };
  };
  creator?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  assignments?: TaskAssignment[];
  comments?: TaskComment[];
  _count?: {
    comments: number;
    assignments: number;
  };
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userProfileId: string;
  assignedAt: string;
  role?: string;
  userProfile?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  userProfileId: string;
  createdAt: string;
  userProfile?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface TaskFormData {
  title: string;
  description?: string;
  milestoneId: string;
  creatorId?: string;
  status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progress?: number;
  estimatedHours?: number;
}

export interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  reviewTasks: number;
  doneTasks: number;
}

export interface TasksQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  priority?: string;
  milestoneId?: string;
  creatorId?: string;
}

// Chat Types
export type ConversationType = "DIRECT" | "GROUP" | "PROJECT";

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userProfileId: string;
  joinedAt: string;
  lastReadAt: string;
  isAdmin: boolean;
  userProfile: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    profilePhoto?: string;
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: unknown[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    profilePhoto?: string;
  };
}

export interface Conversation {
  id: string;
  name?: string;
  type: ConversationType;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  messages?: ChatMessage[];
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  project?: {
    id: string;
    name: string;
    description?: string;
  };
  _count?: {
    messages: number;
  };
}

export interface CreateConversationData {
  type: ConversationType;
  name?: string;
  projectId?: string;
  participantIds: string[];
}

export interface ConversationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ConversationType;
  projectId?: string;
}
