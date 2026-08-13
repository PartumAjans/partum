import "server-only";
import { listClients } from "../users";
import { getReport } from "../meta";
import { lastNDays } from "../dates";
import { formatCurrency } from "../format";
import { getClientHealth } from "./context";
import { createTask, listTasks, setTaskStatus } from "./tasks";
import type { TaskPriority } from "./types";

// ----------------------------------------------------------------------------
// Jarvis'in kullanabileceği araçlar (tools).
//
// Her araç iki parçadan oluşur:
//  1) `schema`  -> Claude'a verilen JSON tanımı (Anthropic tool formatı)
//  2) `run`     -> sunucuda çalışan gerçek uygulama
//
// Not: Mail/WhatsApp araçları şimdilik yalnızca TASLAK üretir (gerçek gönderim
// yok). Gerçek gönderim ilerideki fazda connector olarak eklenecektir.
// ----------------------------------------------------------------------------

export interface ToolContext {
  userId: string;
}

export interface ToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  run: (input: any, ctx: ToolContext) => Promise<string>;
}

// --- yardımcı: müşteriyi isim/hesaba göre çöz -------------------------------

async function resolveClient(query: string) {
  const clients = await listClients();
  const q = (query || "").trim().toLowerCase();
  if (!q) return null;
  return (
    clients.find((c) => c.adAccountId?.toLowerCase() === q) ||
    clients.find((c) => c.name.toLowerCase() === q) ||
    clients.find((c) => c.name.toLowerCase().includes(q)) ||
    clients.find((c) => c.email.toLowerCase().includes(q)) ||
    null
  );
}

// --- araçlar -----------------------------------------------------------------

const listClientHealthTool: ToolDef = {
  name: "list_client_health",
  description:
    "Tüm müşterilerin son 7 günlük hızlı sağlık görünümünü döndürür (harcama, ROAS ve risk/izle/ok sinyali). 'Müşteriler nasıl', 'kimlerde sorun var', 'genel durum' gibi sorularda kullan.",
  input_schema: { type: "object", properties: {} },
  run: async () => {
    const health = await getClientHealth();
    if (health.length === 0) return "Henüz kayıtlı müşteri yok.";
    return health
      .map((h) => {
        const spend =
          h.spend7d != null
            ? formatCurrency(h.spend7d, h.currency || "TRY")
            : "—";
        const roas = h.roas7d != null ? `${h.roas7d.toFixed(2)}x` : "—";
        return `- ${h.name} [${h.signal}] | 7g harcama: ${spend} | ROAS: ${roas} | ${h.note}`;
      })
      .join("\n");
  },
};

const getAdReportTool: ToolDef = {
  name: "get_ad_report",
  description:
    "Belirli bir müşterinin/reklam hesabının Meta reklam raporunu getirir (toplamlar + en çok harcayan kampanyalar). Müşteri adı ya da act_ ile başlayan hesap ID'si ver.",
  input_schema: {
    type: "object",
    properties: {
      client: {
        type: "string",
        description: "Müşteri adı veya reklam hesabı ID'si (act_...).",
      },
      days: {
        type: "number",
        description: "Kaç günlük dönem (varsayılan 30).",
      },
    },
    required: ["client"],
  },
  run: async (input) => {
    const days = Math.min(Math.max(Number(input.days) || 30, 1), 365);
    let accountId = "";
    let name = "";
    const client = await resolveClient(String(input.client || ""));
    if (client?.adAccountId) {
      accountId = client.adAccountId;
      name = client.name;
    } else if (/^act_\d+$/i.test(String(input.client || "").trim())) {
      accountId = String(input.client).trim();
      name = accountId;
    } else {
      return `"${input.client}" için eşleşen bir müşteri veya reklam hesabı bulunamadı.`;
    }

    const report = await getReport(accountId, lastNDays(days));
    const t = report.totals;
    const cur = report.currency;
    const top = report.campaigns
      .slice(0, 5)
      .map(
        (c, i) =>
          `  ${i + 1}. ${c.name} — ${formatCurrency(c.spend, cur)}, ROAS ${c.roas.toFixed(2)}x, ${c.conversions} dönüşüm`,
      )
      .join("\n");
    return [
      `${name} — son ${days} gün (${report.since} → ${report.until})`,
      `Harcama: ${formatCurrency(t.spend, cur)}`,
      `Gösterim: ${t.impressions.toLocaleString("tr-TR")} | Tıklama: ${t.clicks.toLocaleString("tr-TR")} | CTR: %${t.ctr}`,
      `Dönüşüm: ${t.conversions} | CPA: ${formatCurrency(t.cpa, cur)} | ROAS: ${t.roas.toFixed(2)}x`,
      top ? `En çok harcayan kampanyalar:\n${top}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

const listTasksTool: ToolDef = {
  name: "list_tasks",
  description:
    "Jarvis görev listesindeki güncel görevleri döndürür (id, başlık, öncelik, durum). Bir görevi tamamlamadan önce id öğrenmek için de kullan.",
  input_schema: { type: "object", properties: {} },
  run: async () => {
    const tasks = listTasks();
    if (tasks.length === 0) return "Görev listesi boş.";
    return tasks
      .map(
        (t) =>
          `- [${t.status === "done" ? "x" : " "}] (${t.priority}) ${t.title}${t.client ? ` — ${t.client}` : ""}${t.due ? ` (son: ${t.due})` : ""} #${t.id}`,
      )
      .join("\n");
  },
};

