"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
    </button>
  );
}

export default function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          E-posta
        </label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="ornek@firma.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Parola
        </label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton />

      {demoMode && (
        <div className="rounded-lg bg-slate-50 px-3 py-3 text-xs text-slate-500">
          <p className="mb-1 font-semibold text-slate-600">Demo girişleri:</p>
          <p>Müşteri: musteri@ornek.com / musteri123</p>
          <p>Yönetici: admin@partum.com / admin123</p>
        </div>
      )}
    </form>
  );
}
