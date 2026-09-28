import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "My History | CropWise" },
      { name: "description", content: "CropWise My History for farmers." },
      { property: "og:title", content: "My History | CropWise" },
      { property: "og:description", content: "CropWise My History for farmers." },
    ],
  }),
  component: Phistory,
});

function Phistory() {
  return (
    <AppShell title="My History">
      <p className="rounded-2xl bg-card p-4 text-muted-foreground shadow-card">Coming soon.</p>
    </AppShell>
  );
}
