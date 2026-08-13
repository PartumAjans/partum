"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { setAdAccount } from "@/lib/users";

export async function assignAccountAction(
  _prev: { message?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ message?: string; ok?: boolean }> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return { ok: false, message: "Yetkiniz yok." };
  }

  const userId = String(formData.get("userId") || "");
  const adAccountId = String(formData.get("adAccountId") || "").trim();

  if (!userId || !adAccountId) {
    return { ok: false, message: "Kullanıcı ve hesap ID gerekli." };
  }
  if (!/^act_\d+$/.test(adAccountId)) {
    return {
      ok: false,
      message: "Hesap ID 'act_123456789' biçiminde olmalı.",
    };
  }

  const res = await setAdAccount(userId, adAccountId);
  if (res.demo) {
    return {
      ok: false,
      message:
        "Demo modunda eşleştirme kaydedilmez. Üretimde (Supabase) kalıcı olur.",
    };
  }
  if (!res.ok) {
    return { ok: false, message: "Eşleştirme kaydedilemedi." };
  }
  revalidatePath("/admin");
  return { ok: true, message: "Eşleştirme kaydedildi." };
}
