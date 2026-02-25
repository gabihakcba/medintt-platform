import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasRefresh = request.cookies.has("Refresh");
  const hasAuth = request.cookies.has("Authentication");

  // Si no hay ninguna de las dos cookies de sesión válidas.
  if (!hasRefresh && !hasAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
