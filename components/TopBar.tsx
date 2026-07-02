import { logoutAction } from "@/app/actions/auth";
import type { User } from "@/lib/types";

export default function TopBar({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            P
          </div>
          <span className="font-semibold text-slate-900">Partum Panel</span>
          {user.role === "admin" && (
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Yönetici
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">
            {user.name}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Çıkış
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
