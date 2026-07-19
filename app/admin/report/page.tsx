import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReport } from "@/lib/meta";
import { sanitizeRange } from "@/lib/dates";
import TopBar from "@/components/TopBar";
import ReportView from "@/components/ReportView";

export const dynamic = "force-dynamic";

export default async function AdminReportPage({
  searchParams,
}: {
  searchParams: { account?: string; since?: string; until?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const account = searchParams.account;
  if (!account || !/^act_\d+$/.test(account)) redirect("/admin");

  const range = sanitizeRange(searchParams.since, searchParams.until);

  return (
    <div className="min-h-screen">
      <TopBar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link
          href="/admin"
          className="mb-4 inline-block text-sm text-brand-700 hover:underline"
        >
          ← Müşteri yönetimine dön
        </Link>
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Yönetici önizlemesi — müşterinin gördüğü rapor.
        </div>
        <ReportView report={await getReport(account, range)} range={range} />
      </main>
    </div>
  );
}
