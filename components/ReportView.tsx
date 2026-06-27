import type { DateRange, ReportData } from "@/lib/types";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import MetricCard from "./MetricCard";
import TrendChart from "./TrendChart";
import CampaignTable from "./CampaignTable";
import DateRangePicker from "./DateRangePicker";

export default function ReportView({
  report,
  range,
}: {
  report: ReportData;
  range: DateRange;
}) {
  const t = report.totals;
  const cur = report.currency;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {report.accountName}
          </h1>
          <p className="text-sm text-slate-500">
            {report.since} — {report.until} · Hesap: {report.adAccountId}
          </p>
        </div>
      </div>

      <DateRangePicker range={range} />

      {/* Temel performans */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Harcama" value={formatCurrency(t.spend, cur)} />
        <MetricCard label="Gösterim" value={formatNumber(t.impressions)} />
        <MetricCard label="Tıklama" value={formatNumber(t.clicks)} />
        <MetricCard label="Erişim" value={formatNumber(t.reach)} />
        <MetricCard label="CTR" value={formatPercent(t.ctr)} />
        <MetricCard label="CPC" value={formatCurrency(t.cpc, cur)} />
        <MetricCard label="CPM" value={formatCurrency(t.cpm, cur)} />
        <MetricCard label="Frekans" value={formatDecimal(t.frequency)} />
      </div>

      {/* Dönüşüm metrikleri */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Dönüşüm" value={formatNumber(t.conversions)} />
        <MetricCard
          label="Dönüşüm Değeri"
          value={formatCurrency(t.conversionValue, cur)}
        />
        <MetricCard
          label="CPA (Dönüşüm Başına Maliyet)"
          value={t.cpa ? formatCurrency(t.cpa, cur) : "—"}
        />
        <MetricCard
          label="ROAS"
          value={t.roas ? `${formatDecimal(t.roas)}x` : "—"}
          hint="Reklam harcaması getirisi"
        />
      </div>

      <TrendChart daily={report.daily} />

      <CampaignTable campaigns={report.campaigns} currency={cur} />
    </div>
  );
}
