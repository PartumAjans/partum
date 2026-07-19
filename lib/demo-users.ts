import type { User } from "./types";

// DEMO MODU kullanıcıları.
// Üretimde (DEMO_MODE=false) bunlar yerine Supabase'deki gerçek kullanıcılar kullanılır.
// Parolalar burada düz metin yalnızca demo amaçlıdır.
export interface DemoUser extends User {
  password: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-admin",
    email: "admin@partum.com",
    password: "admin123",
    name: "Partum Ajans (Yönetici)",
    role: "admin",
  },
  {
    id: "u-client-1",
    email: "musteri@ornek.com",
    password: "musteri123",
    name: "Örnek Mağaza A.Ş.",
    role: "client",
    adAccountId: "act_1000000001",
  },
  {
    id: "u-client-2",
    email: "kafe@ornek.com",
    password: "kafe123",
    name: "Köşe Kafe",
    role: "client",
    adAccountId: "act_1000000002",
  },
];

export function findDemoUserByEmail(email: string): DemoUser | undefined {
  return DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function findDemoUserById(id: string): DemoUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}
