import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, CheckCircle2, Truck, ShieldCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useApp, type Deal } from "@/lib/app-state";
import { BUYERS, CROPS, MANDIS, computeProfit, inr, safetyScore } from "@/lib/app-data";

export const Route = createFileRoute("/deal")({
  head: () => ({
    meta: [
      { title: "Lock Your Deal | Smart Mandi" },
      {
        name: "description",
        content:
          "Freeze the agreed price with a Deal ID and timestamp so no one renegotiates after delivery.",
      },
      { property: "og:title", content: "Lock Your Deal | Smart Mandi" },
      { property: "og:description", content: "Smart deal protection with a locked price." },
    ],
  }),
  component: DealPage,
});

function DealPage() {
  const { t, lang, selection, addDeal, setSelection } = useApp();
  const navigate = useNavigate();
  const [locked, setLocked] = useState<Deal | null>(null);

  const mandi = selection?.mandiId ? MANDIS.find((m) => m.id === selection.mandiId) : undefined;
  const buyer = selection?.buyerId ? BUYERS.find((b) => b.id === selection.buyerId) : undefined;

  if (!selection || !mandi || !buyer) {
    return (
      <AppShell back title={t("Deal", "सौदा")} subtitle={t("Step 5 of 5", "चरण 5 / 5")}>
        <div className="rounded-3xl bg-card p-6 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            {t("Pick a buyer to lock a deal.", "सौदा लॉक करने के लिए खरीदार चुनें।")}
          </p>
          <Link
            to="/input"
            className="mt-4 inline-block rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            {t("Start Again", "फिर से शुरू करें")}
          </Link>
        </div>
      </AppShell>
    );
  }

  const base = computeProfit(mandi, selection.crop, selection.qtyKg, selection.grade);
  const rate = base.ratePerQuintal + buyer.priceDelta;
  const gross = Math.round(rate * base.quintals);
  const mandiFee = Math.round(gross * 0.01);
  const net = gross - base.transport - mandiFee;
  const crop = CROPS.find((c) => c.id === selection.crop)!;

  const lockDeal = () => {
    const deal: Deal = {
      id: "TT-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      createdAt: new Date().toISOString(),
      crop: selection.crop,
      qtyKg: selection.qtyKg,
      grade: selection.grade,
      mandiName: mandi.name,
      buyerName: buyer.name,
      lockedRate: rate,
      transport: base.transport,
      net,
      status: "locked",
    };
    addDeal(deal);
    setLocked(deal);
    toast.success(t("Price locked successfully", "भाव सफलतापूर्वक लॉक हुआ"));
  };

  if (locked) {
    return (
      <AppShell title={t("Deal Locked", "सौदा लॉक")} subtitle={locked.id}>
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-6 text-center text-primary-foreground shadow-brand">
          <CheckCircle2 className="mx-auto size-16" />
          <p className="mt-3 text-xl font-extrabold">
            {t("Deal Locked Successfully!", "सौदा लॉक हो गया!")}
          </p>
          <p className="mt-1 text-sm opacity-90">
            {t(
              "Your price is frozen. The buyer cannot renegotiate.",
              "आपका भाव फ्रीज़ है। खरीदार अब मोलभाव नहीं कर सकता।",
            )}
          </p>
          <p className="mt-4 rounded-2xl bg-white/15 py-3 text-2xl font-extrabold tracking-widest">
            {locked.id}
          </p>
        </div>

        <div className="mt-4 rounded-3xl bg-card p-4 shadow-card">
          <Row label={t("Locked at", "लॉक समय")} value={new Date(locked.createdAt).toLocaleString()} />
          <Row label={t("Crop", "फसल")} value={`${crop.emoji} ${lang === "hi" ? crop.hi : crop.en}`} />
          <Row label={t("Quantity", "मात्रा")} value={`${locked.qtyKg} kg`} />
          <Row label={t("Buyer", "खरीदार")} value={locked.buyerName} />
          <Row label={t("Locked price", "लॉक भाव")} value={`₹${locked.lockedRate}/qtl`} />
          <Row label={t("Net profit", "शुद्ध लाभ")} value={inr(locked.net)} strong />
        </div>

        <div className="mt-4 rounded-3xl bg-secondary p-4 text-xs text-secondary-foreground">
          <p className="flex items-center gap-2 font-bold">
            <FileText className="size-4" /> {t("Terms", "शर्तें")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{t("Price valid for 48 hours from lock time.", "भाव लॉक से 48 घंटे तक मान्य।")}</li>
            <li>{t("Payment within agreed days of delivery.", "डिलीवरी के तय दिनों में भुगतान।")}</li>
            <li>{t("Quality re-grading at mandi may adjust weight only.", "मंडी में री-ग्रेडिंग से केवल वज़न बदल सकता है।")}</li>
          </ul>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to="/deals"
            className="flex-1 rounded-2xl bg-primary py-4 text-center text-base font-extrabold text-primary-foreground shadow-brand"
          >
            {t("View My Deals", "मेरे सौदे देखें")}
          </Link>
          <button
            onClick={() => {
              setSelection(null);
              navigate({ to: "/home" });
            }}
            className="flex-1 rounded-2xl bg-secondary py-4 text-base font-extrabold text-secondary-foreground"
          >
            {t("Done", "पूर्ण")}
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell back title={t("Deal Summary", "सौदा सारांश")} subtitle={t("Step 5 of 5", "चरण 5 / 5")}>
      <div className="rounded-3xl bg-card p-4 shadow-card">
        <Row label={t("Crop", "फसल")} value={`${crop.emoji} ${lang === "hi" ? crop.hi : crop.en}`} />
        <Row label={t("Quantity", "मात्रा")} value={`${selection.qtyKg} kg (${base.quintals} qtl)`} />
        <Row label={t("Quality", "गुणवत्ता")} value={`Grade ${selection.grade}`} />
        <Row label={t("Mandi", "मंडी")} value={`${mandi.name} · ${mandi.distanceKm} km`} />
        <Row label={t("Buyer", "खरीदार")} value={buyer.name} />
        <Row
          label={t("Buyer safety", "खरीदार भरोसा")}
          value={`${safetyScore(buyer)}/100 · ${buyer.paymentSuccess}%`}
        />
      </div>

      <div className="mt-4 rounded-3xl bg-card p-4 shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {t("Profit breakdown", "लाभ विवरण")}
        </p>
        <Row label={`${t("Rate", "भाव")} ₹${rate}/qtl × ${base.quintals}`} value={inr(gross)} />
        <Row
          label={`${t("Transport", "ढुलाई")} (${mandi.distanceKm} km × ₹5)`}
          value={`− ${inr(base.transport)}`}
        />
        <Row label={t("Mandi fee (1%)", "मंडी शुल्क (1%)")} value={`− ${inr(mandiFee)}`} />
        <div className="mt-2 flex items-center justify-between rounded-2xl bg-primary-soft px-3 py-3">
          <span className="text-sm font-bold">{t("Net profit", "शुद्ध लाभ")}</span>
          <span className="text-2xl font-extrabold text-primary">{inr(net)}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <p className="flex items-center gap-2 rounded-2xl bg-secondary p-3 text-secondary-foreground">
          <Truck className="size-4" />
          {t("Transport arranged via Kisan Sabha partner.", "ढुलाई किसान सभा पार्टनर से।")}
        </p>
        <p className="flex items-center gap-2 rounded-2xl bg-accent/20 p-3 text-accent-foreground">
          <ShieldCheck className="size-4" />
          {t(
            "Locking freezes this price for 48 hours.",
            "लॉक करने पर भाव 48 घंटे के लिए फ्रीज़ होगा।",
          )}
        </p>
      </div>

      <button
        onClick={lockDeal}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-lg font-extrabold text-primary-foreground shadow-brand active:scale-[0.99]"
      >
        <Lock className="size-5" /> {t("Lock This Deal", "यह सौदा लॉक करें")}
      </button>
    </AppShell>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-right text-sm ${strong ? "font-extrabold text-primary" : "font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}
