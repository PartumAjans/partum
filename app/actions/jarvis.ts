"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  createTask,
  deleteTask,
  setTaskStatus,
} from "@/lib/jarvis/tasks";
import type { TaskPriority } from "@/lib/jarvis/types";

// Jarvis komuta merkezindeki görev tahtası için sunucu eylemleri.

export async function addTaskAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const priorityRaw = String(formData.get("priority") || "normal");
  const priority: TaskPriority = (["low", "normal", "high"] as string[]).includes(
    priorityRaw,
  )
    ? (priorityRaw as TaskPriority)
    : "normal";
  const client = String(formData.get("client") || "").trim() || undefined;
  const dueRaw = String(formData.get("due") || "").trim();
  const due = /^\d{4}-\d{2}-\d{2}$/.test(dueRaw) ? dueRaw : undefined;

  createTask({ title, priority, client, due, createdBy: user.id });
  revalidatePath("/jarvis");
}

export async function toggleTaskAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "done") === "done" ? "done" : "open";
  setTaskStatus(id, next);
  revalidatePath("/jarvis");
}

export async function deleteTaskAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  deleteTask(id);
  revalidatePath("/jarvis");
}
