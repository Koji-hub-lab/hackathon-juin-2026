"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import LandingSection from "./LandingSection";
import SectionHeader from "./SectionHeader";
import { staggerContainer, staggerItem } from "./motionPresets";

function StatCard({ label, value, sub, accent }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl transition-shadow hover:border-cyan-400/40 hover:shadow-[0_0_48px_rgba(34,211,238,0.15)]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/90">
        {label}
      </p>
      <p
        className={`mt-3 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl ${
          accent === "danger" ? "text-orange-400" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-2 text-sm text-slate-500">{sub}</p>}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}

export default function KpiSection({
  warehouseCount,
  productCount,
  dangerCount,
  globalFill,
}) {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });

  const stats = [
    {
      label: "Entrepôts actifs",
      value: warehouseCount || "—",
      sub: "Hubs connectés sur le réseau national",
    },
    {
      label: "Produits suivis",
      value: productCount || "—",
      sub: "SKU monitorés en continu",
    },
    {
      label: "Alertes critiques",
      value: dangerCount,
      sub: dangerCount > 0 ? "Intervention recommandée" : "Aucune rupture imminente",
      accent: dangerCount > 0 ? "danger" : undefined,
    },
    {
      label: "Remplissage global",
      value: `${globalFill}%`,
      sub: "Capacité moyenne du réseau",
    },
  ];

  return (
    <LandingSection id="kpis" className="border-t border-white/5">
      <SectionHeader
        badge="Performance"
        title="Des indicateurs qui pilotent vos décisions"
        description="Visualisez la santé de votre chaîne logistique en un coup d'œil — sans tableur, sans délai."
      />

      <motion.div
        ref={gridRef}
        variants={staggerContainer}
        initial="hidden"
        animate={gridInView ? "visible" : "hidden"}
        className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>
    </LandingSection>
  );
}
