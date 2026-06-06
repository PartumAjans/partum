import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { config, SESSION_COOKIE } from "./config";
import { DEMO_USERS, findDemoUserByEmail, findDemoUserById } from "./demo-users";
import type { User } from "./types";

// ----------------------------------------------------------------------------
// Basit, imzalı çerez tabanlı oturum yönetimi.
// Demo modunda kullanıcılar lib/demo-users.ts'ten gelir.
// Üretim (Supabase) entegrasyonu için lib/auth-supabase.ts içine bakın.
// ----------------------------------------------------------------------------

function sign(value: string): string {
  return crypto
    .createHmac("sha256", config.authSecret)
    .update(value)
    .digest("base64url");
}

function createToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, t: Date.now() }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.uid === "string" ? data.uid : null;
  } catch {
    return null;
  }
}

/** E-posta + parola doğrular, başarılıysa kullanıcıyı döndürür. */
export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  if (config.demoMode) {
    const u = findDemoUserByEmail(email);
    if (u && u.password === password) {
      const { password: _omit, ...safe } = u;
      return safe;
    }
    return null;
  }
  // Üretim: Supabase ile doğrulama
  const { authenticateSupabase } = await import("./auth-supabase");
  return authenticateSupabase(email, password);
}

/** Oturum çerezini ayarlar. */
export function setSessionCookie(userId: string) {
  cookies().set(SESSION_COOKIE, createToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

/** Geçerli oturumdaki kullanıcıyı döndürür (yoksa null). */
export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const uid = verifyToken(token);
  if (!uid) return null;

  if (config.demoMode) {
    const u = findDemoUserById(uid);
    if (!u) return null;
    const { password: _omit, ...safe } = u;
    return safe;
  }
  const { getSupabaseUserById } = await import("./auth-supabase");
  return getSupabaseUserById(uid);
}

export { DEMO_USERS };
