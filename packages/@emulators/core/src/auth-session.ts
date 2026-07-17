import { createHmac, timingSafeEqual } from "crypto";
import { parseCookies } from "./oauth-helpers.js";

const SESSION_COOKIE = "emulate-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ADMIN_USERNAME = "admin";

function sessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "emulate-dev-secret";
}

function useSecureCookies(): boolean {
  const explicit = process.env.AUTH_COOKIE_SECURE;
  if (explicit === "true") return true;
  if (explicit === "false") return false;

  const publicHost = (process.env.PUBLIC_HOST ?? "").toLowerCase();
  if (!publicHost || publicHost === "localhost" || publicHost === "127.0.0.1") {
    return false;
  }

  return true;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function buildSessionCookie(value: string, maxAgeSeconds = SESSION_TTL_SECONDS): string {
  const secure = useSecureCookies() ? "; Secure" : "";
  const httpOnly = "; HttpOnly";
  const sameSite = "; SameSite=Lax";
  const path = "; Path=/";
  const maxAge = `; Max-Age=${maxAgeSeconds}`;
  return `${SESSION_COOKIE}=${value}${path}${maxAge}${httpOnly}${sameSite}${secure}`;
}

export function clearSessionCookie(): string {
  return buildSessionCookie("", 0);
}

export function createSession(username: string, password: string): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (username !== ADMIN_USERNAME || !adminPassword || password !== adminPassword) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${username}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionCookie(cookieHeader?: string | null): boolean {
  if (!cookieHeader) return false;
  const cookies = parseCookies(cookieHeader);
  const value = cookies[SESSION_COOKIE];
  if (!value) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [username, issuedAtRaw, sig] = parts;
  if (username !== ADMIN_USERNAME) return false;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  if (Math.floor(Date.now() / 1000) - issuedAt > SESSION_TTL_SECONDS) return false;

  const expected = sign(`${username}.${issuedAtRaw}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
