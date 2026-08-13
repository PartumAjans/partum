"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeech } from "./useSpeech";

interface Msg {
  role: "user" | "assistant";
  content: string;
  toolsUsed?: string[];
  live?: boolean;
}

const SUGGESTIONS = [
  "Müşteri durumu özeti",
  "Örnek Mağaza raporu",
  "Görevleri listele",
  "Köşe Kafe'ye haftalık özet WhatsApp taslağı yaz",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Selam! Ben Jarvis 👋 Yazabilir ya da “Hey Jarvis” diyerek sesli konuşabilirsin. Müşteri durumlarını sorabilir, reklam raporu isteyebilir, görev/planlama verebilirsin.",
      live: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speakReplies, setSpeakReplies] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Msg[]>(messages);
  const speakRef = useRef<((t: string) => void) | null>(null);
  const speakRepliesRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    speakRepliesRef.current = speakReplies;
  }, [speakReplies]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return;
    setError(null);

    const base = messagesRef.current;
    const next: Msg[] = [...base, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İstek başarısız oldu.");
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: data.content,
          toolsUsed: data.toolsUsed,
          live: data.live,
        },
      ]);
      if (speakRepliesRef.current && data.content) {
        speakRef.current?.(data.content);
      }
    } catch (e) {
      setError((e as Error).message);
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: "Bir sorun oluştu. Lütfen tekrar dener misin?" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ses motoru
  const {
    supported,
    status,
    wakeEnabled,
    interim,
    startWake,
    stopWake,
    pushToTalk,
    speak,
    stopSpeaking,
  } = useSpeech({ lang: "tr-TR", onCommand: (t) => send(t) });

  useEffect(() => {
    speakRef.current = speak;
  }, [speak]);

  const toggleWake = () => {
    if (wakeEnabled) {
      stopWake();
    } else {
      setSpeakReplies(true); // uyandırma modunda geri konuşsun
      startWake();
    }
  };

  const statusLabel: Record<string, string> = {
    wake: '“Hey Jarvis” bekleniyor…',
    command: "Dinliyorum…",
    speaking: "Konuşuyorum…",
    denied: "Mikrofon izni reddedildi",
    unsupported: "Bu tarayıcı sesi desteklemiyor",
    off: "",
  };
  const listening = status === "wake" || status === "command";

  return (
    <div className="card flex h-[calc(100vh-9rem)] min-h-[28rem] flex-col">
      {/* başlık */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white transition ${
              status === "speaking"
                ? "animate-pulse bg-emerald-500"
                : listening
                  ? "animate-pulse bg-brand-500"
                  : "bg-brand-600"
            }`}
          >
            J
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Jarvis</div>
            <div className="text-xs text-slate-500">
              {statusLabel[status] || "Ajans asistanın"}
            </div>
          </div>
        </div>

        {supported && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSpeakReplies((v) => !v)}
              title={speakReplies ? "Sesli yanıt açık" : "Sesli yanıt kapalı"}
              className={`rounded-lg border px-2 py-1 text-sm transition ${
                speakReplies
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-400 hover:bg-slate-50"
              }`}
            >
              {speakReplies ? "🔊" : "🔇"}
            </button>
            <button
              onClick={toggleWake}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                wakeEnabled
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {wakeEnabled ? "● Dinliyor" : "Hey Jarvis"}
            </button>
          </div>
        )}
      </div>

      {/* mesajlar */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-sm text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-3.5 py-2 text-sm text-slate-800"
              }
            >
              <div className="whitespace-pre-wrap break-words">{m.content}</div>
              {m.role === "assistant" &&
                (m.toolsUsed?.length || m.live === false) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {m.live === false && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        temel mod
                      </span>
                    )}
                    {m.toolsUsed?.map((t, j) => (
                      <span
                        key={j}
                        className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-3.5 py-2 text-sm text-slate-500">
              <span className="inline-flex gap-1">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse [animation-delay:150ms]">●</span>
                <span className="animate-pulse [animation-delay:300ms]">●</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* canlı ses durumu / interim transkript */}
      {(listening || status === "speaking") && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                status === "speaking" ? "bg-emerald-400" : "bg-brand-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                status === "speaking" ? "bg-emerald-500" : "bg-brand-500"
              }`}
            />
          </span>
          <span className="flex-1 truncate text-xs text-slate-500">
            {interim || statusLabel[status]}
          </span>
          {status === "speaking" && (
            <button
              onClick={stopSpeaking}
              className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:bg-white"
            >
              Sustur
            </button>
          )}
        </div>
      )}

      {/* öneriler */}
      {messages.length <= 2 && !listening && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2 pt-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <div className="px-4 pb-1 text-xs text-red-600">{error}</div>}
      {status === "denied" && (
        <div className="px-4 pb-1 text-xs text-amber-600">
          Mikrofon izni gerekli. Tarayıcı adres çubuğundaki kilit simgesinden
          mikrofona izin verip tekrar dene.
        </div>
      )}
      {!supported && (
        <div className="px-4 pb-1 text-xs text-slate-400">
          Sesli mod için Chrome veya Edge kullan (yazarak her tarayıcıda çalışır).
        </div>
      )}

      {/* girdi */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-slate-200 p-3"
      >
        {supported && (
          <button
            type="button"
            onClick={pushToTalk}
            disabled={status === "command" || status === "speaking"}
            title="Bas-konuş"
            className={`rounded-lg border px-3 py-2 text-sm transition disabled:opacity-40 ${
              status === "command"
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            🎙️
          </button>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Jarvis'e yaz ya da 🎙️ ile konuş…"
          className="max-h-32 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
