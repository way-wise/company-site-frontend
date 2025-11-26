import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { dispatchAuthLogoutEvent } from "./auth-events";

// Base API configuration
// Support both NEXT_PUBLIC_BASE_API (with /api/v1) and NEXT_PUBLIC_API_URL (without /api/v1)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API ||
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "http://localhost:5000/api/v1");
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

type FailedRequest = {
  config: InternalAxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null) => {
  const queue = [...failedQueue];
  failedQueue = [];

  queue.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    apiClient(config).then(resolve).catch(reject);
  });
};

const triggerLogout = () => {
  dispatchAuthLogoutEvent();

  if (typeof window === "undefined") {
    return;
  }

  // Redirect to dashboard login page for authentication
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000";
  const loginUrl = `${dashboardUrl}/login`;

  const authRoutes = ["/login", "/register"];
  if (!authRoutes.includes(window.location.pathname)) {
    window.location.href = loginUrl;
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
    if (
      config.url?.includes("/auth/refresh-token") ||
      config.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // Attempt token refresh on 401 errors
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;

      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ config, resolve, reject });

        if (isRefreshing) {
          return;
        }

        isRefreshing = true;

        apiClient
          .post("/auth/refresh-token")
          .then(() => {
            processQueue(null);
          })
          .catch((refreshError) => {
            triggerLogout();
            processQueue(refreshError as AxiosError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
