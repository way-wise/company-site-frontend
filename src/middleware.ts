import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = new Set(["/login", "/register"]);
const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/admin", "/client"];

const hasSession = (request: NextRequest): boolean => {
  const accessToken = request.cookies.get("accessToken")?.value;
  return typeof accessToken === "string" && accessToken.trim().length > 0;
};

const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const isAuthRoute = (pathname: string): boolean => AUTH_ROUTES.has(pathname);

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl } = request;
  const { pathname } = nextUrl;
  const authenticated = hasSession(request);

  if (!authenticated && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/client/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
