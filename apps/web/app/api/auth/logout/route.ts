import { NextResponse } from "next/server";
import { clearAuthSession } from "@/lib/auth-shared";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  const session = clearAuthSession();
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
