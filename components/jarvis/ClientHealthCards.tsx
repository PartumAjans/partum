import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { ClientHealth } from "@/lib/jarvis/types";

const SIGNAL: Record<
  ClientHealth["signal"],
  { dot: string; label: string; chip: string }
> = {
  ok: { dot: "bg-emerald-500", label: "Sağlıklı", chip: "bg-emerald-50 text-emerald-700" },
  watch: { dot: "bg-amber-500", label: "İzlemede", chip: "bg-amber-50 text-amber-700" },
  risk: { dot: "bg-red-500", label: "Riskli", chip: "bg-red-50 text-red-700" },
  unassigned: { dot: "bg-slate-300", label: "Atanmadı", chip: "bg-slate-100 text-slate-500" },
};

export default function ClientHealthCards({
  clients,
}: {
  clients: ClientHealth[];
}) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Müşteri Durumu
        </h2>
        <span className="text-xs text-slate-400">son 7 gün</span>
      </div>

      {clients.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">
          Henüz müşteri yok.
        </p>
      ) : (
        <ul className="space-y-2">
          {clients.map((c) => {
            const s = SIGNAL[c.signal];
            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {c.name}
                  </div>
                  <div className="truncate text-xs text-slate-400">{c.note}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-xs text-slate-500">
                    {c.spend7d != null
                      ? formatCurrency(c.spend7d, c.currency || "TRY")
                      : "—"}
                  </div>
                  <div className="text-xs text-slate-400">
                    ROAS {c.roas7d != null ? `${c.roas7d.toFixed(2)}x` : "—"}
                  </div>
                </div>
                {c.adAccountId && (
                  <Link
                    href={`/admin/report?account=${c.adAccountId}`}
                    className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-brand-700 transition hover:bg-brand-50"
                  >
                    Rapor
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
