// Panel genelinde kullanılan ortak tipler

export type Role = "admin" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Müşterinin görebileceği Meta reklam hesabı ID'si (örn: act_123456789). Admin için boş olabilir. */
  adAccountId?: string;
}

/** Tek bir günün özet metrikleri (trend grafiği için) */
export interface DailyMetric {
  date: string; // YYYY-MM-DD
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  conversions: number;
  conversionValue: number;
}

/** Kampanya bazlı kırılım satırı */
export interface CampaignRow {
  id: string;
  name: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // %
  cpc: number;
  conversions: number;
  cpa: number;
  roas: number;
}

/** Tüm dönem için toplanmış metrikler */
export interface Totals {
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  frequency: number;
  ctr: number; // %
  cpc: number;
  cpm: number;
  conversions: number;
  conversionValue: number;
  cpa: number;
  roas: number;
}

/** Panelin gösterdiği komple rapor */
export interface ReportData {
  adAccountId: string;
  accountName: string;
  currency: string;
  since: string;
  until: string;
  totals: Totals;
  daily: DailyMetric[];
  campaigns: CampaignRow[];
}

export interface DateRange {
  since: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
}
