import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | CropWise" },
      { name: "description", content: "CropWise Dashboard for farmers." },
      { property: "og:title", content: "Dashboard | CropWise" },
      { property: "og:description", content: "CropWise Dashboard for farmers." },
    ],
  }),
  component: Pdashboard,
});

function Pdashboard() {
  return (
    <AppShell title="Dashboard">
      <p className="rounded-2xl bg-card p-4 text-muted-foreground shadow-card">Coming soon.</p>
    </AppShell>
  );
}
