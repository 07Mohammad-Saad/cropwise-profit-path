import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Phone, Languages, LogOut, Sprout, Mic, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import { inr } from "@/lib/app-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile | Smart Mandi" },
      {
        name: "description",
        content: "Your farm details, language preference and lifetime earnings on Smart Mandi.",
      },
      { property: "og:title", content: "Farmer Profile | Smart Mandi" },
      { property: "og:description", content: "Farm details, language and earnings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang, setLang, farmer, deals, setFarmer, setSelection } = useApp();
  const navigate = useNavigate();
  const total = deals.reduce((s, d) => s + d.net, 0);

  const logout = () => {
    setFarmer(null);
    setSelection(null);
    toast.success(t("Logged out", "लॉग आउट हो गए"));
    navigate({ to: "/" });
  };

  return (
    <AppShell title={t("Profile", "प्रोफ़ाइल")} subtitle={farmer?.phone ?? ""}>
      <div className="rounded-3xl bg-card p-5 text-center shadow-card">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-soft text-4xl">
          👨‍🌾
        </div>
        <p className="mt-3 text-lg font-extrabold">{farmer?.name ?? "Ramesh Patil"}</p>
        <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {farmer?.village ?? "Baramati, Pune"}
        </p>
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Phone className="size-3.5" /> +91 {farmer?.phone ?? "98765 43210"}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-primary-soft p-3">
          <p className="text-[10px] text-muted-foreground">{t("Deals", "सौदे")}</p>
          <p className="text-lg font-extrabold text-primary">{deals.length}</p>
        </div>
        <div className="rounded-2xl bg-accent/20 p-3">
          <p className="text-[10px] text-muted-foreground">{t("Earned", "कमाई")}</p>
          <p className="text-lg font-extrabold text-accent-foreground">{inr(total)}</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3">
          <p className="text-[10px] text-muted-foreground">{t("Land", "ज़मीन")}</p>
          <p className="text-lg font-extrabold text-secondary-foreground">4.2 {t("acre", "एकड़")}</p>
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-card p-2 shadow-card">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left"
        >
          <Languages className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">{t("Language", "भाषा")}</span>
          <span className="text-sm font-bold text-primary">
            {lang === "en" ? "English" : "हिंदी"}
          </span>
        </button>
        <button
          onClick={() => toast(t("Voice input is always on", "वॉइस इनपुट हमेशा चालू है"))}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left"
        >
          <Mic className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">{t("Voice input", "वॉइस इनपुट")}</span>
          <span className="text-sm font-bold text-success">{t("On", "चालू")}</span>
        </button>
        <button
          onClick={() => toast(t("KYC verified farmer", "केवाईसी सत्यापित किसान"))}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left"
        >
          <ShieldCheck className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">{t("KYC status", "केवाईसी स्थिति")}</span>
          <span className="text-sm font-bold text-success">{t("Verified", "सत्यापित")}</span>
        </button>
        <button
          onClick={() => {
            setSelection(null);
            navigate({ to: "/input" });
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left"
        >
          <Sprout className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">
            {t("Start a new sale", "नई बिक्री शुरू करें")}
          </span>
        </button>
      </div>

      <button
        onClick={logout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-base font-bold text-secondary-foreground"
      >
        <LogOut className="size-5" /> {t("Logout", "लॉग आउट")}
      </button>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Tech Titan · Smart Mandi · SIH 2026
      </p>
    </AppShell>
  );
}
