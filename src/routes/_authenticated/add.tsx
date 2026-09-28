import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/add")({
  head: () => ({
    meta: [
      { title: "Add Crop | CropWise" },
      { name: "description", content: "CropWise Add Crop for farmers." },
      { property: "og:title", content: "Add Crop | CropWise" },
      { property: "og:description", content: "CropWise Add Crop for farmers." },
    ],
  }),
  component: Padd,
});

function Padd() {
  return (
    <AppShell title="Add Crop">
      <p className="rounded-2xl bg-card p-4 text-muted-foreground shadow-card">Coming soon.</p>
    </AppShell>
  );
}
