import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, TrendingUp, ShieldCheck, Lock, ArrowRight, Mic } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import { CROPS, MANDIS, inr } from "@/lib/app-data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Dashboard | Tech Titan Smart Mandi" },
      {
        name: "description",
        content: "Your mandi dashboard: today's rates, last profit and one-tap selling decision.",
      },
      { property: "og:title", content: "Dashboard | Tech Titan Smart Mandi" },
      { property: "og:description", content: "Today's mandi rates and your last locked deal." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, farmer, deals } = useApp();
  const lastDeal = deals[0];

  return (
    <AppShell
      title={t("Namaste", "नमस्ते") + ", " + (farmer?.name ?? "Kisan")}
      subtitle={farmer?.village ?? "Baramati, Pune"}
    >
      <section className="rounded-3xl bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-2xl">
            👨‍🌾
          </div>
          <div className="flex-1">
            <p className="font-bold">{farmer?.name ?? "Ramesh Patil"}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {farmer?.village ?? "Baramati, Pune"} · GPS{" "}
              {t("active", "चालू")}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-primary-soft p-3">
            <p className="text-[11px] text-muted-foreground">{t("Last profit", "पिछला लाभ")}</p>
            <p className="text-lg font-extrabold text-primary">
              {lastDeal ? inr(lastDeal.net) : inr(41250)}
            </p>
          </div>
          <div className="rounded-2xl bg-accent/20 p-3">
            <p className="text-[11px] text-muted-foreground">{t("Deals locked", "लॉक सौदे")}</p>
            <p className="text-lg font-extrabold text-accent-foreground">{deals.length}</p>
          </div>
        </div>
      </section>

      <Link
        to="/input"
        className="mt-4 flex items-center gap-3 rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-5 text-primary-foreground shadow-brand"
      >
        <div className="flex-1">
          <p className="text-lg font-extrabold">{t("Sell My Crop", "अपनी फसल बेचें")}</p>
          <p className="text-xs opacity-90">
            {t(
              "Crop → Mandi → Buyer → Net profit → Deal lock",
              "फसल → मंडी → खरीदार → शुद्ध लाभ → सौदा लॉक",
            )}
          </p>
        </div>
        <ArrowRight className="size-7" />
      </Link>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary-soft p-3 text-xs text-secondary-foreground">
        <Mic className="size-5 text-primary" />
        {t(
          "Tip: use the voice button to speak your crop and quantity.",
          "सुझाव: फसल और मात्रा बोलने के लिए वॉइस बटन दबाएँ।",
        )}
      </div>

      <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t("Why Smart Mandi", "स्मार्ट मंडी क्यों")}
      </h2>
      <div className="mt-2 space-y-2">
        {[
          {
            icon: TrendingUp,
            title: t("Personalised best selling option", "व्यक्तिगत सर्वोत्तम विकल्प"),
            body: t(
              "Based on your crop, quantity and location — not a generic price list.",
              "आपकी फसल, मात्रा और स्थान के आधार पर — सिर्फ़ भाव सूची नहीं।",
            ),
          },
          {
            icon: ShieldCheck,
            title: t("Safest buyer recommendation", "सबसे भरोसेमंद खरीदार"),
            body: t(
              "Payment success, cancellations and rating — not just the highest price.",
              "भुगतान रिकॉर्ड, रद्दीकरण और रेटिंग — सिर्फ़ ऊँचा भाव नहीं।",
            ),
          },
          {
            icon: Lock,
            title: t("Smart deal protection", "स्मार्ट सौदा सुरक्षा"),
            body: t(
              "Freeze the price with a Deal ID so no one renegotiates later.",
              "डील आईडी के साथ भाव फ्रीज़ करें ताकि बाद में मोलभाव न हो।",
            ),
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3 rounded-2xl bg-card p-3 shadow-card">
            <Icon className="mt-0.5 size-6 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t("Today's onion rates (AGMARKNET)", "आज के प्याज भाव (एगमार्कनेट)")}
      </h2>
      <div className="mt-2 space-y-2">
        {MANDIS.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
            <span className="text-xl">{CROPS[0].emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {m.distanceKm} km · {m.arrivalsTonnes} {t("tonnes arrived", "टन आवक")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">₹{m.prices.onion}</p>
              <p
                className={`text-[11px] font-semibold ${m.trend >= 0 ? "text-success" : "text-destructive"}`}
              >
                {m.trend >= 0 ? "▲" : "▼"} {Math.abs(m.trend)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
