"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import LandingSection from "./LandingSection";
import SectionHeader from "./SectionHeader";
import { staggerContainer, staggerItem } from "./motionPresets";

const FEATURES = [
  {
    title: "Radar 3D immersif",
    description:
      "Visualisez le réseau comme un centre de commandement : hubs, flux et alertes sur une scène WebGL performante.",
    icon: "◎",
  },
  {
    title: "Cartographie nationale",
    description:
      "Contour Cameroun géoréférencé et villes positionnées sur données réelles — pas un schéma abstrait.",
    icon: "◈",
  },
  {
    title: "Prédiction de rupture",
    description:
      "IA qui estime les jours avant rupture, niveau de confiance et recommandations par entrepôt.",
    icon: "◆",
  },
  {
    title: "Alertes multi-niveaux",
    description:
      "Warning, danger, info — filtrées, historisées et poussées en live sur le dashboard.",
    icon: "△",
  },
  {
    title: "API & WebSocket",
    description:
      "FastAPI, PostgreSQL, STOMP — architecture prête pour la production avec repli mock intégré.",
    icon: "⬡",
  },
  {
    title: "Cockpit opérationnel",
    description:
      "Tableau de bord Donezo pour les équipes : KPI, secteurs HUD et accès rapide aux entrepôts.",
    icon: "▣",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <LandingSection id="features" fullHeight={false} className="border-t border-white/5 pb-32">
      <SectionHeader
        badge="Produit"
        title="Tout ce qu'il faut pour piloter une supply chain moderne"
        description="Une plateforme unifiée — de la vision stratégique à l'exécution terrain."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <motion.article
            key={f.title}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 transition-colors hover:border-cyan-500/30 hover:bg-slate-900/70"
          >
            <span className="text-2xl text-cyan-400">{f.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </LandingSection>
  );
}
