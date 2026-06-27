import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listClients } from "@/lib/users";
import { config } from "@/lib/config";
import TopBar from "@/components/TopBar";
import AssignForm from "@/components/AssignForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const clients = await listClients();

  return (
    <div className="min-h-screen">
      <TopBar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900">Müşteri Yönetimi</h1>
          <p className="text-sm text-slate-500">
            Müşterileri Meta reklam hesaplarına eşleyin ve raporlarını
            önizleyin.
          </p>
        </div>

        {config.demoMode && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <strong>Demo modu açık.</strong> Eşleştirmeler kalıcı kaydedilmez ve
            veriler örnektir. Gerçek müşteriler ve Meta verisi için{" "}
            <code className="rounded bg-amber-100 px-1">DEMO_MODE=false</code>{" "}
            yapıp Supabase + Meta token tanımlayın.
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-medium">Müşteri</th>
                  <th className="px-4 py-2.5 font-medium">E-posta</th>
                  <th className="px-4 py-2.5 font-medium">Reklam Hesabı</th>
                  <th className="px-4 py-2.5 font-medium">Rapor</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3">
                      <AssignForm userId={c.id} current={c.adAccountId} />
                    </td>
                    <td className="px-4 py-3">
                      {c.adAccountId ? (
                        <Link
                          href={`/admin/report?account=${c.adAccountId}`}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-brand-700 transition hover:bg-brand-50"
                        >
                          Görüntüle
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Hesap atanmadı
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      Henüz müşteri yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
