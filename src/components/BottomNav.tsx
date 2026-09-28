import { Link } from "@tanstack/react-router";
import { LayoutDashboard, PlusCircle, IndianRupee, History } from "lucide-react";
import { useApp } from "@/lib/app-state";

export function BottomNav() {
  const { t } = useApp();
  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("Home", "होम", "मुख्य") },
    { to: "/rates", icon: IndianRupee, label: t("Mandi", "मंडी", "बाजार") },
    { to: "/add", icon: PlusCircle, label: t("Add Crop", "फसल जोड़ें", "पीक जोडा"), big: true },
    { to: "/history", icon: History, label: t("History", "इतिहास", "इतिहास") },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-stretch border-t border-border bg-card pb-[env(safe-area-inset-bottom)] print:hidden">
      {items.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-muted-foreground"
          activeProps={{ className: "text-primary font-bold" }}
        >
          <Icon className="size-7" />
          <span className="text-xs leading-none">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
