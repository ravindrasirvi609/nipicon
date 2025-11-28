import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/admin", "/dashboard"];

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check for authentication (you might want to use a more robust method)
  const isAuthenticated =
    request.cookies.get("auth_token")?.value === "your_secret_token";

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/dashboard"],
};
