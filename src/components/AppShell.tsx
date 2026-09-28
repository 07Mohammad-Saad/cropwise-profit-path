import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Sprout } from "lucide-react";
import { useApp, type Lang } from "@/lib/app-state";
import { BottomNav } from "./BottomNav";

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "hi", label: "हि" },
  { id: "mr", label: "म" },
];

export function LangToggle({ light }: { light?: boolean }) {
  const { lang, setLang } = useApp();
  return (
    <div className={`flex rounded-full p-0.5 ${light ? "bg-muted" : "bg-primary-foreground/15"}`}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          className={`min-w-9 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
            lang === l.id
              ? "bg-card text-primary shadow-card"
              : light
                ? "text-muted-foreground"
                : "text-primary-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-28 print:pb-0">
      <header className="sticky top-0 z-30 bg-gradient-to-br from-primary to-primary-deep px-4 pb-4 pt-4 text-primary-foreground shadow-brand print:static print:shadow-none">
        <div className="flex items-center gap-3">
          {back ? (
            <button
              onClick={() => router.history.back()}
              aria-label="Back"
              className="rounded-full bg-primary-foreground/15 p-2 print:hidden"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : (
            <Link to="/dashboard" className="rounded-full bg-primary-foreground/15 p-2" aria-label="CropWise">
              <Sprout className="size-6" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold leading-tight">{title}</h1>
            {subtitle ? <p className="truncate text-xs opacity-90">{subtitle}</p> : null}
          </div>
          <div className="print:hidden">
            <LangToggle />
          </div>
        </div>
      </header>
      <main className="px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
