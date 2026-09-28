import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sprout, Phone, Lock, User, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-state";
import { LangToggle } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CropWise — Crop Profit Calculator for Farmers" },
      { name: "description", content: "Calculate crop cost, revenue and net profit with live mandi rates. Sign in with your phone number." },
      { property: "og:title", content: "CropWise — Crop Profit Calculator for Farmers" },
      { property: "og:description", content: "Know your real profit before you sell. Live mandi rates, Hindi & Marathi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const phoneEmail = (p: string) => `${p}@farmer.cropwise.app`;

function AuthPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = phone.replace(/\D/g, "");
    if (p.length !== 10) return toast.error(t("Enter a 10-digit mobile number", "10 अंकों का मोबाइल नंबर डालें", "10 अंकी मोबाईल नंबर टाका"));
    if (password.length < 6) return toast.error(t("Password must be at least 6 characters", "पासवर्ड कम से कम 6 अक्षर", "पासवर्ड किमान 6 अक्षरे"));
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error(t("Enter your name", "अपना नाम डालें", "आपले नाव टाका"));
        const { error } = await supabase.auth.signUp({
          email: phoneEmail(p),
          password,
          options: { data: { name: name.trim(), phone: p, village: village.trim(), district: district.trim() } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: phoneEmail(p), password });
        if (error) throw new Error(t("Wrong mobile number or password", "गलत मोबाइल नंबर या पासवर्ड", "चुकीचा मोबाईल नंबर किंवा पासवर्ड"));
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast.error(/already registered/i.test(msg) ? t("This number is already registered — please log in", "यह नंबर पहले से पंजीकृत है — लॉगिन करें", "हा नंबर आधीच नोंदणीकृत आहे — लॉगिन करा") : msg);
    } finally {
      setBusy(false);
    }
  };

  const field = "h-14 w-full rounded-2xl border border-input bg-card pl-12 pr-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="bg-gradient-to-br from-primary to-primary-deep px-6 pb-12 pt-6 text-primary-foreground">
        <div className="flex justify-end"><LangToggle /></div>
        <div className="mt-6 flex items-center gap-3">
          <div className="rounded-2xl bg-primary-foreground/15 p-3"><Sprout className="size-9" /></div>
          <div>
            <h1 className="text-3xl font-extrabold">CropWise</h1>
            <p className="text-sm opacity-90">{t("Know your real crop profit", "अपनी फसल का असली मुनाफ़ा जानें", "आपल्या पिकाचा खरा नफा जाणा")}</p>
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="-mt-6 flex-1 space-y-3 rounded-t-3xl bg-background px-5 pt-6">
        <div className="grid grid-cols-2 rounded-2xl bg-muted p-1">
          {(["login", "signup"] as const).map((m) => (
            <button type="button" key={m} onClick={() => setMode(m)} className={`h-12 rounded-xl text-base font-bold ${mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground"}`}>
              {m === "login" ? t("Login", "लॉगिन", "लॉगिन") : t("New account", "नया खाता", "नवीन खाते")}
            </button>
          ))}
        </div>
        {mode === "signup" && (
          <>
            <div className="relative"><User className="absolute left-4 top-4 size-6 text-muted-foreground" /><input className={field} placeholder={t("Full name", "पूरा नाम", "पूर्ण नाव")} value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative"><MapPin className="absolute left-4 top-4 size-6 text-muted-foreground" /><input className={field} placeholder={t("Village", "गाँव", "गाव")} value={village} onChange={(e) => setVillage(e.target.value)} /></div>
              <input className="h-14 w-full rounded-2xl border border-input bg-card px-4 text-lg outline-none focus:border-primary" placeholder={t("District", "ज़िला", "जिल्हा")} value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
          </>
        )}
        <div className="relative"><Phone className="absolute left-4 top-4 size-6 text-muted-foreground" /><input className={field} inputMode="numeric" maxLength={10} placeholder={t("Mobile number", "मोबाइल नंबर", "मोबाईल नंबर")} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} /></div>
        <div className="relative"><Lock className="absolute left-4 top-4 size-6 text-muted-foreground" /><input className={field} type="password" placeholder={t("Password", "पासवर्ड", "पासवर्ड")} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button disabled={busy} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-brand disabled:opacity-60">
          {busy && <Loader2 className="size-6 animate-spin" />}
          {mode === "login" ? t("Login", "लॉगिन करें", "लॉगिन करा") : t("Create account", "खाता बनाएँ", "खाते तयार करा")}
        </button>
        <p className="pb-8 pt-2 text-center text-xs text-muted-foreground">
          {t("Secure • Your data stays private", "सुरक्षित • आपका डेटा निजी है", "सुरक्षित • आपली माहिती खाजगी")}
        </p>
      </form>
    </div>
  );
}
