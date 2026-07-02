// Sayı/para/yüzde biçimlendirme yardımcıları (Türkçe yerel)

const nf = new Intl.NumberFormat("tr-TR");
const nf2 = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(n: number): string {
  return nf.format(Math.round(n));
}

export function formatDecimal(n: number): string {
  return nf2.format(n);
}

export function formatCurrency(n: number, currency = "TRY"): string {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${nf2.format(n)} ${currency}`;
  }
}

export function formatPercent(n: number): string {
  return `%${nf2.format(n)}`;
}

export function formatDateLabel(ymd: string): string {
  const d = new Date(ymd + "T00:00:00Z");
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}
