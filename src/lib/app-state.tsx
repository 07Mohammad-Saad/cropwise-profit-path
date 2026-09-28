import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t(english, hindi, marathi) */
  t: (en: string, hi: string, mr: string) => string;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("cw_lang");
    if (saved === "hi" || saved === "mr" || saved === "en") setLang(saved);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        window.localStorage.setItem("cw_lang", l);
        setLang(l);
      },
      t: (en, hi, mr) => (lang === "hi" ? hi : lang === "mr" ? mr : en),
    }),
    [lang],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
