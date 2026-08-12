import "server-only";
import { config, jarvisLiveAI } from "../config";
import type { AssistantReply, ChatMessage } from "./types";
import {
  TOOLS,
  toolByName,
  anthropicToolSchemas,
  type ToolContext,
} from "./tools";

// ----------------------------------------------------------------------------
// Jarvis asistanı.
// ANTHROPIC_API_KEY tanımlıysa Claude ile (araç kullanımı dahil) çalışır.
// Anahtar yoksa, temel işleri hâlâ yapan kural tabanlı bir yedek moda düşer.
// ----------------------------------------------------------------------------

const MAX_TOOL_ROUNDS = 6;

function systemPrompt(userName: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const toolList = TOOLS.map((t) => `- ${t.name}: ${t.description}`).join("\n");
  return [
    `Sen "Jarvis"sin — Partum Ajans'ın (dijital reklam ajansı) kişisel iş asistanısın.`,
    `Kullanıcı: ${userName}. Bugünün tarihi: ${today}.`,
    `Amacın: ajans işlerini tek yerden toparlamak — müşteri/reklam durumlarını özetlemek, görevleri yönetmek, mesaj taslakları hazırlamak, sorulara net cevap vermek.`,
    ``,
    `Dil: Her zaman Türkçe, kısa ve net konuş. Gereksiz uzatma; madde işaretleri kullan.`,
    `Sayısal iddialar için tahmin yürütme — ilgili aracı çağır ve gerçek veriyle konuş.`,
    `Görev/rapor/müşteri durumu istendiğinde uygun aracı KULLAN, uydurma.`,
    `Mesaj taslağı (WhatsApp/e-posta) hazırlarken: doğrudan gönderilebilecek, kişiselleştirilmiş, akıcı Türkçe metin yaz. Sonunda "Bu bir taslaktır, gönderilmedi." notunu ekle.`,
    `Emin olmadığında varsayım yapıp ilerlemek yerine kısa bir netleştirme sorusu sor.`,
    ``,
    `Kullanabileceğin araçlar:`,
    toolList,
  ].join("\n");
}

// --------------------------- Anthropic (canlı) ------------------------------

interface AnthropicContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: unknown;
}

