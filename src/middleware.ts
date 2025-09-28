import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/profile", "/admin"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // If no token and trying to access protected route
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and trying to access auth routes
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
