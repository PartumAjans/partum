"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyMetric } from "@/lib/types";
import { formatDateLabel, formatNumber } from "@/lib/format";

type MetricKey = "spend" | "impressions" | "clicks" | "conversions";

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: "spend", label: "Harcama", color: "#1f43f5" },
  { key: "impressions", label: "Gösterim", color: "#0ea5e9" },
  { key: "clicks", label: "Tıklama", color: "#10b981" },
  { key: "conversions", label: "Dönüşüm", color: "#f59e0b" },
];

export default function TrendChart({ daily }: { daily: DailyMetric[] }) {
  const [active, setActive] = useState<MetricKey>("spend");
  const metric = METRICS.find((m) => m.key === active)!;

  const data = daily.map((d) => ({
    date: formatDateLabel(d.date),
    value: d[active],
  }));

  return (
    <div className="card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Zaman İçinde Performans</h2>
        <div className="flex flex-wrap gap-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                active === m.key
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip
              formatter={(v: number) => [formatNumber(v), metric.label]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              strokeWidth={2}
              fill="url(#grad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
