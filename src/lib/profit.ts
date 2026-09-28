export type CostInputs = {
  seed_cost: number;
  fertilizer_cost: number;
  labour_cost: number;
  water_cost: number;
  other_cost: number;
  expected_yield_quintal: number;
  mandi_price_per_quintal: number;
};

export type ProfitResult = {
  total_cost: number;
  total_revenue: number;
  net_profit: number;
  profit_percent: number;
  cost_per_quintal: number;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export function calculateProfit(i: CostInputs): ProfitResult {
  const total_cost = i.seed_cost + i.fertilizer_cost + i.labour_cost + i.water_cost + i.other_cost;
  const total_revenue = i.expected_yield_quintal * i.mandi_price_per_quintal;
  const net_profit = total_revenue - total_cost;
  const profit_percent = total_cost > 0 ? (net_profit / total_cost) * 100 : 0;
  const cost_per_quintal = i.expected_yield_quintal > 0 ? total_cost / i.expected_yield_quintal : 0;
  return {
    total_cost: r2(total_cost),
    total_revenue: r2(total_revenue),
    net_profit: r2(net_profit),
    profit_percent: r2(profit_percent),
    cost_per_quintal: r2(cost_per_quintal),
  };
}

export function inr(n: number): string {
  const v = Math.round(Number(n) || 0);
  return (v < 0 ? "-₹" : "₹") + Math.abs(v).toLocaleString("en-IN");
}

export const CROPS = [
  { id: "Onion", en: "Onion", hi: "प्याज", mr: "कांदा", emoji: "🧅" },
  { id: "Tomato", en: "Tomato", hi: "टमाटर", mr: "टोमॅटो", emoji: "🍅" },
  { id: "Grapes", en: "Grapes", hi: "अंगूर", mr: "द्राक्ष", emoji: "🍇" },
  { id: "Soybean", en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन", emoji: "🫘" },
  { id: "Cotton", en: "Cotton", hi: "कपास", mr: "कापूस", emoji: "🧵" },
  { id: "Wheat", en: "Wheat", hi: "गेहूँ", mr: "गहू", emoji: "🌾" },
] as const;

export const MARKETS = ["Nashik", "Lasalgaon", "Pune", "Mumbai"] as const;

export function cropMeta(name: string) {
  return CROPS.find((c) => c.id === name) ?? { id: name, en: name, hi: name, mr: name, emoji: "🌱" };
}

export function shareText(e: {
  crop_name: string;
  area_acre: number;
  total_cost: number;
  total_revenue: number;
  net_profit: number;
}) {
  const word = Number(e.net_profit) >= 0 ? "Profit" : "Loss";
  const fmt = (n: number) => "Rs " + Math.abs(Math.round(Number(n))).toLocaleString("en-IN");
  return `My ${e.crop_name} crop on ${e.area_acre} acres: Cost ${fmt(e.total_cost)}, Revenue ${fmt(
    e.total_revenue,
  )}, ${word} ${fmt(e.net_profit)} - Calculated on CropWise`;
}
