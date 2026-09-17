import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sprout, Phone, ShieldCheck, TrendingUp, Lock, Languages } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tech Titan — Smart Mandi | Farmer Login" },
      {
        name: "description",
        content:
          "Login with your phone number to discover the best mandi, the safest buyer and your real net profit.",
      },
      { property: "og:title", content: "Tech Titan — Smart Mandi | Farmer Login" },
      {
        property: "og:description",
        content: "One personalised selling decision for every farmer.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { t, lang, setLang, setFarmer } = useApp();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"splash" | "phone" | "otp">("splash");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setStage((s) => (s === "splash" ? "phone" : s)), 1600);
    return () => clearTimeout(id);
  }, []);

  const sendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error(t("Enter a valid 10-digit number", "सही 10 अंकों का नंबर डालें"));
      return;
    }
    setStage("otp");
    toast.success(t("OTP sent: 1234 (demo)", "OTP भेजा गया: 1234 (डेमो)"));
  };

  const verify = () => {
    if (otp.length !== 4) {
      toast.error(t("Enter the 4-digit OTP", "4 अंकों का OTP डालें"));
      return;
    }
    setFarmer({ name: "Ramesh Patil", phone, village: "Baramati, Pune" });
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-primary to-primary-deep px-6 py-10 text-primary-foreground">
      <div className="flex justify-end">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground"
        >
          <Languages className="size-4" />
          {lang === "en" ? "हिंदी" : "ENG"}
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="rounded-3xl bg-white/15 p-5">
          <Sprout className="size-14" />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Tech Titan</h1>
        <p className="text-xl font-bold text-accent">Smart Mandi</p>
        <p className="mt-3 text-sm leading-relaxed opacity-95">
          {t(
            "We don't just tell where price is high — we tell where actual earning is better and the buyer is reliable.",
            "हम सिर्फ़ यह नहीं बताते कि भाव कहाँ ऊँचा है — हम बताते हैं कि असली कमाई कहाँ ज़्यादा है और खरीदार कौन भरोसेमंद है।",
          )}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-widest opacity-70">
          SIH 2026 · Market Linkage & Price Discovery
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px]">
        {[
          { icon: TrendingUp, label: t("Best Net Profit", "सर्वोत्तम शुद्ध लाभ") },
          { icon: ShieldCheck, label: t("Safest Buyer", "भरोसेमंद खरीदार") },
          { icon: Lock, label: t("Deal Price Lock", "भाव लॉक") },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-2xl bg-white/12 px-2 py-3">
            <Icon className="mx-auto size-5 text-accent" />
            <p className="mt-1 font-semibold leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-3xl bg-card p-5 text-card-foreground shadow-brand">
        {stage === "splash" ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("Loading mandi prices…", "मंडी भाव लोड हो रहे हैं…")}
          </p>
        ) : stage === "phone" ? (
          <>
            <h2 className="text-lg font-bold">{t("Farmer Login", "किसान लॉगिन")}</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              {t("Login with your mobile number", "अपने मोबाइल नंबर से लॉगिन करें")}
            </p>
            <div className="flex items-center gap-2 rounded-2xl border border-input bg-background px-3">
              <Phone className="size-5 text-primary" />
              <span className="text-base font-semibold">+91</span>
              <input
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                className="w-full bg-transparent py-3.5 text-lg outline-none"
              />
            </div>
            <button
              onClick={sendOtp}
              className="mt-4 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-brand active:scale-[0.99]"
            >
              {t("Send OTP", "OTP भेजें")}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold">{t("Enter OTP", "OTP डालें")}</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              {t(`Sent to +91 ${phone} · demo OTP 1234`, `+91 ${phone} पर भेजा · डेमो OTP 1234`)}
            </p>
            <input
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="1234"
              className="w-full rounded-2xl border border-input bg-background py-3.5 text-center text-2xl font-bold tracking-[0.6em] outline-none"
            />
            <button
              onClick={verify}
              className="mt-4 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-brand active:scale-[0.99]"
            >
              {t("Verify & Continue", "सत्यापित करें")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