const createTaskTool: ToolDef = {
  name: "create_task",
  description:
    "Yapılacaklar listesine yeni bir görev ekler. Kullanıcı 'şunu not al', 'hatırlat', 'görev ekle' dediğinde kullan.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Görev başlığı." },
      priority: {
        type: "string",
        enum: ["low", "normal", "high"],
        description: "Öncelik (varsayılan normal).",
      },
      client: { type: "string", description: "İlgili müşteri (opsiyonel)." },
      due: {
        type: "string",
        description: "Son tarih, YYYY-MM-DD (opsiyonel).",
      },
      note: { type: "string", description: "Ek not (opsiyonel)." },
    },
    required: ["title"],
  },
  run: async (input, ctx) => {
    const priority = (["low", "normal", "high"] as TaskPriority[]).includes(
      input.priority,
    )
      ? (input.priority as TaskPriority)
      : "normal";
    const task = createTask({
      title: String(input.title || "").slice(0, 300),
      priority,
      client: input.client ? String(input.client) : undefined,
      due: /^\d{4}-\d{2}-\d{2}$/.test(input.due) ? input.due : undefined,
      note: input.note ? String(input.note) : undefined,
      createdBy: ctx.userId,
    });
    return `Görev eklendi: "${task.title}" (öncelik: ${task.priority}). #${task.id}`;
  },
};

const completeTaskTool: ToolDef = {
  name: "complete_task",
  description:
    "Bir görevi tamamlandı olarak işaretler. Görev id'sini list_tasks ile öğren.",
  input_schema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Görev id'si (#'siz)." },
    },
    required: ["id"],
  },
  run: async (input) => {
    const t = setTaskStatus(String(input.id || "").replace(/^#/, ""), "done");
    return t
      ? `Tamamlandı olarak işaretlendi: "${t.title}".`
      : "O id ile görev bulunamadı.";
  },
};

const draftMessageTool: ToolDef = {
  name: "draft_message",
  description:
    "Bir müşteriye/kişiye gönderilmek üzere WhatsApp veya e-posta TASLAĞI hazırlar (Türkçe). Gerçekten göndermez; kullanıcı kopyalayıp gönderir. Reklam raporu bağlamı gerekiyorsa önce get_ad_report çağır.",
  input_schema: {
    type: "object",
    properties: {
      channel: {
        type: "string",
        enum: ["whatsapp", "email"],
        description: "Kanal.",
      },
      to: { type: "string", description: "Alıcı adı/müşteri." },
      purpose: {
        type: "string",
        description: "Mesajın amacı/içeriği (ne anlatılacak).",
      },
      tone: {
        type: "string",
        description: "Ton: samimi/resmi/kısa (opsiyonel).",
      },
    },
    required: ["channel", "purpose"],
  },
  // Not: Bu araç yalnızca girdiyi Claude'a geri yansıtır; asıl metni model yazar.
  // API anahtarı yoksa (yedek mod) basit bir şablon döner.
  run: async (input) => {
    const to = input.to ? String(input.to) : "müşteri";
    const channel = input.channel === "email" ? "e-posta" : "WhatsApp";
    return `TASLAK isteği alındı (${channel} → ${to}). Amaç: ${input.purpose}. Ton: ${input.tone || "samimi"}. Lütfen bu taslağı yaz ve kullanıcıya sun; gerçekten gönderilmediğini belirt.`;
  },
};

export const TOOLS: ToolDef[] = [
  listClientHealthTool,
  getAdReportTool,
  listTasksTool,
  createTaskTool,
  completeTaskTool,
  draftMessageTool,
];

export function toolByName(name: string): ToolDef | undefined {
  return TOOLS.find((t) => t.name === name);
}

/** Anthropic API'ye gönderilecek araç şeması listesi. */
export function anthropicToolSchemas() {
  return TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }));
}
