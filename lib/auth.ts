import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ledger_session";
const SESSION_TTL = "30d";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (at least 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export function getLoginCredentials() {
  const email = process.env.AUTH_EMAIL?.trim().toLowerCase();
  const password = process.env.AUTH_PASSWORD;
  if (!email || !password) {
    throw new Error("AUTH_EMAIL and AUTH_PASSWORD must be set");
  }
  return { email, password };
}

export async function createSession() {
  const token = await new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticatedFromToken(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function requireSession() {
  const store = await cookies();
  const ok = await isAuthenticatedFromToken(store.get(SESSION_COOKIE)?.value);
  if (!ok) {
    throw new Error("Unauthorized");
  }
}

export function credentialsMatch(email: string, password: string) {
  const expected = getLoginCredentials();
  return (
    email.trim().toLowerCase() === expected.email &&
    password === expected.password
  );
}
