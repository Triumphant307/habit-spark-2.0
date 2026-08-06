import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware for route protection.
 *
 * This runs on the edge before the page renders. It can only check for
 * cookie existence (not JWT validity, since the JWT secret isn't available
 * on the edge). Full token validation happens client-side via checkAuthAction.
 *
 * Rules:
 * - Protected routes: Redirect to /login if no refreshToken cookie
 * - Auth routes: Redirect to /dashboard if refreshToken cookie exists
 */

const PROTECTED_ROUTES = ["/dashboard", "/tracker", "/habit", "/completed", "/suggestion"];
const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refreshToken");

  // Check if the current path matches a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if the current path is an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination for post-login redirect
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher config: Only run middleware on specific routes.
 * Excludes API routes, static files, and Next.js internals.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tracker/:path*",
    "/habit/:path*",
    "/completed/:path*",
    "/suggestion/:path*",
    "/login",
    "/signup",
  ],
};
