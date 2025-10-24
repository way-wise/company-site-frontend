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
        // Check if we have a refresh token cookie before attempting refresh
        const refreshTokenExists = document.cookie
          .split(";")
          .some((cookie) => cookie.trim().startsWith("refreshToken="));

        if (!refreshTokenExists) {
          // No refresh token, redirect to login only if not already on auth pages
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const authPages = ["/login", "/register"];

            if (!authPages.includes(currentPath)) {
              console.log(
                "No refresh token found, redirecting to login from:",
                currentPath
              );
              window.location.href = "/login";
            } else {
              console.log(
                "Already on auth page, skipping redirect:",
                currentPath
              );
            }
          }
          return Promise.reject(error);
        }

        // Call refresh endpoint - backend will set new HTTPOnly cookies automatically
        console.log("Refreshing token");
        await apiClient.post("/auth/refresh-token");

        // Retry original request with new cookies
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login only if not already on auth pages
        console.error("Token refresh failed:", refreshError);
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const authPages = ["/login", "/register"];

          if (!authPages.includes(currentPath)) {
            console.log(
              "Token refresh failed, redirecting to login from:",
              currentPath
            );
            window.location.href = "/login";
          } else {
            console.log(
              "Already on auth page, skipping redirect after refresh failure:",
              currentPath
            );
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
