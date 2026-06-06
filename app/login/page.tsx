import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { config } from "@/lib/config";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Partum Panel</h1>
          <p className="mt-1 text-sm text-slate-500">
            Reklam raporlarınıza erişmek için giriş yapın
          </p>
        </div>

        <div className="card p-6">
          <LoginForm demoMode={config.demoMode} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Partum Ajans
        </p>
      </div>
    </main>
  );
}
