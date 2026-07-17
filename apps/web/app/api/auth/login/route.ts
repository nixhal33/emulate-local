import { NextResponse } from "next/server";
import { createAuthSession } from "@/lib/auth-shared";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const session = await createAuthSession(username, password);

  if (!session) {
    return NextResponse.redirect(new URL("/login?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
