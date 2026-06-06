"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  clearSessionCookie,
  setSessionCookie,
} from "@/lib/auth";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "E-posta ve parola gerekli." };
  }

  const user = await authenticate(email, password);
  if (!user) {
    return { error: "E-posta veya parola hatalı." };
  }

  setSessionCookie(user.id);
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/login");
}
