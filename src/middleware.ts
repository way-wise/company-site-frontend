import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/client", "/profile", "/admin"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if user has any valid token (access or refresh)
  const hasValidToken = !!(accessToken || refreshToken);

  // If no tokens and trying to access protected route
  if (
    !hasValidToken &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has valid tokens and trying to access auth routes
  if (hasValidToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/login",
    "/register",
    "/client/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
