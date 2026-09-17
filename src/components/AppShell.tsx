import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Languages, Sprout } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  subtitle,
  back,
  children,
  nav = true,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  children: ReactNode;
  nav?: boolean;
}) {
  const { lang, setLang } = useApp();
  const router = useRouter();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <header className="sticky top-0 z-30 bg-gradient-to-br from-primary to-primary-deep px-4 pb-4 pt-4 text-primary-foreground shadow-brand">
        <div className="flex items-center gap-3">
          {back ? (
            <button
              onClick={() => router.history.back()}
              aria-label="Back"
              className="rounded-full bg-white/15 p-1.5"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : (
            <Link to="/home" className="rounded-full bg-white/15 p-1.5" aria-label="Home">
              <Sprout className="size-6" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight">{title}</h1>
            {subtitle ? <p className="truncate text-xs opacity-90">{subtitle}</p> : null}
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground"
          >
            <Languages className="size-4" />
            {lang === "en" ? "हिंदी" : "ENG"}
          </button>
        </div>
      </header>
      <main className="px-4 py-4">{children}</main>
      {nav ? <BottomNav /> : null}
    </div>
  );
}
