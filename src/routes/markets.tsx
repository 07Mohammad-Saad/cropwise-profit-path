import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Truck, Award, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import { CROPS, TRANSPORT_RATE_PER_KM, inr, rankedMandis } from "@/lib/app-data";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Nearby Mandis by Net Profit | Smart Mandi" },
      {
        name: "description",
        content:
          "Mandis within 50 km ranked by real net profit after transport and mandi fees — not just by price.",
      },
      { property: "og:title", content: "Nearby Mandis by Net Profit | Smart Mandi" },
      { property: "og:description", content: "Ranked by what you actually take home." },
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  const { t, selection, setSelection } = useApp();
  const navigate = useNavigate();

  if (!selection) {
    return (
      <AppShell title={t("Markets", "मंडी")} subtitle={t("Step 2 of 5", "चरण 2 / 5")}>
        <div className="rounded-3xl bg-card p-6 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            {t("Tell us your crop first to see net profit.", "शुद्ध लाभ देखने के लिए पहले फसल बताएँ।")}
          </p>
          <Link
            to="/input"
            className="mt-4 inline-block rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            {t("Enter Crop Details", "फसल जानकारी भरें")}
          </Link>
        </div>
      </AppShell>
    );
  }

  const rows = rankedMandis(selection.crop, selection.qtyKg, selection.grade);
  const best = rows[0]!;
  const cropMeta = CROPS.find((c) => c.id === selection.crop)!;

  const choose = (mandiId: string) => {
    const { buyerId: _prev, ...rest } = selection;
    setSelection({ ...rest, mandiId });
    navigate({ to: "/buyers" });
  };

  return (
    <AppShell
      back
      title={t("Nearby Mandis", "नज़दीकी मंडी")}
      subtitle={`${cropMeta.emoji} ${selection.qtyKg} kg · ${t("Grade", "ग्रेड")} ${selection.grade} · ${selection.location}`}
    >
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-4 text-primary-foreground shadow-brand">
        <p className="text-xs uppercase tracking-wide opacity-90">
          {t("Recommended by net profit", "शुद्ध लाभ के अनुसार सुझाव")}
        </p>
        <p className="mt-1 text-2xl font-extrabold">{inr(best.net)}</p>
        <p className="text-sm">{best.mandi.name}</p>
        <p className="mt-1 text-xs opacity-90">
          {inr(best.gross)} {t("gross", "कुल")} − {inr(best.transport)} {t("transport", "ढुलाई")} −{" "}
          {inr(best.mandiFee)} {t("mandi fee", "मंडी शुल्क")}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-accent/20 p-3 text-xs text-accent-foreground">
        <Truck className="size-5" />
        {t(
          `Transport calculated at ₹${TRANSPORT_RATE_PER_KM}/km per trip (Kisan Sabha logistics).`,
          `ढुलाई ₹${TRANSPORT_RATE_PER_KM}/किमी प्रति फेरा (किसान सभा लॉजिस्टिक्स)।`,
        )}
      </div>

      <h2 className="mt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t("Sorted by net profit", "शुद्ध लाभ के क्रम में")}
      </h2>

      <div className="mt-2 space-y-3">
        {rows.map((r, i) => (
          <button
            key={r.mandi.id}
            onClick={() => choose(r.mandi.id)}
            className={`w-full rounded-3xl border-2 bg-card p-4 text-left shadow-card ${
              i === 0 ? "border-primary" : "border-transparent"
            }`}
          >
            {i === 0 && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-[11px] font-extrabold text-success-foreground">
                <Award className="size-3.5" />
                {t("RECOMMENDED · Highest Net Profit", "अनुशंसित · सर्वाधिक शुद्ध लाभ")}
              </span>
            )}
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold">{r.mandi.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.mandi.distanceKm} km · {r.mandi.district}
                </p>
              </div>
              <ArrowRight className="mt-1 size-5 text-primary" />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted p-2">
                <p className="text-[10px] text-muted-foreground">{t("Rate/qtl", "भाव/क्विं")}</p>
                <p className="text-sm font-bold">₹{r.ratePerQuintal}</p>
              </div>
              <div className="rounded-xl bg-muted p-2">
                <p className="text-[10px] text-muted-foreground">{t("Transport", "ढुलाई")}</p>
                <p className="text-sm font-bold text-destructive">−{inr(r.transport)}</p>
              </div>
              <div className="rounded-xl bg-primary-soft p-2">
                <p className="text-[10px] text-muted-foreground">{t("Net profit", "शुद्ध लाभ")}</p>
                <p className="text-sm font-extrabold text-primary">{inr(r.net)}</p>
              </div>
            </div>

            {i > 0 && (
              <p className="mt-2 text-[11px] font-semibold text-destructive">
                {inr(best.net - r.net)} {t("less than the best option", "सर्वोत्तम विकल्प से कम")}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-secondary p-3 text-[11px] text-secondary-foreground">
        {t(
          "Prices from AGMARKNET / data.gov.in (mock). Distances from Google Distance Matrix (mock).",
          "भाव एगमार्कनेट / data.gov.in से (मॉक)। दूरी गूगल डिस्टेंस मैट्रिक्स से (मॉक)।",
        )}
      </div>
    </AppShell>
  );
}
