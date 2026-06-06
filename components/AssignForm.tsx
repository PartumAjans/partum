"use client";

import { useFormState, useFormStatus } from "react-dom";
import { assignAccountAction } from "@/app/actions/admin";

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "…" : "Kaydet"}
    </button>
  );
}

export default function AssignForm({
  userId,
  current,
}: {
  userId: string;
  current?: string;
}) {
  const [state, action] = useFormState(assignAccountAction, {});

  return (
    <form action={action} className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <input
          name="adAccountId"
          defaultValue={current || ""}
          placeholder="act_123456789"
          className="w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
        />
        <Btn />
      </div>
      {state?.message && (
        <span
          className={`text-xs ${state.ok ? "text-emerald-600" : "text-amber-600"}`}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
