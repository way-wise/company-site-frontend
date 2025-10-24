import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1";
const REQUEST_TIMEOUT = 20000;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig
) => {
  try {
    await apiClient.post("/auth/refresh-token");
    return apiClient(originalRequest);
  } catch {
    // Redirect to login if not on auth pages
    if (typeof window !== "undefined") {
      const isAuthPage = ["/login", "/register"].includes(
        window.location.pathname
      );
      if (!isAuthPage) window.location.href = "/login";
    }
    throw new Error("Token refresh failed");
  }
};

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh for refresh endpoint to prevent loops
    if (config.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Attempt token refresh on 401 errors
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      return handleTokenRefresh(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
