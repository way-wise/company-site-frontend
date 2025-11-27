import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDashboardUrl,
  getPublicUrl,
  isAuthRoute,
  isDashboardMode,
  isProtectedRoute,
  isPublicMode,
  isPublicRoute,
} from "./lib/app-mode";

const hasSession = (request: NextRequest): boolean => {
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasToken = typeof accessToken === "string" && accessToken.trim().length > 0;
  
  // Debug logging for production troubleshooting
  if (process.env.NODE_ENV === "production") {
    console.log("[Auth Middleware]", {
      pathname: request.nextUrl.pathname,
      hasAccessToken: hasToken,
      cookieCount: request.cookies.getAll().length,
      allCookies: request.cookies.getAll().map(c => c.name),
    });
  }
  
  return hasToken;
};

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl } = request;
  const { pathname } = nextUrl;
  const authenticated = hasSession(request);

  // DEVELOPMENT MODE: If no APP_MODE is set (localhost), allow everything with normal auth
  const isDevelopment = !process.env.NEXT_PUBLIC_APP_MODE;

  if (isDevelopment) {
    // Standard authentication flow for local development
    if (!authenticated && isProtectedRoute(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (authenticated && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow all routes in development mode
    return NextResponse.next();
  }

  // PUBLIC MODE: Only allow public pages, redirect auth routes to dashboard domain
  if (isPublicMode()) {
    // If trying to access protected routes, redirect to dashboard domain
    if (isProtectedRoute(pathname)) {
      const dashboardUrl = new URL(pathname, getDashboardUrl());
      return NextResponse.redirect(dashboardUrl);
    }

    // If trying to access login/register, redirect to dashboard domain
    if (isAuthRoute(pathname)) {
      const dashboardUrl = new URL(pathname, getDashboardUrl());
      if (pathname === "/login" && nextUrl.searchParams.get("redirect")) {
        dashboardUrl.searchParams.set(
          "redirect",
          nextUrl.searchParams.get("redirect") || ""
        );
      }
      return NextResponse.redirect(dashboardUrl);
    }

    // Allow all other routes (public pages)
    return NextResponse.next();
  }

  // DASHBOARD MODE: Only allow dashboard/auth pages, block public pages
  if (isDashboardMode()) {
    // Block access to public pages (redirect to main domain)
    if (isPublicRoute(pathname) && pathname !== "/") {
      const publicUrl = new URL(pathname, getPublicUrl());
      return NextResponse.redirect(publicUrl);
    }

    // If accessing root, redirect to dashboard if authenticated, otherwise to login
    if (pathname === "/") {
      if (authenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Protect dashboard routes - redirect to login if not authenticated
    if (!authenticated && isProtectedRoute(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated and trying to access auth routes, redirect to dashboard
    if (authenticated && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow access to dashboard and auth routes
    return NextResponse.next();
  }

  // Should not reach here, but fallback just in case
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about-us",
    "/services",
    "/services/:path*",
    "/contact-us",
    "/faq",
    "/microsoft-support",
    "/medical-it-support",
    "/privacy-policy",
    "/terms-and-conditions",
    "/book",
    "/book/:path*",
    "/login",
    "/register",
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
