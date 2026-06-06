import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReport } from "@/lib/meta";
import { sanitizeRange } from "@/lib/dates";
import TopBar from "@/components/TopBar";
import ReportView from "@/components/ReportView";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { since?: string; until?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  const range = sanitizeRange(searchParams.since, searchParams.until);

  return (
    <div className="min-h-screen">
      <TopBar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {user.adAccountId ? (
          <ReportView
            report={await getReport(user.adAccountId, range)}
            range={range}
          />
        ) : (
          <div className="card mx-auto mt-10 max-w-md p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Reklam hesabı henüz tanımlanmadı
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Hesabınız ajansımız tarafından eşleştirildiğinde raporlarınız
              burada görünecek. Lütfen bizimle iletişime geçin.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
