import type { Lang } from "./app-state";

const WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, lakh: 100000, lac: 100000,
  सौ: 100, हज़ार: 1000, हजार: 1000, लाख: 100000, शंभर: 100,
};

const DEVANAGARI = "०१२३४५६७८९";

/** Extract a rupee number from spoken text like "25,000", "25 thousand", "2 lakh", "२५००". */
export function parseSpokenNumber(text: string): number | null {
  let s = text.replace(/[०-९]/g, (d) => String(DEVANAGARI.indexOf(d))).replace(/,/g, "").toLowerCase();
  s = s.replace(/₹|rs\.?|rupees?|रुपये|रुपए/g, " ");
  let total = 0;
  let current = 0;
  let found = false;
  for (const tok of s.split(/\s+/).filter(Boolean)) {
    const num = Number(tok);
    if (!Number.isNaN(num)) {
      current += num;
      found = true;
      continue;
    }
    const w = WORDS[tok];
    if (w === undefined) continue;
    found = true;
    if (w >= 100) {
      current = (current || 1) * w;
      if (w >= 1000) {
        total += current;
        current = 0;
      }
    } else current += w;
  }
  return found ? total + current : null;
}

type SR = {
  lang: string;
  interimResults: boolean;
  onresult: (e: { results: { 0: { transcript: string } }[] }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
};

export function voiceSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w["SpeechRecognition"] || w["webkitSpeechRecognition"]);
}

export function listenForNumber(lang: Lang): Promise<{ text: string; value: number | null }> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, new () => SR>;
    const Ctor = w["SpeechRecognition"] || w["webkitSpeechRecognition"];
    if (!Ctor) return reject(new Error("unsupported"));
    const rec = new Ctor();
    rec.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";
    rec.interimResults = false;
    let done = false;
    rec.onresult = (e) => {
      done = true;
      const text = e.results[0]?.[0]?.transcript ?? "";
      resolve({ text, value: parseSpokenNumber(text) });
    };
    rec.onerror = () => {
      if (!done) reject(new Error("failed"));
      done = true;
    };
    rec.onend = () => {
      if (!done) reject(new Error("no speech"));
    };
    rec.start();
  });
}
