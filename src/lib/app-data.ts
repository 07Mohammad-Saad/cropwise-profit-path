// Mock data layer — mirrors a FastAPI + PostgreSQL backend.
// Endpoints simulated: /api/mandis (AGMARKNET / data.gov.in),
// /api/distance (Google Distance Matrix), /api/buyers, /api/deals

export type Grade = "A" | "B" | "C";

export const CROPS = [
  { id: "onion", en: "Onion", hi: "प्याज", emoji: "🧅" },
  { id: "wheat", en: "Wheat", hi: "गेहूँ", emoji: "🌾" },
  { id: "rice", en: "Rice", hi: "चावल", emoji: "🍚" },
  { id: "soybean", en: "Soybean", hi: "सोयाबीन", emoji: "🫘" },
  { id: "tomato", en: "Tomato", hi: "टमाटर", emoji: "🍅" },
  { id: "cotton", en: "Cotton", hi: "कपास", emoji: "🧵" },
] as const;

export type CropId = (typeof CROPS)[number]["id"];

export const GRADE_FACTOR: Record<Grade, number> = { A: 1.06, B: 1.0, C: 0.91 };

export const TRANSPORT_RATE_PER_KM = 5; // ₹ per km (Kisan Sabha logistics framework, mock)
export const MANDI_FEE_PCT = 1.0; // % of gross, mock APMC cess

export type Mandi = {
  id: string;
  name: string;
  nameHi: string;
  district: string;
  distanceKm: number;
  prices: Record<CropId, number>; // modal price ₹/quintal
  arrivalsTonnes: number;
  trend: number; // % vs last week
};

export const MANDIS: Mandi[] = [
  {
    id: "pune",
    name: "Pune APMC, Market Yard",
    nameHi: "पुणे एपीएमसी",
    district: "Pune",
    distanceKm: 18,
    arrivalsTonnes: 420,
    trend: 2.4,
    prices: { onion: 2150, wheat: 2480, rice: 3120, soybean: 4680, tomato: 1450, cotton: 7250 },
  },
  {
    id: "nashik",
    name: "Lasalgaon Mandi, Nashik",
    nameHi: "लासलगाव मंडी, नाशिक",
    district: "Nashik",
    distanceKm: 46,
    arrivalsTonnes: 980,
    trend: 5.1,
    prices: { onion: 2420, wheat: 2390, rice: 3040, soybean: 4520, tomato: 1380, cotton: 7120 },
  },
  {
    id: "solapur",
    name: "Solapur Krushi Bazar",
    nameHi: "सोलापूर कृषी बाजार",
    district: "Solapur",
    distanceKm: 32,
    arrivalsTonnes: 310,
    trend: -1.2,
    prices: { onion: 2290, wheat: 2420, rice: 2980, soybean: 4610, tomato: 1520, cotton: 7310 },
  },
  {
    id: "kolhapur",
    name: "Kolhapur Shetkari Mandi",
    nameHi: "कोल्हापूर शेतकरी मंडी",
    district: "Kolhapur",
    distanceKm: 27,
    arrivalsTonnes: 260,
    trend: 0.8,
    prices: { onion: 2205, wheat: 2450, rice: 3180, soybean: 4550, tomato: 1610, cotton: 7080 },
  },
  {
    id: "nagpur",
    name: "Kalamna Market, Nagpur",
    nameHi: "कळमना मार्केट, नागपूर",
    district: "Nagpur",
    distanceKm: 49,
    arrivalsTonnes: 540,
    trend: 3.6,
    prices: { onion: 2380, wheat: 2530, rice: 3090, soybean: 4790, tomato: 1340, cotton: 7420 },
  },
];

export type Buyer = {
  id: string;
  mandiId: string;
  name: string;
  type: string;
  typeHi: string;
  priceDelta: number; // ₹/quintal over mandi modal price
  paymentSuccess: number; // %
  cancellation: number; // %
  rating: number;
  transactions: number;
  avgPaymentDays: number;
};

