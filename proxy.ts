import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "videotube_admin";
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/upload") ||
    (pathname.startsWith("/api/videos") && request.method !== "GET");

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectOrReject(request, isAdminPage);
  }

  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch {
    return redirectOrReject(request, isAdminPage);
  }
}

function redirectOrReject(request: NextRequest, isAdminPage: boolean) {
  if (isAdminPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/videos/:path*"],
};