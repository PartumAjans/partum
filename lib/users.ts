import "server-only";
import { config } from "./config";
import { DEMO_USERS } from "./demo-users";
import type { User } from "./types";

/** Tüm kullanıcıları listeler (yönetim paneli için). */
export async function listUsers(): Promise<User[]> {
  if (config.demoMode) {
    return DEMO_USERS.map(({ password: _p, ...u }) => u);
  }
  const { listSupabaseUsers } = await import("./auth-supabase");
  return listSupabaseUsers();
}

export async function listClients(): Promise<User[]> {
  return (await listUsers()).filter((u) => u.role === "client");
}

/** Bir müşteriyi reklam hesabına eşler. Demo modunda kalıcı değildir. */
export async function setAdAccount(
  userId: string,
  adAccountId: string,
): Promise<{ ok: boolean; demo?: boolean }> {
  if (config.demoMode) {
    return { ok: false, demo: true };
  }
  const { assignAdAccount } = await import("./auth-supabase");
  const ok = await assignAdAccount(userId, adAccountId);
  return { ok };
}
