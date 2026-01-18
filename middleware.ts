import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without token
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token, verify it and check role-based access
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;

      // Redirect authenticated users away from auth pages
      if (pathname === "/login" || pathname === "/signup") {
        switch (userRole) {
          case "SYSTEM_ADMIN":
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
          case "STORE_OWNER":
            return NextResponse.redirect(new URL("/store/dashboard", request.url));
          case "NORMAL_USER":
            return NextResponse.redirect(new URL("/user/stores", request.url));
        }
      }

      // Role-based route protection
      if (pathname.startsWith("/admin") && userRole !== "SYSTEM_ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (pathname.startsWith("/store") && userRole !== "STORE_OWNER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (pathname.startsWith("/user") && userRole !== "NORMAL_USER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}
