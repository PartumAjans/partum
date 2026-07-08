"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DATE_PRESETS, lastNDays } from "@/lib/dates";
import type { DateRange } from "@/lib/types";

export default function DateRangePicker({ range }: { range: DateRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [since, setSince] = useState(range.since);
  const [until, setUntil] = useState(range.until);

  function apply(r: DateRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("since", r.since);
    params.set("until", r.until);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="card flex flex-wrap items-center gap-2 p-3">
      <div className="flex flex-wrap gap-1">
        {DATE_PRESETS.map((p) => (
          <button
            key={p.days}
            onClick={() => apply(lastNDays(p.days))}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <input
          type="date"
          value={since}
          max={until}
          onChange={(e) => setSince(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
        />
        <span className="text-slate-400">—</span>
        <input
          type="date"
          value={until}
          min={since}
          onChange={(e) => setUntil(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
        />
        <button
          onClick={() => apply({ since, until })}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Uygula
        </button>
      </div>
    </div>
  );
}
