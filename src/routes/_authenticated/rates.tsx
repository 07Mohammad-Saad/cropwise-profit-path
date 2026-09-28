import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/rates")({
  head: () => ({
    meta: [
      { title: "Mandi Rates | CropWise" },
      { name: "description", content: "CropWise Mandi Rates for farmers." },
      { property: "og:title", content: "Mandi Rates | CropWise" },
      { property: "og:description", content: "CropWise Mandi Rates for farmers." },
    ],
  }),
  component: Prates,
});

function Prates() {
  return (
    <AppShell title="Mandi Rates">
      <p className="rounded-2xl bg-card p-4 text-muted-foreground shadow-card">Coming soon.</p>
    </AppShell>
  );
}
