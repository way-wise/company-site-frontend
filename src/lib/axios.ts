import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with HTTPOnly cookie support
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This sends HTTPOnly cookies automatically
});

// Response interceptor - auto token refresh on 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Prevent infinite loops on refresh token endpoint
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint - backend validates refresh token and sets new HTTPOnly cookies
        await apiClient.post("/auth/refresh-token");

        // Retry original request with new cookies
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login only if not already on auth pages
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const authPages = ["/login", "/register"];

          if (!authPages.includes(currentPath)) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
