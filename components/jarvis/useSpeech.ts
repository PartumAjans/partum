"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ----------------------------------------------------------------------------
// Tarayıcı yerel ses motoruyla (Web Speech API) sesli Jarvis mantığı.
//  - Konuşmayı metne çevirme (SpeechRecognition) — Chrome/Edge
//  - "Hey Jarvis" uyandırma kelimesiyle sürekli dinleme
//  - Sesli yanıt (SpeechSynthesis)
//  - Jarvis konuşurken mikrofonu susturarak kendi sesini duymasını engelleme
// Hiçbir dış servise/anahtara ihtiyaç yoktur.
// ----------------------------------------------------------------------------

export type VoiceStatus =
  | "unsupported"
  | "off"
  | "wake" // "hey jarvis" bekleniyor
  | "command" // komut dinleniyor
  | "speaking"
  | "denied";

// "hey jarvis" ve olası yanlış duyumları
const WAKE_PATTERNS = [
  "hey jarvis",
  "hey carvis",
  "hey servis",
  "hey jervis",
  "ey jarvis",
  "hey jarvís",
  "hey jarwis",
  "hey jarbis",
  "hi jarvis",
  "hey partum",
];

function stripWake(text: string): { matched: boolean; rest: string } {
  const lower = text.toLowerCase();
  for (const p of WAKE_PATTERNS) {
    const idx = lower.indexOf(p);
    if (idx !== -1) {
      return { matched: true, rest: text.slice(idx + p.length).trim() };
    }
  }
  return { matched: false, rest: text };
}

interface UseSpeechOptions {
  lang?: string;
  onCommand: (text: string) => void;
}

export function useSpeech({ lang = "tr-TR", onCommand }: UseSpeechOptions) {
  const [status, setStatus] = useState<VoiceStatus>("off");
  const [wakeEnabled, setWakeEnabled] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);

  const recRef = useRef<any>(null);
  const modeRef = useRef<"off" | "wake" | "command">("off");
  const oneShotRef = useRef(false);
  const suppressRef = useRef(false); // Jarvis konuşurken dinlemeyi bastır
  const wakeEnabledRef = useRef(false);
  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);
  useEffect(() => {
    wakeEnabledRef.current = wakeEnabled;
  }, [wakeEnabled]);

  // --- tanıma (recognition) örneğini kur ---
  const getRecognition = useCallback((): any => {
    if (typeof window === "undefined") return null;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    if (recRef.current) return recRef.current;

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = res[0]?.transcript || "";
        if (res.isFinal) {
          handleFinal(txt.trim());
        } else {
          interimText += txt;
        }
      }
      if (interimText) setInterim(interimText);
    };

    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        modeRef.current = "off";
        setWakeEnabled(false);
        setStatus("denied");
      }
      // "no-speech"/"aborted" → onend halleder
    };

    rec.onend = () => {
      setInterim("");
      // Bastırma (Jarvis konuşuyor) sırasında yeniden başlatma
      if (suppressRef.current) return;
      // Sürekli mod: wake açıkken tekrar başlat
      if (modeRef.current !== "off" && wakeEnabledRef.current) {
        try {
          rec.start();
        } catch {
          /* zaten çalışıyor olabilir */
        }
      } else if (!wakeEnabledRef.current) {
        modeRef.current = "off";
        setStatus("off");
      }
    };

    recRef.current = rec;
    return rec;
  }, [lang]);

  // --- final transkript işleme ---
  const handleFinal = useCallback((text: string) => {
    if (!text) return;
    setInterim("");

    if (modeRef.current === "wake") {
      const { matched, rest } = stripWake(text);
      if (!matched) return; // uyandırma kelimesi yok, yok say
      if (rest.length > 1) {
        // Aynı cümlede komut da var: "hey jarvis bugün ne var"
        deliver(rest);
      } else {
        // Sadece uyandırma: bir sonraki cümleyi komut olarak bekle
        modeRef.current = "command";
        setStatus("command");
      }
      return;
    }

    if (modeRef.current === "command") {
      deliver(text);
    }
  }, []);

  const deliver = useCallback((command: string) => {
    onCommandRef.current(command);
    if (oneShotRef.current) {
      // Tek seferlik (bas-konuş): dinlemeyi durdur
      oneShotRef.current = false;
      modeRef.current = "off";
      try {
        recRef.current?.stop();
      } catch {
        /* yut */
      }
      setStatus("off");
    } else {
      // Sürekli mod: komuttan sonra tekrar uyandırma bekle
      modeRef.current = "wake";
      setStatus("wake");
    }
  }, []);

  // --- dışa açık kontroller ---

  const startWake = useCallback(() => {
    const rec = getRecognition();
    if (!rec) {
      setSupported(false);
      setStatus("unsupported");
      return;
    }
    oneShotRef.current = false;
    modeRef.current = "wake";
    setWakeEnabled(true);
    setStatus("wake");
    try {
      rec.start();
    } catch {
      /* zaten çalışıyor */
    }
  }, [getRecognition]);

  const stopWake = useCallback(() => {
    setWakeEnabled(false);
    modeRef.current = "off";
    try {
      recRef.current?.stop();
    } catch {
      /* yut */
    }
    setStatus("off");
  }, []);

  const pushToTalk = useCallback(() => {
    const rec = getRecognition();
    if (!rec) {
      setSupported(false);
      setStatus("unsupported");
      return;
    }
    oneShotRef.current = true;
    modeRef.current = "command";
    setStatus("command");
    try {
      rec.start();
    } catch {
      /* yut */
    }
  }, [getRecognition]);

  // --- sesli yanıt ---
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    // Jarvis konuşurken mikrofonu sustur (kendi sesini duymasın)
    const wasWake = wakeEnabledRef.current;
    if (recRef.current && (modeRef.current !== "off" || wasWake)) {
      suppressRef.current = true;
      try {
        recRef.current.stop();
      } catch {
        /* yut */
      }
    }
    setStatus("speaking");

    // Metni sesli okumadan önce sadeleştir (emoji/madde işaretleri)
    const clean = text
      .replace(/[#*_`>]/g, "")
      .replace(/\p{Extended_Pictographic}/gu, "")
      .trim();

    const utter = new SpeechSynthesisUtterance(clean || text);
    utter.lang = lang;
    const voices = synth.getVoices();
    const trVoice =
      voices.find((v) => v.lang?.toLowerCase().startsWith("tr")) || null;
    if (trVoice) utter.voice = trVoice;

    const resume = () => {
      suppressRef.current = false;
      if (wakeEnabledRef.current) {
        modeRef.current = "wake";
        setStatus("wake");
        try {
          recRef.current?.start();
        } catch {
          /* yut */
        }
      } else {
        setStatus("off");
      }
    };
    utter.onend = resume;
    utter.onerror = resume;

    synth.speak(utter);
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    suppressRef.current = false;
    if (wakeEnabledRef.current) {
      modeRef.current = "wake";
      setStatus("wake");
      try {
        recRef.current?.start();
      } catch {
        /* yut */
      }
    } else {
      setStatus("off");
    }
  }, []);

  // --- destek kontrolü + temizlik ---
  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition);
    if (!SR) {
      setSupported(false);
      setStatus("unsupported");
    }
    // bazı tarayıcılarda sesler asenkron yüklenir
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* yut */
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    supported,
    status,
    wakeEnabled,
    interim,
    startWake,
    stopWake,
    pushToTalk,
    speak,
    stopSpeaking,
  };
}
