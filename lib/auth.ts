import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "videotube_admin";
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// Checks a plain-text password attempt against the stored hash
export async function verifyPassword(passwordAttempt: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new Error("ADMIN_PASSWORD_HASH is missing. Check your .env.local file.");
  }
  return bcrypt.compare(passwordAttempt, hash);
}

// Creates a signed token proving "this browser is the admin", valid for 7 days
async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

// Logs the admin in: creates the token and stores it as a secure cookie
export async function createSession(): Promise<void> {
  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,                    // JavaScript in the browser can't read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,          // 7 days, in seconds
  });
}

// Logs the admin out: removes the cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Checks whether the current request has a valid admin cookie
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    // Token is missing, expired, or was tampered with
    return false;
  }
}