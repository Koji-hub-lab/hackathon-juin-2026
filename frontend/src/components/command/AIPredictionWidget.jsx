"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AIPredictionWidget({ prediction }) {
  const confidence = prediction?.confidence ?? 72;
  const spring = useSpring(0, { stiffness: 60, damping: 14 });

  useEffect(() => {
    spring.set(confidence);
  }, [confidence, spring]);

  const width = useTransform(spring, (v) => `${v}%`);

  if (!prediction) {
    return (
      <motion.div
        className="absolute bottom-6 left-4 z-30 w-[min(100%,240px)] rounded-2xl border border-cyan-500/20 bg-slate-900/45 p-4 backdrop-blur-[20px] lg:left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-xs text-slate-500">Prédiction IA en chargement…</p>
      </motion.div>
    );
  }

  const risk =
    prediction.daysUntilRupture <= 7
      ? "Élevé"
      : prediction.daysUntilRupture <= 14
        ? "Modéré"
        : "Faible";

  return (
    <motion.div
      className="absolute bottom-6 left-4 z-30 w-[min(100%,260px)] rounded-2xl border border-cyan-400/30 bg-slate-900/50 p-5 shadow-[0_0_48px_rgba(34,211,238,0.12)] backdrop-blur-[20px] lg:left-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring" }}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(34,211,238,0.15)",
            "0 0 36px rgba(34,211,238,0.35)",
            "0 0 20px rgba(34,211,238,0.15)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="rounded-xl"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
          Prédiction IA
        </p>
        <p className="mt-2 text-sm text-slate-400">Risque de rupture</p>
        <p className="text-xl font-bold text-white">{risk}</p>
        <p className="mt-1 text-sm text-cyan-200/90">{prediction.warehouseName}</p>
        <p className="mt-3 text-xs text-slate-500">Confiance modèle</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{ width }}
          />
        </div>
        <p className="mt-1 text-right font-mono text-xs text-cyan-400">
          {confidence}%
        </p>
      </motion.div>
    </motion.div>
  );
}
