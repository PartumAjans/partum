import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { config, jarvisLiveAI } from "@/lib/config";
import { getClientHealth } from "@/lib/jarvis/context";
import { listTasks } from "@/lib/jarvis/tasks";
import { formatCurrency } from "@/lib/format";
import TopBar from "@/components/TopBar";
import ChatPanel from "@/components/jarvis/ChatPanel";
import TaskBoard from "@/components/jarvis/TaskBoard";
import ClientHealthCards from "@/components/jarvis/ClientHealthCards";

export const dynamic = "force-dynamic";

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-slate-900">{value}</div>
      {hint && <div className="text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default async function JarvisPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const [clients, tasks] = await Promise.all([
    getClientHealth(),
    Promise.resolve(listTasks()),
  ]);

  // Ajans geneli özet
  const withData = clients.filter((c) => c.spend7d != null);
  const totalSpend = withData.reduce((s, c) => s + (c.spend7d || 0), 0);
  const avgRoas =
    withData.length > 0
      ? withData.reduce((s, c) => s + (c.roas7d || 0), 0) / withData.length
      : 0;
  const riskCount = clients.filter((c) => c.signal === "risk").length;
  const openTasks = tasks.filter((t) => t.status === "open").length;
  const currency = withData[0]?.currency || "TRY";
  const live = jarvisLiveAI();

  return (
    <div className="min-h-screen">
      <TopBar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* başlık */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Jarvis</h1>
            <p className="text-sm text-slate-500">
              Ajans komuta merkezin — tüm işleri tek yerden yönet.
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              live
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {live ? "● AI aktif" : "● Temel mod (AI anahtarı yok)"}
          </span>
        </div>

        {config.demoMode && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
            <strong>Demo modu.</strong> Veriler örnektir, görevler kalıcı
            kaydedilmez. Gerçek veri için{" "}
            <code className="rounded bg-amber-100 px-1">DEMO_MODE=false</code> +
            Supabase/Meta yapılandırın.
          </div>
        )}

        {/* özet şeridi */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="7 günlük harcama"
            value={formatCurrency(totalSpend, currency)}
            hint={`${withData.length} aktif hesap`}
          />
          <StatTile
            label="Ortalama ROAS"
            value={`${avgRoas.toFixed(2)}x`}
            hint="tüm müşteriler"
          />
          <StatTile
            label="Riskli müşteri"
            value={String(riskCount)}
            hint={riskCount ? "aksiyon gerekli" : "her şey yolunda"}
          />
          <StatTile
            label="Açık görev"
            value={String(openTasks)}
            hint="yapılacaklar"
          />
        </div>

        {/* ana yerleşim */}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-3">
            <ClientHealthCards clients={clients} />
            <TaskBoard tasks={tasks} />
          </div>
          <div className="lg:col-span-2">
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
