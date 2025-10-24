import { NextRequest, NextResponse } from "next/server";

// Route configurations
const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/profile", "/admin"];

// Helper functions
const hasValidToken = (request: NextRequest): boolean => {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  return !!(accessToken || refreshToken);
};

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
};

const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.includes(pathname);
};

const redirectToLogin = (
  request: NextRequest,
  pathname: string
): NextResponse => {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
};

const redirectToHome = (request: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/", request.url));
};

// Main middleware function
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const hasToken = hasValidToken(request);

  // Redirect to login if accessing protected route without token
  if (!hasToken && isProtectedRoute(pathname)) {
    return redirectToLogin(request, pathname);
  }

  // Redirect to home if accessing auth routes with valid token
  if (hasToken && isAuthRoute(pathname)) {
    return redirectToHome(request);
  }

  return NextResponse.next();
};

// Middleware configuration
export const config = {
  matcher: [
    "/login",
    "/register",
    "/client/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
