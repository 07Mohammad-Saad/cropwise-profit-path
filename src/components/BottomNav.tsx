import { Link } from "@tanstack/react-router";
import { Home, Store, FileCheck2, User } from "lucide-react";
import { useApp } from "@/lib/app-state";

export function BottomNav() {
  const { t } = useApp();
  const items = [
    { to: "/home", icon: Home, label: t("Home", "होम") },
    { to: "/markets", icon: Store, label: t("Markets", "मंडी") },
    { to: "/deals", icon: FileCheck2, label: t("My Deals", "मेरे सौदे") },
    { to: "/profile", icon: User, label: t("Profile", "प्रोफ़ाइल") },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-stretch border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      {items.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-muted-foreground"
          activeProps={{ className: "text-primary font-semibold" }}
        >
          <Icon className="size-6" />
          <span className="text-[11px] leading-none">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
