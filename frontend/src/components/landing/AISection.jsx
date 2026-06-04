"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import LandingSection from "./LandingSection";
import SectionHeader from "./SectionHeader";
import { staggerContainer, staggerItem } from "./motionPresets";

function PredictionCard({ prediction, featured }) {
  const spring = useSpring(0, { stiffness: 60, damping: 14 });
  useEffect(() => {
    spring.set(prediction.confidence ?? 70);
  }, [prediction.confidence, spring]);
  const width = useTransform(spring, (v) => `${v}%`);

  const risk =
    prediction.daysUntilRupture <= 7
      ? "Élevé"
      : prediction.daysUntilRupture <= 14
        ? "Modéré"
        : "Faible";

  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-2xl border p-6 backdrop-blur-xl ${
        featured
          ? "border-cyan-400/40 bg-gradient-to-br from-cyan-950/80 to-slate-900/80 shadow-[0_0_60px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-slate-900/50"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">{prediction.warehouseName}</p>
      <p className="mt-2 text-lg font-bold text-white">Risque {risk}</p>
      <p className="mt-1 text-sm text-slate-400">
        Rupture estimée sous {prediction.daysUntilRupture} jours
      </p>
      <p className="mt-4 line-clamp-2 text-xs text-cyan-200/80">{prediction.recommendation}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ width }}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[10px] text-cyan-400">
        Confiance {prediction.confidence}%
      </p>
    </motion.div>
  );
}

export default function AISection({ predictions }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const sorted = [...predictions].sort((a, b) => a.daysUntilRupture - b.daysUntilRupture);

  return (
    <LandingSection id="ai" className="border-t border-white/5">
      <SectionHeader
        badge="Intelligence artificielle"
        title="Anticipez les ruptures avant qu'elles coûtent cher"
        description="Modèles prédictifs entraînés sur vos flux de stock — recommandations actionnables par entrepôt."
      />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {sorted.map((p, i) => (
          <PredictionCard key={p.warehouseId} prediction={p} featured={i === 0} />
        ))}
      </motion.div>

      {sorted[0] && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500"
        >
          Priorité actuelle :{" "}
          <span className="text-cyan-300">{sorted[0].warehouseName}</span> —{" "}
          {sorted[0].recommendation}
        </motion.p>
      )}
    </LandingSection>
  );
}
