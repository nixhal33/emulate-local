const SESSION_COOKIE = "emulate-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ADMIN_USERNAME = "admin";

function getSecret() {
  return process.env.AUTH_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "emulate-dev-secret";
}

function encode(value: string) {
  return new TextEncoder().encode(value);
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function verifySessionValue(value?: string | null) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [username, issuedAtRaw, sig] = parts;
  if (username !== ADMIN_USERNAME) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  if (Math.floor(Date.now() / 1000) - issuedAt > SESSION_TTL_SECONDS) return false;

  const payload = `${username}.${issuedAtRaw}`;
  const expected = await hmac(payload);
  return expected === sig;
}

export async function createAuthSession(username: string, password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (username !== ADMIN_USERNAME || !adminPassword || password !== adminPassword) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${username}.${issuedAt}`;
  const signature = await hmac(payload);

  return {
    name: SESSION_COOKIE,
    value: `${payload}.${signature}`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    },
  };
}

export function clearAuthSession() {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  };
}
