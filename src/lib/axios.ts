import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookieManager } from "./cookies";

// Create axios instance with best practices
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API || "http://localhost:3001/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for authentication
});

// Request interceptor - add auth token from cookies
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookieManager.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear cookies and redirect
    if (error.response?.status === 401) {
      cookieManager.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
