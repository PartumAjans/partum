import {
  addTaskAction,
  toggleTaskAction,
  deleteTaskAction,
} from "@/app/actions/jarvis";
import type { JarvisTask } from "@/lib/jarvis/types";

const PRIORITY_STYLE: Record<JarvisTask["priority"], string> = {
  high: "bg-red-100 text-red-700",
  normal: "bg-slate-100 text-slate-600",
  low: "bg-slate-100 text-slate-400",
};

const PRIORITY_LABEL: Record<JarvisTask["priority"], string> = {
  high: "yüksek",
  normal: "normal",
  low: "düşük",
};

export default function TaskBoard({ tasks }: { tasks: JarvisTask[] }) {
  const open = tasks.filter((t) => t.status === "open");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Görevler</h2>
        <span className="text-xs text-slate-400">
          {open.length} açık · {done.length} bitti
        </span>
      </div>

      {/* ekleme formu */}
      <form action={addTaskAction} className="mb-3 flex gap-2">
        <input
          name="title"
          required
          placeholder="Yeni görev…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <select
          name="priority"
          defaultValue="normal"
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-600 outline-none focus:border-brand-500"
        >
          <option value="high">Yüksek</option>
          <option value="normal">Normal</option>
          <option value="low">Düşük</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Ekle
        </button>
      </form>

      {/* liste */}
      <ul className="space-y-1.5">
        {open.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2"
          >
            <form action={toggleTaskAction}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="next" value="done" />
              <button
                type="submit"
                title="Tamamla"
                className="h-4 w-4 rounded border border-slate-300 transition hover:border-brand-500 hover:bg-brand-50"
              />
            </form>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-slate-800">{t.title}</div>
              {(t.client || t.due) && (
                <div className="text-xs text-slate-400">
                  {t.client}
                  {t.client && t.due ? " · " : ""}
                  {t.due ? `son: ${t.due}` : ""}
                </div>
              )}
            </div>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_STYLE[t.priority]}`}
            >
              {PRIORITY_LABEL[t.priority]}
            </span>
            <form action={deleteTaskAction}>
              <input type="hidden" name="id" value={t.id} />
              <button
                type="submit"
                title="Sil"
                className="text-slate-300 transition hover:text-red-500"
              >
                ✕
              </button>
            </form>
          </li>
        ))}
        {open.length === 0 && (
          <li className="py-4 text-center text-sm text-slate-400">
            Açık görev yok 🎉
          </li>
        )}
      </ul>

      {/* tamamlananlar */}
      {done.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-slate-400">
            Tamamlananlar ({done.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {done.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 px-2.5 py-1 text-sm text-slate-400 line-through"
              >
                <form action={toggleTaskAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="next" value="open" />
                  <button
                    type="submit"
                    title="Geri al"
                    className="flex h-4 w-4 items-center justify-center rounded border border-brand-400 bg-brand-50 text-[10px] text-brand-600"
                  >
                    ✓
                  </button>
                </form>
                <span className="flex-1 truncate">{t.title}</span>
                <form action={deleteTaskAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="text-slate-300 transition hover:text-red-500"
                  >
                    ✕
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
