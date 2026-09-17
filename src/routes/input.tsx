import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, MapPin, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-state";
import { CROPS, type CropId, type Grade } from "@/lib/app-data";

export const Route = createFileRoute("/input")({
  head: () => ({
    meta: [
      { title: "Enter Crop Details | Smart Mandi" },
      {
        name: "description",
        content: "Tell us your crop, quantity, quality grade and location — by typing or voice.",
      },
      { property: "og:title", content: "Enter Crop Details | Smart Mandi" },
      { property: "og:description", content: "Crop, quantity, grade and location in one screen." },
    ],
  }),
  component: InputPage,
});

const GRADES: { id: Grade; en: string; hi: string; note: string }[] = [
  { id: "A", en: "Grade A", hi: "ग्रेड ए", note: "+6%" },
  { id: "B", en: "Grade B", hi: "ग्रेड बी", note: "base" },
  { id: "C", en: "Grade C", hi: "ग्रेड सी", note: "-9%" },
];

function InputPage() {
  const { t, lang, selection, setSelection } = useApp();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<CropId>(selection?.crop ?? "onion");
  const [qty, setQty] = useState(String(selection?.qtyKg ?? 1000));
  const [grade, setGrade] = useState<Grade>(selection?.grade ?? "A");
  const [location, setLocation] = useState(selection?.location ?? "Baramati, Pune");
  const [listening, setListening] = useState(false);
  const [locating, setLocating] = useState(false);

  const voice = () => {
    setListening(true);
    toast(t("Listening… speak your crop", "सुन रहे हैं… अपनी फसल बोलें"));
    setTimeout(() => {
      setListening(false);
      setCrop("onion");
      setQty("1000");
      toast.success(
        t('Heard: "1000 kg onion, Grade A"', 'सुना: "1000 किलो प्याज, ग्रेड ए"'),
      );
    }, 1800);
  };

  const detect = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setLocation("Baramati, Pune (18.15°N, 74.58°E)");
      toast.success(t("Location detected via GPS", "GPS से स्थान मिला"));
    }, 1200);
  };

  const submit = () => {
    const qtyKg = Number(qty);
    if (!qtyKg || qtyKg < 50) {
      toast.error(t("Enter at least 50 kg", "कम से कम 50 किलो डालें"));
      return;
    }
    setSelection({ crop, qtyKg, grade, location });
    navigate({ to: "/markets" });
  };

  return (
    <AppShell
      back
      title={t("Crop Details", "फसल जानकारी")}
      subtitle={t("Step 1 of 5", "चरण 1 / 5")}
    >
      <button
        onClick={voice}
        className={`flex w-full items-center gap-3 rounded-3xl p-4 text-left shadow-brand ${
          listening ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {listening ? (
          <Loader2 className="size-8 animate-spin" />
        ) : (
          <Mic className="size-8 shrink-0" />
        )}
        <div>
          <p className="text-base font-extrabold">
            {listening ? t("Listening…", "सुन रहे हैं…") : t("Speak instead of typing", "बोलकर भरें")}
          </p>
          <p className="text-xs opacity-90">
            {t("Google Speech-to-Text · Hindi & English", "गूगल स्पीच-टू-टेक्स्ट · हिंदी व अंग्रेज़ी")}
          </p>
        </div>
      </button>

      <label className="mt-5 block text-sm font-bold">{t("Select Crop", "फसल चुनें")}</label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {CROPS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCrop(c.id)}
            className={`rounded-2xl border-2 p-3 text-center ${
              crop === c.id
                ? "border-primary bg-primary-soft"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <p className="mt-1 text-xs font-bold text-foreground">{lang === "hi" ? c.hi : c.en}</p>
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-bold">
        {t("Quantity (KG)", "मात्रा (किलो)")}
      </label>
      <input
        inputMode="numeric"
        value={qty}
        onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
        className="mt-2 w-full rounded-2xl border border-input bg-card px-4 py-4 text-2xl font-bold outline-none focus:border-primary"
      />
      <div className="mt-2 flex gap-2">
        {[500, 1000, 2000, 5000].map((v) => (
          <button
            key={v}
            onClick={() => setQty(String(v))}
            className="flex-1 rounded-xl bg-secondary py-2 text-xs font-bold text-secondary-foreground"
          >
            {v} kg
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-bold">{t("Quality Grade", "गुणवत्ता ग्रेड")}</label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {GRADES.map((g) => (
          <button
            key={g.id}
            onClick={() => setGrade(g.id)}
            className={`rounded-2xl border-2 py-3 ${
              grade === g.id ? "border-primary bg-primary-soft" : "border-border bg-card"
            }`}
          >
            <p className="text-sm font-extrabold">{lang === "hi" ? g.hi : g.en}</p>
            <p className="text-[11px] text-muted-foreground">{g.note}</p>
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-bold">{t("Your Location", "आपका स्थान")}</label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-input bg-card px-3">
        <MapPin className="size-5 text-primary" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent py-3.5 text-sm outline-none"
        />
      </div>
      <button
        onClick={detect}
        className="mt-2 w-full rounded-2xl bg-secondary py-3 text-sm font-bold text-secondary-foreground"
      >
        {locating ? t("Detecting…", "पता लगा रहे हैं…") : t("📍 Use GPS Location", "📍 GPS से लें")}
      </button>

      <button
        onClick={submit}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-extrabold text-primary-foreground shadow-brand active:scale-[0.99]"
      >
        {t("Find Best Mandi", "सर्वोत्तम मंडी देखें")} <ArrowRight className="size-5" />
      </button>
    </AppShell>
  );
}
