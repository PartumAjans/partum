// Ortam değişkenlerinin merkezi okunması

export const config = {
  demoMode: process.env.DEMO_MODE !== "false", // varsayılan: demo açık
  authSecret: process.env.AUTH_SECRET || "partum-gelistirme-anahtari-degistir",
  meta: {
    accessToken: process.env.META_ACCESS_TOKEN || "",
    apiVersion: process.env.META_API_VERSION || "v21.0",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
  // Jarvis asistanı (Anthropic Claude)
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    baseUrl: process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com",
  },
};

/** Jarvis'in canlı AI ile mi yoksa yalnızca kural tabanlı yedek modda mı çalıştığı. */
export function jarvisLiveAI(): boolean {
  return Boolean(config.anthropic.apiKey);
}

export const SESSION_COOKIE = "partum_session";