export const BUYERS: Buyer[] = [
  { id: "b1", mandiId: "pune", name: "Shree Balaji Traders", type: "Wholesaler", typeHi: "थोक व्यापारी", priceDelta: 60, paymentSuccess: 98, cancellation: 1, rating: 4.8, transactions: 1240, avgPaymentDays: 1 },
  { id: "b2", mandiId: "pune", name: "Krishna Agro Exports", type: "Exporter", typeHi: "निर्यातक", priceDelta: 130, paymentSuccess: 88, cancellation: 7, rating: 4.1, transactions: 410, avgPaymentDays: 6 },
  { id: "b3", mandiId: "pune", name: "Sadguru Commission Agent", type: "Commission Agent", typeHi: "आढतिया", priceDelta: 20, paymentSuccess: 94, cancellation: 3, rating: 4.4, transactions: 860, avgPaymentDays: 2 },
  { id: "b4", mandiId: "nashik", name: "Lasalgaon Onion Co-op", type: "FPO / Co-operative", typeHi: "सहकारी संस्था", priceDelta: 45, paymentSuccess: 99, cancellation: 1, rating: 4.9, transactions: 2110, avgPaymentDays: 1 },
  { id: "b5", mandiId: "nashik", name: "Global Fresh Pvt Ltd", type: "Processor", typeHi: "प्रोसेसर", priceDelta: 150, paymentSuccess: 82, cancellation: 11, rating: 3.7, transactions: 190, avgPaymentDays: 9 },
  { id: "b6", mandiId: "solapur", name: "Ganesh Vegetable Mart", type: "Wholesaler", typeHi: "थोक व्यापारी", priceDelta: 70, paymentSuccess: 96, cancellation: 2, rating: 4.6, transactions: 730, avgPaymentDays: 2 },
  { id: "b7", mandiId: "kolhapur", name: "Panchganga Agri Traders", type: "Wholesaler", typeHi: "थोक व्यापारी", priceDelta: 90, paymentSuccess: 91, cancellation: 5, rating: 4.2, transactions: 520, avgPaymentDays: 4 },
  { id: "b8", mandiId: "nagpur", name: "Kalamna Bulk Buyers LLP", type: "Institutional Buyer", typeHi: "संस्थागत खरीदार", priceDelta: 55, paymentSuccess: 95, cancellation: 3, rating: 4.5, transactions: 980, avgPaymentDays: 3 },
  { id: "b9", mandiId: "nagpur", name: "Vidarbha Retail Chain", type: "Retail Chain", typeHi: "रिटेल चेन", priceDelta: 110, paymentSuccess: 86, cancellation: 8, rating: 3.9, transactions: 300, avgPaymentDays: 7 },
  { id: "b10", mandiId: "solapur", name: "Siddheshwar Agro Mart", type: "Commission Agent", typeHi: "आढतिया", priceDelta: 30, paymentSuccess: 97, cancellation: 2, rating: 4.7, transactions: 1120, avgPaymentDays: 1 },
];

export type ProfitRow = {
  mandi: Mandi;
  quintals: number;
  ratePerQuintal: number;
  gross: number;
  transport: number;
  mandiFee: number;
  net: number;
  netPerQuintal: number;
};

export function computeProfit(mandi: Mandi, crop: CropId, qtyKg: number, grade: Grade): ProfitRow {
  const quintals = qtyKg / 100;
  const ratePerQuintal = Math.round(mandi.prices[crop] * GRADE_FACTOR[grade]);
  const gross = Math.round(ratePerQuintal * quintals);
  const transport = Math.round(mandi.distanceKm * TRANSPORT_RATE_PER_KM * Math.max(1, Math.ceil(qtyKg / 1000)));
  const mandiFee = Math.round((gross * MANDI_FEE_PCT) / 100);
  const net = gross - transport - mandiFee;
  return { mandi, quintals, ratePerQuintal, gross, transport, mandiFee, net, netPerQuintal: Math.round(net / quintals) };
}

export function rankedMandis(crop: CropId, qtyKg: number, grade: Grade): ProfitRow[] {
  return MANDIS.map((m) => computeProfit(m, crop, qtyKg, grade)).sort((a, b) => b.net - a.net);
}

/** Safest Buyer Score: reliability weighted, not just price. 0-100 */
export function safetyScore(b: Buyer): number {
  const score =
    b.paymentSuccess * 0.5 +
    (100 - b.cancellation * 4) * 0.2 +
    (b.rating / 5) * 100 * 0.18 +
    Math.min(100, (b.transactions / 2000) * 100) * 0.07 +
    Math.max(0, 100 - b.avgPaymentDays * 9) * 0.05;
  return Math.round(Math.min(99, score));
}

export function buyersForMandi(mandiId: string): Buyer[] {
  return BUYERS.filter((b) => b.mandiId === mandiId);
}

export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
