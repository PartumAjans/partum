import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { runJarvis } from "@/lib/jarvis/agent";
import type { ChatMessage } from "@/lib/jarvis/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Jarvis sohbet uç noktası.
// Gövde: { messages: {role, content}[] }
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  // Girdiyi temizle ve sınırl (son 20 mesaj)
  const history: ChatMessage[] = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Son mesaj kullanıcıdan olmalı." },
      { status: 400 },
    );
  }

  try {
    const reply = await runJarvis(history, {
      userId: user.id,
      userName: user.name,
    });
    return NextResponse.json(reply);
  } catch (e) {
    return NextResponse.json(
      { error: `Beklenmedik hata: ${(e as Error).message}` },
      { status: 500 },
    );
  }
}
