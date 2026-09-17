import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Star, XCircle, Repeat, Clock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import {
  MANDIS,
  buyersForMandi,
  computeProfit,
  inr,
  safetyScore,
  type Buyer,
} from "@/lib/app-data";

export const Route = createFileRoute("/buyers")({
  head: () => ({
    meta: [
      { title: "Buyer Reliability Check | Smart Mandi" },
      {
        name: "description",
        content:
          "Compare buyers on payment success, cancellations, rating and transactions — not just the offered price.",
      },
      { property: "og:title", content: "Buyer Reliability Check | Smart Mandi" },
      { property: "og:description", content: "The safest buyer, not only the highest bidder." },
    ],
  }),
  component: BuyersPage,
});

function BuyersPage() {
  const { t, lang, selection, setSelection } = useApp();
  const navigate = useNavigate();

  const mandi = selection?.mandiId ? MANDIS.find((m) => m.id === selection.mandiId) : undefined;

  if (!selection || !mandi) {
    return (
      <AppShell back title={t("Buyers", "खरीदार")} subtitle={t("Step 3 of 5", "चरण 3 / 5")}>
        <div className="rounded-3xl bg-card p-6 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            {t("Select a mandi first.", "पहले एक मंडी चुनें।")}
          </p>
          <Link
            to="/markets"
            className="mt-4 inline-block rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            {t("See Mandis", "मंडी देखें")}
          </Link>
        </div>
      </AppShell>
    );
  }

  const base = computeProfit(mandi, selection.crop, selection.qtyKg, selection.grade);
  const quintals = base.quintals;

  const rows = buyersForMandi(mandi.id)
    .map((b) => {
      const rate = base.ratePerQuintal + b.priceDelta;
      const gross = Math.round(rate * quintals);
      const mandiFee = Math.round(gross * 0.01);
      const net = gross - base.transport - mandiFee;
      return { buyer: b, rate, gross, mandiFee, net, score: safetyScore(b) };
    })
    .sort((a, b) => b.net - a.net);

  const safest = [...rows].sort((a, b) => b.score - a.score)[0]!;

  const choose = (b: Buyer) => {
    setSelection({ ...selection, buyerId: b.id });
    navigate({ to: "/deal" });
  };

  return (
    <AppShell
      back
      title={t("Choose Buyer", "खरीदार चुनें")}
      subtitle={`${mandi.name} · ${t("Step 3 of 5", "चरण 3 / 5")}`}
    >
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-4 text-primary-foreground shadow-brand">
        <p className="flex items-center gap-1 text-xs uppercase tracking-wide opacity-90">
          <ShieldCheck className="size-4" /> {t("Safest buyer here", "यहाँ सबसे भरोसेमंद")}
        </p>
        <p className="mt-1 text-lg font-extrabold">{safest.buyer.name}</p>
        <p className="text-xs opacity-90">
          {t("Safety score", "सुरक्षा स्कोर")} {safest.score}/100 ·{" "}
          {safest.buyer.paymentSuccess}% {t("payments on time", "समय पर भुगतान")}
        </p>
      </div>

      <h2 className="mt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t("Sorted by your net profit", "आपके शुद्ध लाभ के क्रम में")}
      </h2>

      <div className="mt-2 space-y-3">
        {rows.map((r, i) => {
          const risky = r.buyer.paymentSuccess < 90;
          return (
            <button
              key={r.buyer.id}
              onClick={() => choose(r.buyer)}
              className={`w-full rounded-3xl border-2 bg-card p-4 text-left shadow-card ${
                i === 0 ? "border-primary" : "border-transparent"
              }`}
            >
              <div className="flex flex-wrap gap-1.5">
                {i === 0 && (
                  <span className="rounded-full bg-success px-3 py-1 text-[11px] font-extrabold text-success-foreground">
                    {t("RECOMMENDED · Highest Net Profit", "अनुशंसित · सर्वाधिक शुद्ध लाभ")}
                  </span>
                )}
                {r.buyer.id === safest.buyer.id && (
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold text-accent-foreground">
                    {t("SAFEST BUYER", "सबसे भरोसेमंद")}
                  </span>
                )}
                {risky && (
                  <span className="rounded-full bg-destructive px-3 py-1 text-[11px] font-extrabold text-destructive-foreground">
                    {t("PAYMENT RISK", "भुगतान जोखिम")}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold">{r.buyer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "hi" ? r.buyer.typeHi : r.buyer.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">
                    {t("Offered", "प्रस्तावित")}
                  </p>
                  <p className="font-bold">₹{r.rate}/qtl</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Stat
                  icon={<ShieldCheck className="size-4 text-success" />}
                  label={t("Payment success", "भुगतान सफलता")}
                  value={`${r.buyer.paymentSuccess}%`}
                />
                <Stat
                  icon={<XCircle className="size-4 text-destructive" />}
                  label={t("Cancellation", "रद्दीकरण")}
                  value={`${r.buyer.cancellation}%`}
                />
                <Stat
                  icon={<Star className="size-4 text-accent" />}
                  label={t("Rating", "रेटिंग")}
                  value={`${r.buyer.rating}/5`}
                />
                <Stat
                  icon={<Repeat className="size-4 text-primary" />}
                  label={t("Transactions", "कुल सौदे")}
                  value={String(r.buyer.transactions)}
                />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>{t("Safety score", "सुरक्षा स्कोर")}</span>
                  <span>{r.score}/100</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${r.score >= 90 ? "bg-success" : r.score >= 80 ? "bg-accent" : "bg-destructive"}`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary-soft px-3 py-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    {t("Your net profit", "आपका शुद्ध लाभ")}
                  </p>
                  <p className="text-lg font-extrabold text-primary">{inr(r.net)}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3.5" />
                  {t("Paid in", "भुगतान")} {r.buyer.avgPaymentDays}d
                  <ArrowRight className="ml-1 size-5 text-primary" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted px-2 py-2">
      {icon}
      <div className="min-w-0">
        <p className="truncate text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