async function callAnthropic(body: unknown): Promise<any> {
  const res = await fetch(`${config.anthropic.baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.anthropic.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

async function runLive(
  history: ChatMessage[],
  ctx: ToolContext,
  userName: string,
): Promise<AssistantReply> {
  // Anthropic mesaj biçimine çevir
  const messages: any[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const toolsUsed: string[] = [];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const data = await callAnthropic({
      model: config.anthropic.model,
      max_tokens: 1500,
      system: systemPrompt(userName),
      tools: anthropicToolSchemas(),
      messages,
    });

    const blocks: AnthropicContentBlock[] = data.content || [];
    const toolUses = blocks.filter((b) => b.type === "tool_use");

    // Asistan turunu geçmişe ekle (metin + tool_use blokları)
    messages.push({ role: "assistant", content: blocks });

    if (data.stop_reason !== "tool_use" || toolUses.length === 0) {
      const text = blocks
        .filter((b) => b.type === "text" && b.text)
        .map((b) => b.text)
        .join("\n")
        .trim();
      return {
        content: text || "(boş yanıt)",
        toolsUsed,
        live: true,
      };
    }

    // Araçları çalıştır ve sonuçları geri gönder
    const toolResults = [];
    for (const tu of toolUses) {
      toolsUsed.push(tu.name || "?");
      const tool = toolByName(tu.name || "");
      let resultText: string;
      try {
        resultText = tool
          ? await tool.run(tu.input || {}, ctx)
          : `Bilinmeyen araç: ${tu.name}`;
      } catch (e) {
        resultText = `Araç hatası: ${(e as Error).message}`;
      }
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: resultText,
      });
    }
    messages.push({ role: "user", content: toolResults });
  }

  return {
    content:
      "İşlemi tamamlayamadım (çok fazla araç adımı). Lütfen isteğini biraz sadeleştir.",
    toolsUsed,
    live: true,
  };
}

// --------------------------- Yedek (kural tabanlı) --------------------------

async function runFallback(
  history: ChatMessage[],
  ctx: ToolContext,
): Promise<AssistantReply> {
  const last = [...history].reverse().find((m) => m.role === "user");
  const text = (last?.content || "").toLowerCase();
  const toolsUsed: string[] = [];

  const call = async (name: string, input: any = {}) => {
    toolsUsed.push(name);
    const tool = toolByName(name)!;
    return tool.run(input, ctx);
  };

  // Basit niyet yönlendirme
  if (/(müşteri|musteri).*(durum|nas[iı]l|özet|ozet)|genel durum|kim.*sorun|risk/.test(text)) {
    const out = await call("list_client_health");
    return {
      content: `Müşteri durum özeti (son 7 gün):\n${out}`,
      toolsUsed,
      live: false,
    };
  }

  if (/(rapor|roas|harcama|performans)/.test(text)) {
    // İsim yakala (çok basit): "X raporu" veya "X in raporu"
    const m = text.match(/([a-zçğıöşü0-9_ ]+?)\s*(raporu?|roas|performans|harcama)/);
    const client = m?.[1]?.trim();
    if (client && client.length > 1) {
      const out = await call("get_ad_report", { client, days: 30 });
      return { content: out, toolsUsed, live: false };
    }
    const out = await call("list_client_health");
    return {
      content: `Hangi müşterinin raporunu istediğini yazabilirsin. Genel durum:\n${out}`,
      toolsUsed,
      live: false,
    };
  }

  if (/(görev|gorev|yap[iı]lacak|not al|hat[iı]rlat|ekle)/.test(text)) {
    if (/(listele|göster|neler|nedir|ne var)/.test(text)) {
      const out = await call("list_tasks");
      return { content: `Görev listesi:\n${out}`, toolsUsed, live: false };
    }
    // Görev ekle: "... ekle/not al" ifadesinden başlığı çıkar
    const title = (last?.content || "")
      .replace(/(görev|gorev)\s*(olarak)?\s*(ekle|oluştur|olustur)/gi, "")
      .replace(/(not al|hat[iı]rlat)/gi, "")
      .trim();
    if (title.length > 2) {
      const out = await call("create_task", { title });
      return { content: out, toolsUsed, live: false };
    }
  }

  if (/(görevler|gorevler|yap[iı]lacaklar|liste)/.test(text)) {
    const out = await call("list_tasks");
    return { content: `Görev listesi:\n${out}`, toolsUsed, live: false };
  }

  // Varsayılan yardım metni
  const health = await call("list_client_health");
  return {
    content: [
      "Merhaba! Ben Jarvis. (AI anahtarı tanımlı değil — şimdilik temel modda çalışıyorum.)",
      "",
      "Şunları deneyebilirsin:",
      "• “müşteri durumu” — genel özet",
      "• “Örnek Mağaza raporu” — bir müşterinin reklam raporu",
      "• “görevleri listele” / “... görev ekle”",
      "",
      "Tam yeteneğe (serbest sohbet, mesaj taslakları, akıllı analiz) geçmek için sunucuya ANTHROPIC_API_KEY tanımlanmalı.",
      "",
      "Şu anki müşteri durumu (son 7 gün):",
      health,
    ].join("\n"),
    toolsUsed,
    live: false,
  };
}

// --------------------------------- dışa açık --------------------------------

export async function runJarvis(
  history: ChatMessage[],
  ctx: ToolContext & { userName?: string },
): Promise<AssistantReply> {
  if (jarvisLiveAI()) {
    try {
      return await runLive(history, ctx, ctx.userName || "Kullanıcı");
    } catch (e) {
      // Canlı mod hata verirse kural tabanlı moda düş, ama bilgilendir.
      const fb = await runFallback(history, ctx);
      return {
        ...fb,
        content: `⚠️ AI servisine ulaşılamadı (${(e as Error).message}). Temel modla yanıtlıyorum.\n\n${fb.content}`,
      };
    }
  }
  return runFallback(history, ctx);
}
