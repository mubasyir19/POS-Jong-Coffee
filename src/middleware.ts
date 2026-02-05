import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Halaman yang hanya boleh diakses jika sudah login
  const protectedRoutes = [
    "/dashboard",
    "/home",
    "/discount",
    "/messages",
    "/notifications",
    "/settings",
  ];

  // Jika halaman termasuk protected dan tidak ada token → redirect ke login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login dan mencoba ke /login → redirect ke /home
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/home/:path*",
    "/discount/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/login",
  ],
};
