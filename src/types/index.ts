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
  role: "CLIENT" | "ADMIN";
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
    contactNumber: string;
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

export type Service = {
  id: number;
  title: string;
  description: string;
  bgImage: StaticImageData;
  url: string;
  icon: StaticImageData;
};
