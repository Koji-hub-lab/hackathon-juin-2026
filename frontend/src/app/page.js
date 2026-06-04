import CommandCenter from "@/components/command/CommandCenter";

export const metadata = {
  title: "Supply Chain Radar — Pilotage logistique IA",
  description:
    "Plateforme SaaS de supervision multi-entrepôts, radar 3D, alertes temps réel et prédiction de rupture de stock.",
};

export default function HomePage() {
  return <CommandCenter />;
}
