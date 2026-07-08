import "server-only";
import { config } from "./config";
import type {
  CampaignRow,
  DailyMetric,
  DateRange,
  ReportData,
  Totals,
} from "./types";

// ----------------------------------------------------------------------------
// Meta Marketing API istemcisi.
// DEMO_MODE açıkken gerçekçi örnek veri üretir; kapalıyken Graph API'yi çağırır.
// ----------------------------------------------------------------------------

const CONVERSION_ACTION_TYPES = new Set([
  "purchase",
  "omni_purchase",
  "offsite_conversion.fb_pixel_purchase",
  "lead",
  "offsite_conversion.fb_pixel_lead",
  "complete_registration",
  "offsite_conversion.fb_pixel_complete_registration",
]);

const PURCHASE_VALUE_TYPES = new Set([
  "purchase",
  "omni_purchase",
  "offsite_conversion.fb_pixel_purchase",
]);

// --------------------------------- yardımcılar ------------------------------

function round(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function buildTotals(daily: DailyMetric[]): Totals {
  const sum = daily.reduce(
    (a, d) => ({
      spend: a.spend + d.spend,
      impressions: a.impressions + d.impressions,
      clicks: a.clicks + d.clicks,
      reach: a.reach + d.reach,
      conversions: a.conversions + d.conversions,
      conversionValue: a.conversionValue + d.conversionValue,
    }),
    { spend: 0, impressions: 0, clicks: 0, reach: 0, conversions: 0, conversionValue: 0 },
  );
  const impressions = sum.impressions || 0;
  const clicks = sum.clicks || 0;
  const reach = sum.reach || 0;
  return {
    spend: round(sum.spend),
    impressions,
    clicks,
    reach,
    frequency: reach ? round(impressions / reach) : 0,
    ctr: impressions ? round((clicks / impressions) * 100) : 0,
    cpc: clicks ? round(sum.spend / clicks) : 0,
    cpm: impressions ? round((sum.spend / impressions) * 1000) : 0,
    conversions: round(sum.conversions),
    conversionValue: round(sum.conversionValue),
    cpa: sum.conversions ? round(sum.spend / sum.conversions) : 0,
    roas: sum.spend ? round(sum.conversionValue / sum.spend) : 0,
  };
}

function eachDay(range: DateRange): string[] {
  const out: string[] = [];
  const start = new Date(range.since + "T00:00:00Z");
  const end = new Date(range.until + "T00:00:00Z");
  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// --------------------------------- DEMO veri --------------------------------

// Hesap ID'sine göre sabit (deterministik) basit rastgele üreteç.
function seededRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

const DEMO_ACCOUNTS: Record<string, { name: string; currency: string; campaigns: string[] }> = {
  act_1000000001: {
    name: "Örnek Mağaza A.Ş.",
    currency: "TRY",
    campaigns: ["Yaz Kampanyası - Satış", "Yeniden Pazarlama", "Marka Bilinirliği", "İndirim Günleri"],
  },
  act_1000000002: {
    name: "Köşe Kafe",
    currency: "TRY",
    campaigns: ["Yerel Erişim", "Brunch Menüsü", "Hafta Sonu Promosyon"],
  },
};

function demoReport(adAccountId: string, range: DateRange): ReportData {
  const meta = DEMO_ACCOUNTS[adAccountId] || {
    name: "Demo Reklam Hesabı",
    currency: "TRY",
    campaigns: ["Kampanya 1", "Kampanya 2", "Kampanya 3"],
  };
  const rng = seededRng(hashSeed(adAccountId));
  const days = eachDay(range);

  const daily: DailyMetric[] = days.map((date, i) => {
    const weekend = [0, 6].includes(new Date(date + "T00:00:00Z").getUTCDay());
    const base = 800 + rng() * 700 + (weekend ? 300 : 0);
    const spend = round(base);
    const impressions = Math.round(base * (40 + rng() * 25));
    const clicks = Math.round(impressions * (0.012 + rng() * 0.02));
    const reach = Math.round(impressions * (0.55 + rng() * 0.2));
    const conversions = Math.round(clicks * (0.03 + rng() * 0.05));
    const conversionValue = round(conversions * (150 + rng() * 250));
    return { date, spend, impressions, clicks, reach, conversions, conversionValue };
  });

  const totals = buildTotals(daily);

  // Toplamları kampanyalara dağıt
  const weights = meta.campaigns.map(() => 0.5 + rng());
  const wsum = weights.reduce((a, b) => a + b, 0);
  const campaigns: CampaignRow[] = meta.campaigns.map((name, i) => {
    const w = weights[i] / wsum;
    const spend = round(totals.spend * w);
    const impressions = Math.round(totals.impressions * w);
    const clicks = Math.round(totals.clicks * w);
    const conversions = Math.round(totals.conversions * w);
    const convValue = round(totals.conversionValue * w);
    return {
      id: `${adAccountId}-c${i + 1}`,
      name,
      status: rng() > 0.2 ? "ACTIVE" : "PAUSED",
      spend,
      impressions,
      clicks,
      ctr: impressions ? round((clicks / impressions) * 100) : 0,
      cpc: clicks ? round(spend / clicks) : 0,
      conversions,
      cpa: conversions ? round(spend / conversions) : 0,
      roas: spend ? round(convValue / spend) : 0,
    };
  });

  return {
    adAccountId,
    accountName: meta.name,
    currency: meta.currency,
    since: range.since,
    until: range.until,
    totals,
    daily,
    campaigns: campaigns.sort((a, b) => b.spend - a.spend),
  };
}

// --------------------------------- GERÇEK API -------------------------------

function graphUrl(path: string, params: Record<string, string>): string {
  const qs = new URLSearchParams({
    access_token: config.meta.accessToken,
    ...params,
  });
  return `https://graph.facebook.com/${config.meta.apiVersion}/${path}?${qs}`;
}

interface InsightAction {
  action_type: string;
  value: string;
}

function sumActions(actions: InsightAction[] | undefined, allowed: Set<string>): number {
  if (!actions) return 0;
  return actions
    .filter((a) => allowed.has(a.action_type))
    .reduce((a, b) => a + Number(b.value || 0), 0);
}

async function realReport(adAccountId: string, range: DateRange): Promise<ReportData> {
  const timeRange = JSON.stringify({ since: range.since, until: range.until });

  // 1) Hesap bilgisi
  const accRes = await fetch(
    graphUrl(adAccountId, { fields: "name,currency" }),
    { cache: "no-store" },
  );
  const acc = accRes.ok ? await accRes.json() : {};

  // 2) Günlük insights (account seviyesi)
  const dailyRes = await fetch(
    graphUrl(`${adAccountId}/insights`, {
      level: "account",
      time_increment: "1",
      time_range: timeRange,
      fields: "spend,impressions,clicks,reach,actions,action_values",
      limit: "500",
    }),
    { cache: "no-store" },
  );
  const dailyJson = dailyRes.ok ? await dailyRes.json() : { data: [] };
  const daily: DailyMetric[] = (dailyJson.data || []).map((r: any) => ({
    date: r.date_start,
    spend: Number(r.spend || 0),
    impressions: Number(r.impressions || 0),
    clicks: Number(r.clicks || 0),
    reach: Number(r.reach || 0),
    conversions: sumActions(r.actions, CONVERSION_ACTION_TYPES),
    conversionValue: sumActions(r.action_values, PURCHASE_VALUE_TYPES),
  }));

  // 3) Kampanya kırılımı
  const campRes = await fetch(
    graphUrl(`${adAccountId}/insights`, {
      level: "campaign",
      time_range: timeRange,
      fields:
        "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,action_values",
      limit: "500",
    }),
    { cache: "no-store" },
  );
  const campJson = campRes.ok ? await campRes.json() : { data: [] };
  const campaigns: CampaignRow[] = (campJson.data || []).map((r: any) => {
    const spend = Number(r.spend || 0);
    const conversions = sumActions(r.actions, CONVERSION_ACTION_TYPES);
    const convValue = sumActions(r.action_values, PURCHASE_VALUE_TYPES);
    return {
      id: r.campaign_id,
      name: r.campaign_name,
      status: "—",
      spend: round(spend),
      impressions: Number(r.impressions || 0),
      clicks: Number(r.clicks || 0),
      ctr: round(Number(r.ctr || 0)),
      cpc: round(Number(r.cpc || 0)),
      conversions: round(conversions),
      cpa: conversions ? round(spend / conversions) : 0,
      roas: spend ? round(convValue / spend) : 0,
    };
  });

  return {
    adAccountId,
    accountName: acc.name || adAccountId,
    currency: acc.currency || "TRY",
    since: range.since,
    until: range.until,
    totals: buildTotals(daily),
    daily,
    campaigns: campaigns.sort((a, b) => b.spend - a.spend),
  };
}

// --------------------------------- dışa açık --------------------------------

export async function getReport(
  adAccountId: string,
  range: DateRange,
): Promise<ReportData> {
  if (config.demoMode || !config.meta.accessToken) {
    return demoReport(adAccountId, range);
  }
  return realReport(adAccountId, range);
}
