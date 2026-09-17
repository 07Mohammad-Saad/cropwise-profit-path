import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CropId, Grade } from "./app-data";

export type Lang = "en" | "hi";

export type Farmer = { name: string; phone: string; village: string };

export type Selection = {
  crop: CropId;
  qtyKg: number;
  grade: Grade;
  location: string;
  mandiId?: string;
  buyerId?: string;
};

export type Deal = {
  id: string;
  createdAt: string;
  crop: CropId;
  qtyKg: number;
  grade: Grade;
  mandiName: string;
  buyerName: string;
  lockedRate: number;
  transport: number;
  net: number;
  status: "locked";
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, hi: string) => string;
  farmer: Farmer | null;
  setFarmer: (f: Farmer | null) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  deals: Deal[];
  addDeal: (d: Deal) => void;
};

const AppCtx = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLang(load<Lang>("tt_lang", "en"));
    setFarmer(load<Farmer | null>("tt_farmer", null));
    setSelection(load<Selection | null>("tt_selection", null));
    setDeals(load<Deal[]>("tt_deals", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("tt_lang", JSON.stringify(lang));
    window.localStorage.setItem("tt_farmer", JSON.stringify(farmer));
    window.localStorage.setItem("tt_selection", JSON.stringify(selection));
    window.localStorage.setItem("tt_deals", JSON.stringify(deals));
  }, [hydrated, lang, farmer, selection, deals]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (en, hi) => (lang === "hi" ? hi : en),
      farmer,
      setFarmer,
      selection,
      setSelection,
      deals,
      addDeal: (d) => setDeals((prev) => [d, ...prev]),
    }),
    [lang, farmer, selection, deals],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
