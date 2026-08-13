// Jarvis asistanı için ortak tipler

export type TaskPriority = "low" | "normal" | "high";
export type TaskStatus = "open" | "done";

export interface JarvisTask {
  id: string;
  title: string;
  note?: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** İlgili müşteri/hesap (opsiyonel) */
  client?: string;
  /** YYYY-MM-DD (opsiyonel) */
  due?: string;
  createdAt: string; // ISO
  createdBy: string; // user id
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Sohbet cevabıyla birlikte, asistanın kullandığı araçların özeti (UI'da rozet olarak gösterilir). */
export interface AssistantReply {
  content: string;
  /** Bu turda çağrılan araçların adları (şeffaflık için). */
  toolsUsed: string[];
  /** Canlı AI mi yoksa yedek (kural tabanlı) mod mu kullanıldı. */
  live: boolean;
}

/** Bir müşterinin hızlı sağlık görünümü (komuta merkezi kartları için). */
export interface ClientHealth {
  id: string;
  name: string;
  email: string;
  adAccountId?: string;
  /** Son 7 gün */
  spend7d?: number;
  roas7d?: number;
  currency?: string;
  /** Basit durum sinyali */
  signal: "ok" | "watch" | "risk" | "unassigned";
  note: string;
}
