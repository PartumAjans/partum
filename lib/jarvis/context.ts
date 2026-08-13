import "server-only";
import { listClients } from "../users";
import { getReport } from "../meta";
import { lastNDays } from "../dates";
import type { ClientHealth } from "./types";

// ----------------------------------------------------------------------------
// Ajans genel durumunu toplayan yardımcılar.
// Komuta merkezi kartları ve Jarvis'in "müşterileri özetle" aracı burayı kullanır.
// ----------------------------------------------------------------------------

/** Son 7 günün ROAS'ına göre basit bir sağlık sinyali üretir. */
function signalFor(roas: number): ClientHealth["signal"] {
  if (roas >= 2) return "ok";
  if (roas >= 1) return "watch";
  return "risk";
}

function noteFor(signal: ClientHealth["signal"], roas: number): string {
  switch (signal) {
    case "ok":
      return `Sağlıklı — ROAS ${roas.toFixed(2)}x.`;
    case "watch":
      return `İzlemede — ROAS ${roas.toFixed(2)}x, hedefin altında.`;
    case "risk":
      return `Riskli — ROAS ${roas.toFixed(2)}x, aksiyon gerekebilir.`;
    default:
      return "Reklam hesabı henüz atanmadı.";
  }
}

/** Tüm müşteriler için son 7 günlük hızlı sağlık görünümü. */
export async function getClientHealth(): Promise<ClientHealth[]> {
  const clients = await listClients();
  const range = lastNDays(7);

  const out = await Promise.all(
    clients.map(async (c): Promise<ClientHealth> => {
      if (!c.adAccountId) {
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          signal: "unassigned",
          note: noteFor("unassigned", 0),
        };
      }
      try {
        const report = await getReport(c.adAccountId, range);
        const roas = report.totals.roas;
        const signal = signalFor(roas);
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          adAccountId: c.adAccountId,
          spend7d: report.totals.spend,
          roas7d: roas,
          currency: report.currency,
          signal,
          note: noteFor(signal, roas),
        };
      } catch {
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          adAccountId: c.adAccountId,
          signal: "watch",
          note: "Rapor verisi şu an alınamadı.",
        };
      }
    }),
  );

  // Riskliler en üstte
  const rank: Record<ClientHealth["signal"], number> = {
    risk: 0,
    watch: 1,
    unassigned: 2,
    ok: 3,
  };
  return out.sort((a, b) => rank[a.signal] - rank[b.signal]);
}
