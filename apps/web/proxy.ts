import { NextResponse, type NextRequest } from "next/server";
import { verifySessionValue } from "@/lib/auth-shared";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/og");

  if (isPublic) {
    return NextResponse.next();
  }

  const session = request.cookies.get("emulate-admin-session")?.value;
  if (!(await verifySessionValue(session))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
