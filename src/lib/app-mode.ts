/**
 * Utility functions for determining app deployment mode and URLs
 * Used to conditionally render features based on whether the app is deployed
 * as the public site or the dashboard
 */

export const isPublicMode = (): boolean =>
  process.env.NEXT_PUBLIC_APP_MODE === "public";

export const isDashboardMode = (): boolean =>
  process.env.NEXT_PUBLIC_APP_MODE === "dashboard";

export const getPublicUrl = (): string =>
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

export const getDashboardUrl = (): string =>
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000";

export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:5000";
  }

  throw new Error("Missing required env var: NEXT_PUBLIC_API_URL in production");
};

/**
 * List of public routes that should be accessible in public mode
 */
export const PUBLIC_ROUTES = [
  "/",
  "/about-us",
  "/services",
  "/contact-us",
  "/faq",
  "/microsoft-support",
  "/medical-it-support",
  "/privacy-policy",
  "/terms-and-conditions",
  "/book",
];

/**
 * List of protected route prefixes that should only be accessible in dashboard mode
 */
export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/client",
  "/profile",
];

/**
 * List of auth routes
 */
export const AUTH_ROUTES = ["/login", "/register"];

/**
 * Check if a given pathname is a public route
 */
export const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

/**
 * Check if a given pathname is a protected route
 */
export const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

/**
 * Check if a given pathname is an auth route
 */
export const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.includes(pathname);
