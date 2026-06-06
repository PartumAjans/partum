import "server-only";
import { config } from "./config";
import type { Role, User } from "./types";

// ----------------------------------------------------------------------------
// Üretim kimlik doğrulama (Supabase). Ekstra bağımlılık gerektirmemesi için
// Supabase'in REST uçlarına (GoTrue + PostgREST) doğrudan fetch ile bağlanır.
// Şema için supabase/schema.sql dosyasına bakın.
// ----------------------------------------------------------------------------

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  ad_account_id: string | null;
}

function restHeaders() {
  return {
    apikey: config.supabase.serviceRoleKey,
    Authorization: `Bearer ${config.supabase.serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const url = `${config.supabase.url}/rest/v1/profiles?id=eq.${userId}&select=id,email,full_name,role,ad_account_id`;
  const res = await fetch(url, { headers: restHeaders(), cache: "no-store" });
  if (!res.ok) return null;
  const rows = (await res.json()) as ProfileRow[];
  return rows[0] ?? null;
}

function toUser(p: ProfileRow): User {
  return {
    id: p.id,
    email: p.email,
    name: p.full_name || p.email,
    role: p.role,
    adAccountId: p.ad_account_id || undefined,
  };
}

export async function authenticateSupabase(
  email: string,
  password: string,
): Promise<User | null> {
  const res = await fetch(
    `${config.supabase.url}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: config.supabase.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { user?: { id: string } };
  if (!data.user?.id) return null;
  const profile = await fetchProfile(data.user.id);
  return profile ? toUser(profile) : null;
}

export async function getSupabaseUserById(userId: string): Promise<User | null> {
  const profile = await fetchProfile(userId);
  return profile ? toUser(profile) : null;
}

/** Admin: tüm kullanıcıları listele (yönetim paneli için). */
export async function listSupabaseUsers(): Promise<User[]> {
  const url = `${config.supabase.url}/rest/v1/profiles?select=id,email,full_name,role,ad_account_id&order=full_name`;
  const res = await fetch(url, { headers: restHeaders(), cache: "no-store" });
  if (!res.ok) return [];
  const rows = (await res.json()) as ProfileRow[];
  return rows.map(toUser);
}

/** Admin: bir müşteriyi reklam hesabına eşle. */
export async function assignAdAccount(
  userId: string,
  adAccountId: string,
): Promise<boolean> {
  const url = `${config.supabase.url}/rest/v1/profiles?id=eq.${userId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { ...restHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ ad_account_id: adAccountId }),
    cache: "no-store",
  });
  return res.ok;
}
