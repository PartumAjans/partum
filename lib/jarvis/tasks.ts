import "server-only";
import crypto from "node:crypto";
import type { JarvisTask, TaskPriority } from "./types";

// ----------------------------------------------------------------------------
// Jarvis görev deposu.
//
// Bu ilk sürüm bellek-içi (in-memory) bir depodur: tek sunucu örneğinde ve
// geliştirme sırasında çalışır, sunucu yeniden başlayınca sıfırlanır.
// Kalıcı depolama için supabase/schema.sql içindeki `jarvis_tasks` tablosu
// hazırdır; DEMO_MODE=false ve Supabase yapılandırıldığında buraya
// Supabase implementasyonu eklenebilir (aşağıdaki TODO).
// ----------------------------------------------------------------------------

interface Store {
  tasks: Map<string, JarvisTask>;
}

// HMR/istekler arası kaybolmaması için global nesneye tuttur.
const g = globalThis as unknown as { __jarvisStore?: Store };
const store: Store = (g.__jarvisStore ??= { tasks: new Map() });

// Boş depoyu ilk açılışta biraz örnekle doldur (demo hissi için).
function seedIfEmpty() {
  if (store.tasks.size > 0) return;
  const now = new Date().toISOString();
  const samples: Omit<JarvisTask, "id" | "createdAt" | "createdBy">[] = [
    {
      title: "Örnek Mağaza — haftalık ROAS raporunu gözden geçir",
      priority: "high",
      status: "open",
      client: "Örnek Mağaza A.Ş.",
      note: "ROAS düşerse kampanya bütçesini yeniden dengele.",
    },
    {
      title: "Köşe Kafe — hafta sonu promosyon görselini onaya gönder",
      priority: "normal",
      status: "open",
      client: "Köşe Kafe",
    },
    {
      title: "Yeni müşteri teklifini hazırla",
      priority: "normal",
      status: "open",
    },
  ];
  for (const s of samples) {
    const id = crypto.randomUUID();
    store.tasks.set(id, { ...s, id, createdAt: now, createdBy: "seed" });
  }
}

export function listTasks(): JarvisTask[] {
  seedIfEmpty();
  return [...store.tasks.values()].sort((a, b) => {
    // Açık görevler önce, sonra öncelik, sonra oluşturulma
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    const rank: Record<TaskPriority, number> = { high: 0, normal: 1, low: 2 };
    if (rank[a.priority] !== rank[b.priority])
      return rank[a.priority] - rank[b.priority];
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export function createTask(input: {
  title: string;
  note?: string;
  priority?: TaskPriority;
  client?: string;
  due?: string;
  createdBy: string;
}): JarvisTask {
  seedIfEmpty();
  const task: JarvisTask = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    note: input.note?.trim() || undefined,
    priority: input.priority ?? "normal",
    status: "open",
    client: input.client?.trim() || undefined,
    due: input.due,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };
  store.tasks.set(task.id, task);
  return task;
}

export function setTaskStatus(
  id: string,
  status: JarvisTask["status"],
): JarvisTask | null {
  const t = store.tasks.get(id);
  if (!t) return null;
  t.status = status;
  store.tasks.set(id, t);
  return t;
}

export function deleteTask(id: string): boolean {
  return store.tasks.delete(id);
}

// TODO(kalıcılık): DEMO_MODE=false + Supabase yapılandırıldığında bu fonksiyonları
// `jarvis_tasks` tablosuna bağla (INSERT/SELECT/UPDATE). Arayüz aynı kalır.
