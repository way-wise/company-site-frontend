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
