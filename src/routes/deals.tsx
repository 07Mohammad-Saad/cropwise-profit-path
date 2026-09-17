import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Calendar, Store } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import { CROPS, inr } from "@/lib/app-data";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "My Deals | Smart Mandi" },
      {
        name: "description",
        content: "Every locked deal with its Deal ID, frozen price, transport cost and net profit.",
      },
      { property: "og:title", content: "My Deals | Smart Mandi" },
      { property: "og:description", content: "Your locked deals and total earnings." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const { t, lang, deals } = useApp();
  const total = deals.reduce((s, d) => s + d.net, 0);

  return (
    <AppShell title={t("My Deals", "मेरे सौदे")} subtitle={t("Price-locked contracts", "भाव-लॉक अनुबंध")}>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-primary-soft p-3">
          <p className="text-[11px] text-muted-foreground">{t("Total deals", "कुल सौदे")}</p>
          <p className="text-xl font-extrabold text-primary">{deals.length}</p>
        </div>
        <div className="rounded-2xl bg-accent/20 p-3">
          <p className="text-[11px] text-muted-foreground">{t("Total net profit", "कुल शुद्ध लाभ")}</p>
          <p className="text-xl font-extrabold text-accent-foreground">{inr(total)}</p>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="mt-4 rounded-3xl bg-card p-8 text-center shadow-card">
          <Lock className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {t("No deals locked yet.", "अभी कोई सौदा लॉक नहीं है।")}
          </p>
          <Link
            to="/input"
            className="mt-4 inline-block rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            {t("Sell My Crop", "अपनी फसल बेचें")}
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {deals.map((d) => {
            const crop = CROPS.find((c) => c.id === d.crop)!;
            return (
              <div key={d.id} className="rounded-3xl bg-card p-4 shadow-card">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{crop.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {lang === "hi" ? crop.hi : crop.en} · {d.qtyKg} kg · {t("Grade", "ग्रेड")}{" "}
                      {d.grade}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{d.buyerName}</p>
                  </div>
                  <span className="rounded-full bg-success px-2.5 py-1 text-[10px] font-extrabold text-success-foreground">
                    {t("LOCKED", "लॉक")}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Store className="size-3.5" /> {d.mandiName}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" /> {new Date(d.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-muted p-2">
                    <p className="text-[10px] text-muted-foreground">{t("Locked rate", "लॉक भाव")}</p>
                    <p className="text-sm font-bold">₹{d.lockedRate}</p>
                  </div>
                  <div className="rounded-xl bg-muted p-2">
                    <p className="text-[10px] text-muted-foreground">{t("Transport", "ढुलाई")}</p>
                    <p className="text-sm font-bold text-destructive">−{inr(d.transport)}</p>
                  </div>
                  <div className="rounded-xl bg-primary-soft p-2">
                    <p className="text-[10px] text-muted-foreground">{t("Net profit", "शुद्ध लाभ")}</p>
                    <p className="text-sm font-extrabold text-primary">{inr(d.net)}</p>
                  </div>
                </div>

                <p className="mt-2 text-center text-[11px] font-bold tracking-widest text-muted-foreground">
                  {t("DEAL ID", "डील आईडी")} {d.id}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
