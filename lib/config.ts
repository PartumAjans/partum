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
};

export const SESSION_COOKIE = "partum_session";
