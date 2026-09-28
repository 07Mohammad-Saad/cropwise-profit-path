import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const MARKETS = ["Nashik", "Lasalgaon", "Pune", "Mumbai"];
const CROPS = ["Onion", "Tomato", "Grapes", "Soybean", "Cotton", "Wheat"];

type Rec = {
  market?: string;
  commodity?: string;
  modal_price?: string;
  min_price?: string;
  max_price?: string;
  arrival_date?: string;
};

function parseDate(d?: string): string | null {
  if (!d) return null;
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

/** Fetch latest Agmarknet modal prices from data.gov.in and cache them. */
export const refreshMandiRates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const key = process.env["DATA_GOV_API_KEY"];
    if (!key) return { ok: false as const, reason: "no_key", updated: 0 };

    try {
      const url = `https://api.data.gov.in/resource/${RESOURCE}?api-key=${encodeURIComponent(
        key,
      )}&format=json&limit=2000&filters[state]=Maharashtra`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Agmarknet HTTP", res.status);
        return { ok: false as const, reason: "api_error", updated: 0 };
      }
      const json = (await res.json()) as { records?: Rec[] };
      const rows: Record<string, { market: string; crop: string; modal_price: number; min_price: number | null; max_price: number | null; arrival_date: string | null; source: string; fetched_at: string }> = {};
      for (const r of json.records ?? []) {
        const market = MARKETS.find((m) => (r.market ?? "").toLowerCase().includes(m.toLowerCase()));
        const crop = CROPS.find((c) => (r.commodity ?? "").toLowerCase().includes(c.toLowerCase()));
        const modal = Number(r.modal_price);
        if (!market || !crop || !modal) continue;
        rows[`${market}|${crop}`] = {
          market,
          crop,
          modal_price: modal,
          min_price: Number(r.min_price) || null,
          max_price: Number(r.max_price) || null,
          arrival_date: parseDate(r.arrival_date),
          source: "agmarknet",
          fetched_at: new Date().toISOString(),
        };
      }
      const list = Object.values(rows);
      if (list.length) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("mandi_rates").upsert(list, { onConflict: "market,crop" });
        if (error) {
          console.error(error);
          return { ok: false as const, reason: "save_error", updated: 0 };
        }
      }
      return { ok: true as const, reason: "", updated: list.length };
    } catch (e) {
      console.error("Agmarknet fetch failed", e);
      return { ok: false as const, reason: "api_error", updated: 0 };
    }
  });
