import { StaticImageData } from "next/image";

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  contactNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "CLIENT";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
  emailVerified?: boolean;
  totalPoints?: number;
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
    gender: "MALE" | "FEMALE" | "OTHER";
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
