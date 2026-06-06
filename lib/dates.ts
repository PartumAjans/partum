import type { DateRange } from "./types";

export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Bugünden geriye doğru N günlük aralık (bugün dahil). */
export function lastNDays(n: number): DateRange {
  const until = new Date();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (n - 1));
  return { since: ymd(since), until: ymd(until) };
}

export const DATE_PRESETS: { label: string; days: number }[] = [
  { label: "Son 7 gün", days: 7 },
  { label: "Son 14 gün", days: 14 },
  { label: "Son 30 gün", days: 30 },
  { label: "Son 90 gün", days: 90 },
];

export function defaultRange(): DateRange {
  return lastNDays(30);
}

/** Aralığı doğrula; geçersizse varsayılana düş. */
export function sanitizeRange(since?: string, until?: string): DateRange {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (since && until && re.test(since) && re.test(until) && since <= until) {
    return { since, until };
  }
  return defaultRange();
}
