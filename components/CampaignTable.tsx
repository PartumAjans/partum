import type { CampaignRow } from "@/lib/types";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
  formatPercent,
} from "@/lib/format";

export default function CampaignTable({
  campaigns,
  currency,
}: {
  campaigns: CampaignRow[];
  currency: string;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-900">Kampanya Kırılımı</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-medium">Kampanya</th>
              <th className="px-4 py-2.5 text-right font-medium">Harcama</th>
              <th className="px-4 py-2.5 text-right font-medium">Gösterim</th>
              <th className="px-4 py-2.5 text-right font-medium">Tıklama</th>
              <th className="px-4 py-2.5 text-right font-medium">CTR</th>
              <th className="px-4 py-2.5 text-right font-medium">CPC</th>
              <th className="px-4 py-2.5 text-right font-medium">Dönüşüm</th>
              <th className="px-4 py-2.5 text-right font-medium">CPA</th>
              <th className="px-4 py-2.5 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        c.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title={c.status}
                    />
                    <span className="font-medium text-slate-800">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(c.spend, currency)}
                </td>
                <td className="px-4 py-3 text-right">{formatNumber(c.impressions)}</td>
                <td className="px-4 py-3 text-right">{formatNumber(c.clicks)}</td>
                <td className="px-4 py-3 text-right">{formatPercent(c.ctr)}</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(c.cpc, currency)}
                </td>
                <td className="px-4 py-3 text-right">{formatNumber(c.conversions)}</td>
                <td className="px-4 py-3 text-right">
                  {c.cpa ? formatCurrency(c.cpa, currency) : "—"}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {c.roas ? `${formatDecimal(c.roas)}x` : "—"}
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                  Bu tarih aralığında kampanya verisi bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
