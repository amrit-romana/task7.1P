import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get("admin_session");

  // If user tries to access /admin (except /admin/login) and is not authenticated
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!cookie || cookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // If user is already authenticated and visits /admin/login, redirect to /admin
  if (
    request.nextUrl.pathname.startsWith("/admin/login") &&
    cookie &&
    cookie.value === "authenticated"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
